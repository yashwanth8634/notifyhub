import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './env';
import { NextRequest } from 'next/server';

export interface TokenPayload {
  id: number;
  role: string;
  departmentId?: number;
  facultyId?: number;
}

import { cookies } from 'next/headers';

export async function getSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('notifyhub_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return payload;
  } catch (err) {
    return null;
  }
}

export function requireRole(user: TokenPayload | null, roles: string[]) {
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  if (roles.length > 0 && !roles.includes(user.role)) {
    throw new Error('FORBIDDEN');
  }
}
