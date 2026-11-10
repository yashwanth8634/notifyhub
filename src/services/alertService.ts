import { announcementService } from './announcementService';
import { Announcement, AnnouncementFilters } from '@/types';

interface AuthUser {
  id: number;
  role: string;
}

interface AlertCreateData {
  title: string;
  body: string;
  category?: string | null;
  department?: string | null;
}

interface AlertUpdateData {
  title?: string | null;
  body?: string | null;
  category?: string | null;
  department?: string | null;
}

export const alertService = {
  async findAll(filters: AnnouncementFilters = {}): Promise<Announcement[]> {
    return announcementService.findAll({ ...filters, is_alert: true });
  },

  async create(user: AuthUser, data: AlertCreateData): Promise<Announcement> {
    return announcementService.create(user, { ...data, is_alert: true });
  },

  async update(user: AuthUser, id: number, data: AlertUpdateData): Promise<Announcement | null> {
    return announcementService.update(user, id, data);
  },

  async delete(user: AuthUser, id: number): Promise<{ success: boolean }> {
    return announcementService.delete(user, id);
  },
};