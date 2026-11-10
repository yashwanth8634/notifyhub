"use server";

import { userService } from '@/services/userService';
import { userModel } from '@/models/userModel';
import { getSession } from '@/config/auth';
import { requireRole, AuthError } from '@/lib/auth';
import { createUserSchema, updateUserSchema, resetPasswordSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';

export async function getUsers() {
  const user = await getSession();
  const actor = requireRole(user, ['super_admin', 'principal', 'dean', 'hod']);
  return userService.findAll(actor as { id: number; role: import('@/types').Role; departmentId?: number });
}

export async function getDepartments() {
  const user = await getSession();
  const actor = requireRole(user, ['super_admin', 'principal', 'dean', 'hod']);
  const departments = await userModel.findDepartments();
  if (actor.role === 'hod') {
    return departments.filter((department) => department.id === actor.departmentId);
  }
  return departments;
}

export async function createUser(data: unknown) {
  const user = await getSession();
  const actor = requireRole(user, ['super_admin', 'principal', 'dean', 'hod']);
  
  const validation = createUserSchema.safeParse(data);
  if (!validation.success) {
    return { success: false as const, error: validation.error.issues[0].message };
  }

  logger.info('Creating user', {
    action: 'user_create',
    userId: user?.id,
    metadata: { email: validation.data.email, role: validation.data.role },
  });

  return {
    success: true as const,
    user: await userService.create(
      actor as { id: number; role: import('@/types').Role; departmentId?: number },
      validation.data,
    ),
  };
}

export async function updateUser(id: number, data: unknown) {
  const user = await getSession();
  requireRole(user, ['super_admin']);
  
  const validation = updateUserSchema.safeParse(data);
  if (!validation.success) {
    throw new AuthError('VALIDATION_ERROR', 400, validation.error.issues[0].message);
  }

  logger.info('Updating user', {
    action: 'user_update',
    userId: user?.id,
    metadata: { targetUserId: id },
  });

  return userService.update(user!.id, id, validation.data);
}

export async function deactivateUser(id: number) {
  const user = await getSession();
  requireRole(user, ['super_admin']);
  
  logger.info('Deactivating user', {
    action: 'user_deactivate',
    userId: user?.id,
    metadata: { targetUserId: id },
  });

  return userService.deactivate(user!.id, id);
}

export async function resetPassword(id: number, newPassword: string) {
  const user = await getSession();
  requireRole(user, ['super_admin']);
  
  const validation = resetPasswordSchema.safeParse({ newPassword });
  if (!validation.success) {
    throw new AuthError('VALIDATION_ERROR', 400, validation.error.issues[0].message);
  }

  logger.info('Resetting password', {
    action: 'user_reset_password',
    userId: user?.id,
    metadata: { targetUserId: id },
  });

  return userService.resetPassword(user!.id, id, validation.data.newPassword);
}

export async function reactivateUser(id: number) {
  const user = await getSession();
  requireRole(user, ['super_admin']);
  
  logger.info('Reactivating user', {
    action: 'user_reactivate',
    userId: user?.id,
    metadata: { targetUserId: id },
  });

  return userService.reactivate(user!.id, id);
}

export async function deleteUser(id: number) {
  const user = await getSession();
  requireRole(user, ['super_admin']);
  
  logger.info('Deleting user', {
    action: 'user_delete',
    userId: user?.id,
    metadata: { targetUserId: id },
  });

  const deleted = await userModel.delete(id);
  if (!deleted) throw new AuthError('NOT_FOUND', 404, 'User not found');
  return { success: true };
}