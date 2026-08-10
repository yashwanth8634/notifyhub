"use server";

import { userService } from '@/services/userService';
import { userModel } from '@/models/userModel';
import { getSession } from '@/config/auth';

function requireRole(user: any, roles: string[]) {
  if (!user) throw new Error('UNAUTHORIZED');
  if (roles.length > 0 && !roles.includes(user.role)) {
    throw new Error('FORBIDDEN');
  }
}

export async function getUsers() {
  const user = await getSession();
  requireRole(user, ['super_admin']);
  return userService.findAll();
}

export async function createUser(data: any) {
  const user = await getSession();
  requireRole(user, ['super_admin']);
  return userService.create(user!.id, data);
}

export async function updateUser(id: number, data: any) {
  const user = await getSession();
  requireRole(user, ['super_admin']);
  return userService.update(user!.id, id, data);
}

export async function deactivateUser(id: number) {
  const user = await getSession();
  requireRole(user, ['super_admin']);
  return userService.deactivate(user!.id, id);
}

export async function resetPassword(id: number, newPassword: string) {
  const user = await getSession();
  requireRole(user, ['super_admin']);
  return userService.resetPassword(user!.id, id, newPassword);
}

export async function reactivateUser(id: number) {
  const user = await getSession();
  requireRole(user, ['super_admin']);
  return userService.reactivate(user!.id, id);
}

export async function deleteUser(id: number) {
  const user = await getSession();
  requireRole(user, ['super_admin']);
  const deleted = await userModel.delete(id);
  if (!deleted) throw new Error('NOT_FOUND');
  return { success: true };
}
