// @ts-nocheck

import { announcementModel } from '@/models/announcementModel';
import { webhookService } from './webhookService';

export const announcementService = {
  async findAll(filters) {
    return announcementModel.findAll(filters);
  },

  async create(user, data) {
    const announcement = await announcementModel.create({
      ...data,
      user_id: user.id,
    });

    webhookService.dispatch(
      data.is_alert
        ? 'alert.created'
        : 'announcement.created',
      announcement
    );

    return announcement;
  },

  async update(user, id, data) {
    const existing = await announcementModel.findById(id);

    if (!existing) {
      throw {
        status: 404,
        message: 'Announcement not found',
        code: 'NOT_FOUND',
      };
    }

    if (
      user.role !== 'super_admin' &&
      user.role !== 'principal' &&
      user.role !== 'dean' &&
      existing.user_id !== user.id
    ) {
      throw {
        status: 403,
        message: 'You cannot update this announcement',
        code: 'FORBIDDEN',
      };
    }

    return announcementModel.update(id, data);
  },

  async delete(user, id) {
    if (user.role !== 'super_admin') {
      throw {
        status: 403,
        message: 'Only Super Admin can delete notices',
        code: 'FORBIDDEN',
      };
    }

    const deleted = await announcementModel.delete(id);

    if (!deleted) {
      throw {
        status: 404,
        message: 'Announcement not found',
        code: 'NOT_FOUND',
      };
    }

    return {
      success: true,
    };
  },
};