// @ts-nocheck
import { eventModel } from '@/models/eventModel';
import { auditModel } from '@/models/auditModel';

function validateScope(user, department_id, faculty_id) {
  if (user.role === 'super_admin' || user.role === 'principal') return;
  if (user.role === 'dean' && user.facultyId !== faculty_id) {
    throw { status: 403, message: 'Cannot publish outside your faculty', code: 'FORBIDDEN' };
  }
  if ((user.role === 'hod' || user.role === 'faculty') && user.departmentId !== department_id) {
    throw { status: 403, message: 'Cannot publish outside your department', code: 'FORBIDDEN' };
  }
}

export const eventService = {
  async findAll(filters) {
    return eventModel.findAll(filters);
  },

  async create(user, data) {
    validateScope(user, data.department_id, data.faculty_id);
    const event = await eventModel.create({ ...data, author_id: user.id });
    await auditModel.log(user.id, 'create', 'event', event.id);
    return event;
  },

  async update(user, id, data) {
    const existing = await eventModel.findById(id);
    if (!existing) throw { status: 404, message: 'Event not found', code: 'NOT_FOUND' };
    
    validateScope(user, existing.department_id, existing.faculty_id);
    
    const updated = await eventModel.update(id, data);
    await auditModel.log(user.id, 'update', 'event', id);
    return updated;
  },

  async delete(user, id) {
    if (user.role !== 'super_admin') {
      throw { status: 403, message: 'Only Super Admin can delete events', code: 'FORBIDDEN' };
    }
    const deleted = await eventModel.softDelete(id);
    if (!deleted) throw { status: 404, message: 'Event not found', code: 'NOT_FOUND' };
    await auditModel.log(user.id, 'delete', 'event', id);
    return { success: true };
  }
};
