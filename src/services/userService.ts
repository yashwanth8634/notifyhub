import { userModel } from '@/models/userModel';
import { authService } from './authService';
import { AuthError } from '@/lib/auth';
import { User, Role } from '@/types';

interface UserCreateData {
  name: string;
  email: string;
  password: string;
  role: Role;
  department_id?: number | null;
}

interface UserUpdateData {
  name?: string | null;
  email?: string | null;
  role?: Role | null;
  department_id?: number | null;
  is_active?: boolean | null;
}

export const userService = {
  async findAll(): Promise<User[]> {
    return userModel.findAll();
  },

  async create(_actorId: number, data: UserCreateData): Promise<User> {
    if (data.role === 'super_admin') {
      const existing = await userModel.findByRole('super_admin');
      if (existing) throw new AuthError('ALREADY_EXISTS', 400, 'A super admin already exists');
    }
    if (data.role === 'principal') {
      const existingP = await userModel.findByRole('principal');
      if (existingP) throw new AuthError('ALREADY_EXISTS', 400, 'A principal already exists');
    }

    const hash = await authService.hashPassword(data.password);
    return userModel.create({ ...data, password_hash: hash });
  },

  async update(_actorId: number, id: number, data: UserUpdateData): Promise<User> {
    if (data.role === 'principal') {
      const existingP = await userModel.findByRole('principal');
      if (existingP && existingP.id !== id) {
        throw new AuthError('ALREADY_EXISTS', 400, 'A principal already exists');
      }
    }
    const user = await userModel.update(id, data);
    if (!user) throw new AuthError('NOT_FOUND', 404, 'User not found');
    return user;
  },

  async deactivate(_actorId: number, id: number): Promise<{ success: boolean }> {
    const user = await userModel.deactivate(id);
    if (!user) throw new AuthError('NOT_FOUND', 404, 'User not found');
    return { success: true };
  },

  async reactivate(_actorId: number, id: number): Promise<{ success: boolean }> {
    const user = await userModel.reactivate(id);
    if (!user) throw new AuthError('NOT_FOUND', 404, 'User not found');
    return { success: true };
  },

  async resetPassword(_actorId: number, id: number, newPassword: string): Promise<{ success: boolean }> {
    const hash = await authService.hashPassword(newPassword);
    await userModel.updatePassword(id, hash);
    return { success: true };
  },

  async delete(_actorId: number, id: number): Promise<{ success: boolean }> {
    const user = await userModel.delete(id);
    if (!user) throw new AuthError('NOT_FOUND', 404, 'User not found');
    return { success: true };
  }
};