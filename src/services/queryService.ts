// @ts-nocheck
import { queryModel } from '@/models/queryModel';

export const queryService = {
  async findAllForUser(user) {
    if (user.role === 'student') {
      return queryModel.findByStudentId(user.id);
    } else if (user.role === 'super_admin') {
      return queryModel.findAll();
    } else if (user.role === 'hod') {
      // Return queries specifically assigned to this HoD
      return queryModel.findAll({ assigned_to: user.id });
    }
    return [];
  },

  async create(user, data) {
    if (user.role !== 'student') {
       throw { status: 403, message: 'Only students can submit queries', code: 'FORBIDDEN' };
    }
    return queryModel.create({ ...data, student_id: user.id });
  },

  async createAnonymous(data) {
    return queryModel.createAnonymous(data);
  },

  async respond(user, id, responseData) {
    const existing = await queryModel.findById(id);
    if (!existing) throw { status: 404, message: 'Query not found', code: 'NOT_FOUND' };

    if (user.role !== 'super_admin' && existing.assigned_to !== user.id) {
       throw { status: 403, message: 'Not authorized to respond to this query', code: 'FORBIDDEN' };
    }

    const updated = await queryModel.respond(id, responseData);
    
    // SLA tracking logic could be added here (e.g., alert if > 6 hrs)
    
    return updated;
  }
};
