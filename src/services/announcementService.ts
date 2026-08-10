// @ts-nocheck
import { announcementModel } from '@/models/announcementModel';
import { webhookService } from './webhookService';

/**
 * Validates that the user has permission to publish to the given department.
 * Super admins and principals can publish anywhere.
 * HODs and faculty can only publish to their own department.
 */
function validateScope(user, department_id) {
  if (user.role === 'super_admin' || user.role === 'principal') return;
  if (user.role === 'dean') return; // Deans can publish to any department
  if ((user.role === 'hod' || user.role === 'faculty') && user.departmentId !== department_id) {
    throw { status: 403, message: 'Cannot publish outside your department', code: 'FORBIDDEN' };
  }
}

export const announcementService = {
  async findAll(filters) {
    return announcementModel.findAll(filters);
  },

  async create(user, data) {
    validateScope(user, data.department_id);
    const announcement = await announcementModel.create({ ...data, user_id: user.id });
    webhookService.dispatch(data.is_alert ? 'alert.created' : 'announcement.created', announcement);
    return announcement;
  },

  async update(user, id, data) {
    const existing = await announcementModel.findById(id);
    if (!existing) throw { status: 404, message: 'Announcement not found', code: 'NOT_FOUND' };
    validateScope(user, existing.department_id);
    return announcementModel.update(id, data);
  },

  async delete(user, id) {
    if (user.role !== 'super_admin') {
      throw { status: 403, message: 'Only Super Admin can delete notices', code: 'FORBIDDEN' };
    }
    const deleted = await announcementModel.softDelete(id);
    if (!deleted) throw { status: 404, message: 'Announcement not found', code: 'NOT_FOUND' };
    return { success: true };
  }
};
