"use server";

import { alertService } from '@/services/alertService';
import { getSession } from '@/config/auth';
import { requireRole, PUBLISHING_ROLES, AuthError } from '@/lib/auth';
import { announcementSchema, announcementFiltersSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { AnnouncementFiltersInput } from '@/lib/validation';

export async function getAlerts(filters: AnnouncementFiltersInput = {}) {
  const validation = announcementFiltersSchema.safeParse(filters);
  if (!validation.success) {
    throw new AuthError('VALIDATION_ERROR', 400, validation.error.issues[0].message);
  }
  return alertService.findAll(validation.data);
}

export async function createAlert(data: unknown) {
  const user = await getSession();
  requireRole(user, PUBLISHING_ROLES);
  
  const validation = announcementSchema.safeParse(data);
  if (!validation.success) {
    throw new AuthError('VALIDATION_ERROR', 400, validation.error.issues[0].message);
  }

  logger.info('Creating alert', {
    action: 'alert_create',
    userId: user?.id,
  });

  return alertService.create(user, validation.data);
}

export async function updateAlert(id: number, data: unknown) {
  const user = await getSession();
  requireRole(user, PUBLISHING_ROLES);
  
  const validation = announcementSchema.partial().safeParse(data);
  if (!validation.success) {
    throw new AuthError('VALIDATION_ERROR', 400, validation.error.issues[0].message);
  }

  logger.info('Updating alert', {
    action: 'alert_update',
    userId: user?.id,
    metadata: { alertId: id },
  });

  return alertService.update(user, id, validation.data);
}

export async function deleteAlert(id: number) {
  const user = await getSession();
  requireRole(user, ['super_admin']);
  
  logger.info('Deleting alert', {
    action: 'alert_delete',
    userId: user?.id,
    metadata: { alertId: id },
  });

  return alertService.delete(user, id);
}