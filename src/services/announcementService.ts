import { announcementModel } from '@/models/announcementModel';
import { webhookService } from './webhookService';
import { pushNotificationService } from './pushNotificationService';
import { AuthError } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { User, Announcement, AnnouncementFilters } from '@/types';

interface AnnouncementCreateData {
  title: string;
  body: string;
  category?: string | null;
  department?: string | null;
  is_alert?: boolean;
}

interface AnnouncementUpdateData {
  title?: string | null;
  body?: string | null;
  category?: string | null;
  department?: string | null;
  is_alert?: boolean | null;
}

interface AuthUser {
  id: number;
  role: string;
}

export const announcementService = {
  async findAll(filters: AnnouncementFilters = {}): Promise<Announcement[]> {
    return announcementModel.findAll(filters);
  },

  async create(user: AuthUser, data: AnnouncementCreateData): Promise<Announcement> {
    const announcement = await announcementModel.create({
      ...data,
      category: data.category ?? null,
      department: data.department ?? null,
      user_id: user.id,
    });

    webhookService.dispatch(
      data.is_alert
        ? 'alert.created'
        : 'announcement.created',
      announcement
    );
    void pushNotificationService.dispatch({
      title: data.is_alert ? 'New urgent alert' : 'New announcement',
      body: data.title,
      url: data.is_alert ? '/alerts' : '/announcements',
      tag: data.is_alert ? 'alert-created' : 'announcement-created',
    }).catch((error) => {
      logger.error('Push notification dispatch failed', {
        action: 'push_dispatch_failed',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
    });

    return announcement;
  },

  async update(user: AuthUser, id: number, data: AnnouncementUpdateData): Promise<Announcement | null> {
    const existing = await announcementModel.findById(id);

    if (!existing) {
      throw new AuthError('NOT_FOUND', 404, 'Announcement not found');
    }

    const canUpdate = user.role === 'super_admin' || 
                      user.role === 'principal' || 
                      user.role === 'dean' || 
                      existing.user_id === user.id;

    if (!canUpdate) {
      throw new AuthError('FORBIDDEN', 403, 'You cannot update this announcement');
    }

    return announcementModel.update(id, data);
  },

  async delete(user: AuthUser, id: number): Promise<{ success: boolean }> {
    if (user.role !== 'super_admin') {
      throw new AuthError('FORBIDDEN', 403, 'Only Super Admin can delete notices');
    }

    const deleted = await announcementModel.delete(id);

    if (!deleted) {
      throw new AuthError('NOT_FOUND', 404, 'Announcement not found');
    }

    return { success: true };
  },
};