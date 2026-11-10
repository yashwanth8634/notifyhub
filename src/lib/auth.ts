import { TokenPayload } from '@/config/auth';

export type Role = 'super_admin' | 'principal' | 'dean' | 'hod' | 'faculty' | 'student';

export const ROLES: Role[] = ['super_admin', 'principal', 'dean', 'hod', 'faculty', 'student'];

export const PUBLISHING_ROLES: Role[] = ['principal', 'dean', 'hod', 'faculty', 'super_admin'];

export const ADMIN_ROLES: Role[] = ['super_admin'];

export class AuthError extends Error {
  constructor(
    public readonly code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'ALREADY_EXISTS' | 'VALIDATION_ERROR',
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export function requireAuth(user: TokenPayload | null): TokenPayload {
  if (!user) {
    throw new AuthError('UNAUTHORIZED', 401, 'Authentication required');
  }
  return user;
}

export function requireRole(user: TokenPayload | null, allowedRoles: Role[]): TokenPayload {
  const authenticated = requireAuth(user);
  if (allowedRoles.length > 0 && !allowedRoles.includes(authenticated.role as Role)) {
    throw new AuthError('FORBIDDEN', 403, 'Insufficient permissions');
  }
  return authenticated;
}

export function isPublishingRole(role: string): boolean {
  return PUBLISHING_ROLES.includes(role as Role);
}

export function isAdminRole(role: string): boolean {
  return ADMIN_ROLES.includes(role as Role);
}