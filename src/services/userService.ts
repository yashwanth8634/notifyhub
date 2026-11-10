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

interface UserActor {
  id: number;
  role: Role;
  departmentId?: number;
}

function canManageTarget(actor: UserActor, target: User): boolean {
  if (actor.role === 'super_admin') return true;
  if (actor.role === 'principal') return ['dean', 'hod'].includes(target.role);
  if (actor.role === 'dean') return ['hod', 'faculty'].includes(target.role);
  return actor.role === 'hod' &&
    target.role === 'faculty' &&
    target.department_id === actor.departmentId;
}

export const userService = {
  async findAll(actor: UserActor): Promise<User[]> {
    const users = await userModel.findAll();
    if (actor.role === 'principal') {
      return users.filter((user) => user.role === 'dean' || user.role === 'hod');
    }
    if (actor.role === 'hod') {
      return users.filter(
        (user) =>
          user.role === 'faculty' &&
          user.department_id === actor.departmentId,
      );
    }
    if (actor.role === 'dean') {
      return users.filter((user) => user.role === 'hod');
    }
    return users;
  },

  async create(actor: UserActor, data: UserCreateData): Promise<User> {
    const allowedRoles: Record<Role, Role[]> = {
      super_admin: ['super_admin', 'principal', 'dean', 'hod', 'faculty', 'student'],
      principal: ['dean', 'hod'],
      dean: ['hod'],
      hod: ['faculty'],
      faculty: [],
      student: [],
    };
    if (!allowedRoles[actor.role].includes(data.role)) {
      throw new AuthError('FORBIDDEN', 403, 'You cannot create this role');
    }
    if (actor.role === 'hod' && data.department_id !== actor.departmentId) {
      throw new AuthError('FORBIDDEN', 403, 'You can only create users in your department');
    }

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

  async update(actor: UserActor, id: number, data: UserUpdateData): Promise<User> {
    const target = await userModel.findById(id);
    if (!target || !canManageTarget(actor, target)) {
      throw new AuthError('FORBIDDEN', 403, 'You cannot manage this user');
    }
    const resultingRole = data.role ?? target.role;
    if (
      data.role !== undefined &&
      !canManageTarget(actor, { ...target, role: resultingRole })
    ) {
      throw new AuthError('FORBIDDEN', 403, 'You cannot assign this role');
    }
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

  async deactivate(actor: UserActor, id: number): Promise<{ success: boolean }> {
    const target = await userModel.findById(id);
    if (!target || !canManageTarget(actor, target)) {
      throw new AuthError('FORBIDDEN', 403, 'You cannot manage this user');
    }
    const user = await userModel.deactivate(id);
    if (!user) throw new AuthError('NOT_FOUND', 404, 'User not found');
    return { success: true };
  },

  async reactivate(actor: UserActor, id: number): Promise<{ success: boolean }> {
    const target = await userModel.findById(id);
    if (!target || !canManageTarget(actor, target)) {
      throw new AuthError('FORBIDDEN', 403, 'You cannot manage this user');
    }
    const user = await userModel.reactivate(id);
    if (!user) throw new AuthError('NOT_FOUND', 404, 'User not found');
    return { success: true };
  },

  async resetPassword(actor: UserActor, id: number, newPassword: string): Promise<{ success: boolean }> {
    const target = await userModel.findById(id);
    if (!target || !canManageTarget(actor, target)) {
      throw new AuthError('FORBIDDEN', 403, 'You cannot manage this user');
    }
    const hash = await authService.hashPassword(newPassword);
    await userModel.updatePassword(id, hash);
    return { success: true };
  },

  async delete(actor: UserActor, id: number): Promise<{ success: boolean }> {
    const target = await userModel.findById(id);
    if (!target || !canManageTarget(actor, target)) {
      throw new AuthError('FORBIDDEN', 403, 'You cannot manage this user');
    }
    const user = await userModel.delete(id);
    if (!user) throw new AuthError('NOT_FOUND', 404, 'User not found');
    return { success: true };
  }
};