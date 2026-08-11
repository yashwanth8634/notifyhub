"use server";

import { queryService } from '@/services/queryService';
import { getSession } from '@/config/auth';
import { query } from '@/config/db';

function requireRole(user: any, roles: string[]) {
  if (!user) throw new Error('UNAUTHORIZED');
  if (roles.length > 0 && !roles.includes(user.role)) {
    throw new Error('FORBIDDEN');
  }
}

export async function getQueries() {
  const user = await getSession();
  if (!user) throw new Error('UNAUTHORIZED');
  return queryService.findAllForUser(user);
}

export async function createQuery(data: any) {
  const user = await getSession();

  if (!user) {
    return queryService.createAnonymous(data);
  }

  requireRole(user, ['student']);
  return queryService.create(user, data);
}
export async function getQueryById(id: string) {
  const result = await query(
    `
      SELECT *
      FROM queries
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] ?? null;
}
export async function respondToQuery(id: number, data: any) {
  const user = await getSession();
  requireRole(user, ['super_admin', 'hod']);
  return queryService.respond(user, id, data);
}
