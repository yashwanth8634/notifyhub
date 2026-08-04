"use server";

import { authService } from '@/services/authService';
import { cookies } from 'next/headers';
import { getSession } from '@/config/auth';

export async function loginAction(email: string, password: string) {
  try {
    const { user, token } = await authService.login(email, password);
    const cookieStore = await cookies();
    cookieStore.set('notifyhub_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400, // 24 hours
      path: '/',
    });
    return { success: true, user, token };
  } catch (error: any) {
    return { success: false, error: error.message || 'Login failed' };
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
