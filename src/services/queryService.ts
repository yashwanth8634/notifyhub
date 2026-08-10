// @ts-nocheck
import { queryModel } from '@/models/queryModel';

export const queryService = {
  async findAllForUser(user) {
    if (user.role === 'super_admin') {
      return queryModel.findAll();
    }
    // All admin roles can view all queries
    return queryModel.findAll();
  },

  async create(user, data) {
    return queryModel.create({
      name: data.name || user.name,
      roll_no: data.roll_no,
      email: data.email || user.email,
      subject: data.subject,
      message: data.message,
    });
  },

  async createAnonymous(data) {
    return queryModel.create({
      name: data.name,
      roll_no: data.roll_no,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });
  },

  async respond(user, id, responseData) {
    const existing = await queryModel.findById(id);
    if (!existing) throw { status: 404, message: 'Query not found', code: 'NOT_FOUND' };

    return queryModel.respond(id, responseData);
  }
};
