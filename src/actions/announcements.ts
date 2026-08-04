"use server";

import { announcementService } from '@/services/announcementService';
import { getSession } from '@/config/auth';

const publishingRoles = ['principal', 'dean', 'hod', 'faculty', 'super_admin'];

function requireRole(user: any, roles: string[]) {
  if (!user) throw new Error('UNAUTHORIZED');
  if (roles.length > 0 && !roles.includes(user.role)) {
    throw new Error('FORBIDDEN');
  }
}

export async function getAnnouncements(filters = {}) {
  return announcementService.findAll(filters);
}

export async function createAnnouncement(data: any) {
  const user = await getSession();
  requireRole(user, publishingRoles);
  return announcementService.create(user, data);
}

export async function updateAnnouncement(id: number, data: any) {
  const user = await getSession();
  requireRole(user, publishingRoles);
  return announcementService.update(user, id, data);
}

export async function deleteAnnouncement(id: number) {
  const user = await getSession();
  requireRole(user, ['super_admin']);
  return announcementService.delete(user, id);
}
