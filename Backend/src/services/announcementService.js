import { announcementModel } from '../models/announcementModel.js';
import { auditModel } from '../models/auditModel.js';
import { webhookService } from './webhookService.js';

function validateScope(user, department_id, faculty_id) {
  if (user.role === 'super_admin' || user.role === 'principal') return;
  if (user.role === 'dean' && user.facultyId !== faculty_id) {
    throw { status: 403, message: 'Cannot publish outside your faculty', code: 'FORBIDDEN' };
  }
  if ((user.role === 'hod' || user.role === 'faculty') && user.departmentId !== department_id) {
    throw { status: 403, message: 'Cannot publish outside your department', code: 'FORBIDDEN' };
  }
}

export const announcementService = {
  async findAll(filters) {
    return announcementModel.findAll(filters);
  },

  async create(user, data) {
    validateScope(user, data.department_id, data.faculty_id);
    const announcement = await announcementModel.create({ ...data, author_id: user.id });
    await auditModel.log(user.id, 'create', 'announcement', announcement.id);
    
    webhookService.dispatch(data.is_alert ? 'alert.created' : 'announcement.created', announcement);
    return announcement;
  },

  async update(user, id, data) {
    const existing = await announcementModel.findById(id);
    if (!existing) throw { status: 404, message: 'Announcement not found', code: 'NOT_FOUND' };
    
    // Check if user has permission to edit this specific notice
    validateScope(user, existing.department_id, existing.faculty_id);
    
    const updated = await announcementModel.update(id, data);
    await auditModel.log(user.id, 'update', 'announcement', id);
    return updated;
  },

  async delete(user, id) {
    // Only super_admin can delete - guaranteed by route middleware, but enforced here too
    if (user.role !== 'super_admin') {
      throw { status: 403, message: 'Only Super Admin can delete notices', code: 'FORBIDDEN' };
    }
    const deleted = await announcementModel.softDelete(id);
    if (!deleted) throw { status: 404, message: 'Announcement not found', code: 'NOT_FOUND' };
    await auditModel.log(user.id, 'delete', 'announcement', id);
    return { success: true };
  }
};
