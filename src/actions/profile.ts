"use server";

import { getSession } from "@/config/auth";
import { userModel } from "@/models/userModel";
import { authService } from "@/services/authService";
import { requireAuth, AuthError } from '@/lib/auth';
import { profileUpdateSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';

export async function getProfile() {
  const user = await getSession();
  requireAuth(user);
  
  const dbUser = await userModel.findById(user.id);
  if (!dbUser) throw new AuthError('NOT_FOUND', 404, 'User not found');
  
  return {
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
  };
}

export async function updateProfile(data: unknown) {
  const user = await getSession();
  requireAuth(user);
  
  const validation = profileUpdateSchema.safeParse(data);
  if (!validation.success) {
    throw new AuthError('VALIDATION_ERROR', 400, validation.error.issues[0].message);
  }

  // Check if they are updating password
  if (validation.data.password) {
    const hash = await authService.hashPassword(validation.data.password);
    await userModel.updatePassword(user.id, hash);
    
    logger.info('Password updated', {
      action: 'profile_password_update',
      userId: user.id,
    });
  }

  // Update name and email if provided
  await userModel.updateProfile(user.id, {
    name: validation.data.name ?? null,
    email: validation.data.email ?? null,
  });

  logger.info('Profile updated', {
    action: 'profile_update',
    userId: user.id,
    metadata: { fields: Object.keys(validation.data).filter(k => validation.data[k as keyof typeof validation.data] !== undefined) },
  });

  return { success: true };
}