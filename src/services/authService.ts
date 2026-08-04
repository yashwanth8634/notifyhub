// @ts-nocheck
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userModel } from '@/models/userModel';
import { auditModel } from '@/models/auditModel';
import { JWT_SECRET, JWT_EXPIRES_IN, BCRYPT_ROUNDS } from '@/config/env';

export const authService = {
  async login(email, password) {
    const user = await userModel.findByEmail(email);
    if (!user || !user.is_active) {
      throw { status: 401, message: 'Invalid credentials or inactive account', code: 'UNAUTHORIZED' };
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw { status: 401, message: 'Invalid credentials', code: 'UNAUTHORIZED' };
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role, 
        departmentId: user.department_id, 
        facultyId: user.faculty_id 
      }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Don't send password hash back
    const { password_hash, ...userWithoutPassword } = user;
    
    await auditModel.log(user.id, 'login', 'user', user.id);

    return { user: userWithoutPassword, token };
  },

  async hashPassword(password) {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }
};
