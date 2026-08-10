// @ts-nocheck
import { eventModel } from '@/models/eventModel';

/**
 * Validates that the user has permission to manage events in the given department.
 */
function validateScope(user, department_id) {
  if (user.role === 'super_admin' || user.role === 'principal') return;
  if (user.role === 'dean') return;
  if ((user.role === 'hod' || user.role === 'faculty') && user.departmentId !== department_id) {
    throw { status: 403, message: 'Cannot publish outside your department', code: 'FORBIDDEN' };
  }
}

export const eventService = {
  async findAll(filters) {
    return eventModel.findAll(filters);
  },

  async create(user, data) {
    validateScope(user, data.department_id);
    return eventModel.create({ ...data, user_id: user.id });
  },

  async update(user, id, data) {
    const existing = await eventModel.findById(id);
    if (!existing) throw { status: 404, message: 'Event not found', code: 'NOT_FOUND' };
    validateScope(user, existing.department_id);
    return eventModel.update(id, data);
  },

  async delete(user, id) {
    if (user.role !== 'super_admin') {
      throw { status: 403, message: 'Only Super Admin can delete events', code: 'FORBIDDEN' };
    }
    const deleted = await eventModel.softDelete(id);
    if (!deleted) throw { status: 404, message: 'Event not found', code: 'NOT_FOUND' };
    return { success: true };
  }
};
