"use server";

import { authService } from '@/services/authService';
import { cookies } from 'next/headers';
import { getSession } from '@/config/auth';
import { loginSchema } from '@/lib/validation';
import { loginRateLimiter } from '@/lib/rateLimit';
import { AuthError } from '@/lib/auth';
import { logger } from '@/lib/logger';

function getClientIp(): string {
  return 'unknown';
}

export async function loginAction(email: string, password: string) {
  const correlationId = `login-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const clientIp = getClientIp();
  
  const rateLimit = loginRateLimiter(clientIp);
  if (!rateLimit.allowed) {
    logger.warn('Login rate limit exceeded', {
      correlationId,
      action: 'login_rate_limited',
      metadata: { ip: clientIp, retryAfterMs: rateLimit.retryAfterMs },
    });
    return { 
      success: false, 
      error: 'Too many login attempts. Please try again later.',
      retryAfterMs: rateLimit.retryAfterMs,
    };
  }

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return { 
      success: false, 
      error: validation.error.issues[0].message 
    };
  }

  try {
    const { user, token } = await authService.login(validation.data.email, validation.data.password);
    const cookieStore = await cookies();
    cookieStore.set('notifyhub_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });
    
    logger.info('User logged in successfully', {
      correlationId,
      action: 'login_success',
      userId: user.id,
    });
    
    return { success: true, user, token };
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    logger.warn('Login failed', {
      correlationId,
      action: 'login_failed',
      metadata: { email: validation.data.email, error: err.message },
    });
    
    if (error instanceof AuthError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Login failed' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('notifyhub_token');
  return { success: true };
}

export async function getSessionAction() {
  const session = await getSession();
  return { session };
}