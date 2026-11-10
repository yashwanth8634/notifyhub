import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './env';
import { cookies } from 'next/headers';

export interface TokenPayload {
  id: number;
  role: string;
  departmentId?: number;
}

export async function getSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('notifyhub_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return payload;
  } catch {
    return null;
  }
}