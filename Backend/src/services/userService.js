import { userModel } from '../models/userModel.js';
import { auditModel } from '../models/auditModel.js';
import { authService } from './authService.js';

export const userService = {
  async findAll() {
    return userModel.findAll();
  },

  async create(actorId, data) {
    const hash = await authService.hashPassword(data.password);
    const user = await userModel.create({ ...data, password_hash: hash });
    await auditModel.log(actorId, 'create', 'user', user.id, { role: user.role });
    return user;
  },

  async update(actorId, id, data) {
    const user = await userModel.update(id, data);
    if (!user) throw { status: 404, message: 'User not found', code: 'NOT_FOUND' };
    await auditModel.log(actorId, 'update', 'user', id, data);
    return user;
  },

  async deactivate(actorId, id) {
    const user = await userModel.deactivate(id);
    if (!user) throw { status: 404, message: 'User not found', code: 'NOT_FOUND' };
    await auditModel.log(actorId, 'deactivate', 'user', id);
    return { success: true };
  },

  async resetPassword(actorId, id, newPassword) {
    const hash = await authService.hashPassword(newPassword);
    await userModel.updatePassword(id, hash);
    await auditModel.log(actorId, 'reset_password', 'user', id);
    return { success: true };
  }
};
