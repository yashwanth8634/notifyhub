"use server";

import { eventService } from '@/services/eventService';
import { getSession } from '@/config/auth';
import { requireRole, PUBLISHING_ROLES, AuthError } from '@/lib/auth';
import { eventSchema, eventFiltersSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { EventFiltersInput } from '@/lib/validation';

export async function getEvents(filters: Partial<EventFiltersInput> = {}) {
  const validation = eventFiltersSchema.safeParse(filters);
  if (!validation.success) {
    throw new AuthError('VALIDATION_ERROR', 400, validation.error.issues[0].message);
  }
  return eventService.findAll(validation.data);
}

export async function createEvent(data: unknown) {
  const user = await getSession();
  const authUser = requireRole(user, PUBLISHING_ROLES);
  
  const validation = eventSchema.safeParse(data);
  if (!validation.success) {
    throw new AuthError('VALIDATION_ERROR', 400, validation.error.issues[0].message);
  }

  logger.info('Creating event', {
    action: 'event_create',
    userId: user?.id,
  });

  return eventService.create(authUser, validation.data);
}

export async function updateEvent(id: number, data: unknown) {
  const user = await getSession();
  const authUser = requireRole(user, ['super_admin']);
  
  const validation = eventSchema.partial().safeParse(data);
  if (!validation.success) {
    throw new AuthError('VALIDATION_ERROR', 400, validation.error.issues[0].message);
  }

  logger.info('Updating event', {
    action: 'event_update',
    userId: user?.id,
    metadata: { eventId: id },
  });

  return eventService.update(authUser, id, validation.data);
}

export async function deleteEvent(id: number) {
  const user = await getSession();
  const authUser = requireRole(user, ['super_admin']);
  
  logger.info('Deleting event', {
    action: 'event_delete',
    userId: user?.id,
    metadata: { eventId: id },
  });

  return eventService.delete(authUser, id);
}