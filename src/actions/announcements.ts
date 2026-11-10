"use server";

import { announcementService } from '@/services/announcementService';
import { getSession } from '@/config/auth';
import { requireRole, PUBLISHING_ROLES, AuthError } from '@/lib/auth';
import { announcementSchema, announcementFiltersSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { AnnouncementFiltersInput } from '@/lib/validation';

export async function getAnnouncements(filters: Partial<AnnouncementFiltersInput> = {}) {
  const validation = announcementFiltersSchema.safeParse(filters);
  if (!validation.success) {
    throw new AuthError('VALIDATION_ERROR', 400, validation.error.issues[0].message);
  }
  return announcementService.findAll(validation.data);
}

export async function createAnnouncement(data: unknown) {
  const user = await getSession();
  const authUser = requireRole(user, PUBLISHING_ROLES);
  
  const validation = announcementSchema.safeParse(data);
  if (!validation.success) {
    throw new AuthError('VALIDATION_ERROR', 400, validation.error.issues[0].message);
  }

  logger.info('Creating announcement', {
    action: 'announcement_create',
    userId: user?.id,
    metadata: { isAlert: validation.data.is_alert },
  });

  return announcementService.create(authUser, validation.data);
}

export async function updateAnnouncement(id: number, data: unknown) {
  const user = await getSession();
  const authUser = requireRole(user, PUBLISHING_ROLES);
  
  const validation = announcementSchema.partial().safeParse(data);
  if (!validation.success) {
    throw new AuthError('VALIDATION_ERROR', 400, validation.error.issues[0].message);
  }

  logger.info('Updating announcement', {
    action: 'announcement_update',
    userId: user?.id,
    metadata: { announcementId: id },
  });

  return announcementService.update(authUser, id, validation.data);
}

export async function deleteAnnouncement(id: number) {
  const user = await getSession();
  const authUser = requireRole(user, ['super_admin']);
  
  logger.info('Deleting announcement', {
    action: 'announcement_delete',
    userId: user?.id,
    metadata: { announcementId: id },
  });

  return announcementService.delete(authUser, id);
}