"use server";

import { alertService } from '@/services/alertService';
import { getSession } from '@/config/auth';

const publishingRoles = ['principal', 'dean', 'hod', 'faculty', 'super_admin'];

function requireRole(user: any, roles: string[]) {
  if (!user) throw new Error('UNAUTHORIZED');
  if (roles.length > 0 && !roles.includes(user.role)) {
    throw new Error('FORBIDDEN');
  }
}

export async function getAlerts(filters = {}) {
  return alertService.findAll(filters);
}

export async function createAlert(data: any) {
  const user = await getSession();
  requireRole(user, publishingRoles);
  return alertService.create(user, data);
}

export async function updateAlert(id: number, data: any) {
  const user = await getSession();
  requireRole(user, publishingRoles);
  return alertService.update(user, id, data);
}

export async function deleteAlert(id: number) {
  const user = await getSession();
  requireRole(user, ['super_admin']);
  return alertService.delete(user, id);
}
