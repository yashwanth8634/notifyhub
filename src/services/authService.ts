import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userModel } from '@/models/userModel';
import { JWT_SECRET, JWT_EXPIRES_IN, BCRYPT_ROUNDS } from '@/config/env';
import { AuthError } from '@/lib/auth';
import { User } from '@/types';

interface TokenPayload {
  id: number;
  role: string;
  departmentId?: number;
}

interface LoginResult {
  user: Omit<User, 'password_hash'>;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResult> {
    const user = await userModel.findByEmail(email);
    if (!user || !user.is_active) {
      throw new AuthError('UNAUTHORIZED', 401, 'Invalid credentials or inactive account');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new AuthError('UNAUTHORIZED', 401, 'Invalid credentials');
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role, 
        departmentId: user.department_id
      }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password_hash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  },

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }
};