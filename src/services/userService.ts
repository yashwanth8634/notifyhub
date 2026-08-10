// @ts-nocheck
import { userModel } from '@/models/userModel';
import { authService } from './authService';

export const userService: any = {
  async findAll() {
    return userModel.findAll();
  },

  async create(actorId, data) {
    if (data.role === 'super_admin') {
      const existing = await userModel.findByRole('super_admin');
      if (existing) throw { status: 400, message: 'A super admin already exists', code: 'ALREADY_EXISTS' };
    }
    if (data.role === 'principal') {
      const existingP = await userModel.findByRole('principal');
      if (existingP) throw { status: 400, message: 'A principal already exists', code: 'ALREADY_EXISTS' };
    }

    const hash = await authService.hashPassword(data.password);
    return userModel.create({ ...data, password_hash: hash });
  },

  async update(actorId, id, data) {
    if (data.role === 'principal') {
      const existingP = await userModel.findByRole('principal');
      if (existingP && existingP.id !== id) {
        throw { status: 400, message: 'A principal already exists', code: 'ALREADY_EXISTS' };
      }
    }
    const user = await userModel.update(id, data);
    if (!user) throw { status: 404, message: 'User not found', code: 'NOT_FOUND' };
    return user;
  },

  async deactivate(actorId, id) {
    const user = await userModel.deactivate(id);
    if (!user) throw { status: 404, message: 'User not found', code: 'NOT_FOUND' };
    return { success: true };
  },

  async reactivate(actorId, id) {
    const user = await userModel.reactivate(id);
    if (!user) throw { status: 404, message: 'User not found', code: 'NOT_FOUND' };
    return { success: true };
  },

  async resetPassword(actorId, id, newPassword) {
    const hash = await authService.hashPassword(newPassword);
    await userModel.updatePassword(id, hash);
    return { success: true };
  },

  async delete(actorId, id) {
    const user = await userModel.delete(id);
    if (!user) throw { status: 404, message: 'User not found', code: 'NOT_FOUND' };
    return { success: true };
  }
};
