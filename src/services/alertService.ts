// @ts-nocheck
import { announcementService } from './announcementService';

export const alertService = {
  async findAll(filters) {
    return announcementService.findAll({ ...filters, is_alert: true });
  },

  async create(user, data) {
    return announcementService.create(user, { ...data, is_alert: true });
  },

  async update(user, id, data) {
    return announcementService.update(user, id, data);
  },

  async delete(user, id) {
    return announcementService.delete(user, id);
  }
};
