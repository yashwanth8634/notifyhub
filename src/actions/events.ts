"use server";

import { eventService } from '@/services/eventService';
import { getSession } from '@/config/auth';

const publishingRoles = ['principal', 'dean', 'hod', 'faculty', 'super_admin'];

function requireRole(user: any, roles: string[]) {
  if (!user) throw new Error('UNAUTHORIZED');
  if (roles.length > 0 && !roles.includes(user.role)) {
    throw new Error('FORBIDDEN');
  }
}

export async function getEvents(filters = {}) {
  return eventService.findAll(filters);
}

export async function createEvent(data: any) {
  const user = await getSession();
  requireRole(user, publishingRoles);
  return eventService.create(user, data);
}

export async function updateEvent(id: number, data: any) {
  const user = await getSession();
  requireRole(user, publishingRoles);
  return eventService.update(user, id, data);
}

export async function deleteEvent(id: number) {
  const user = await getSession();
  requireRole(user, ['super_admin']);
  return eventService.delete(user, id);
}
