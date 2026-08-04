// @ts-nocheck
import { userModel } from '@/models/userModel';
import { auditModel } from '@/models/auditModel';
import { authService } from './authService';

export const userService: any = {
  async findAll() {
    return userModel.findAll();
  },

  async create(actorId, data) {
    // prevent creating a second super_admin
    if (data.role === 'super_admin') {
      const existing = await userModel.findByRole('super_admin');
      if (existing) throw { status: 400, message: 'A super admin already exists', code: 'ALREADY_EXISTS' };
    }
    // prevent creating a second principal
    if (data.role === 'principal') {
      const existingP = await userModel.findByRole('principal');
      if (existingP) throw { status: 400, message: 'A principal already exists', code: 'ALREADY_EXISTS' };
    }

    const hash = await authService.hashPassword(data.password);
    const user = await userModel.create({ ...data, password_hash: hash });
    await auditModel.log(actorId, 'create', 'user', user.id, { role: user.role });
    return user;
  },

  async update(actorId, id, data) {
    // prevent assigning principal role if another principal exists
    if (data.role === 'principal') {
      const existingP = await userModel.findByRole('principal');
      if (existingP && existingP.id !== id) {
        throw { status: 400, message: 'A principal already exists', code: 'ALREADY_EXISTS' };
      }
    }
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

  async reactivate(actorId, id) {
    const user = await userModel.reactivate(id);
    if (!user) throw { status: 404, message: 'User not found', code: 'NOT_FOUND' };
    await auditModel.log(actorId, 'reactivate', 'user', id);
    return { success: true };
  },

  async resetPassword(actorId, id, newPassword) {
    const hash = await authService.hashPassword(newPassword);
    await userModel.updatePassword(id, hash);
    await auditModel.log(actorId, 'reset_password', 'user', id);
    return { success: true };
  }
  ,
  async delete(actorId, id) {
    const user = await userModel.delete(id);
    if (!user) throw { status: 404, message: 'User not found', code: 'NOT_FOUND' };
    await auditModel.log(actorId, 'delete', 'user', id);
    return { success: true };
  }
};
