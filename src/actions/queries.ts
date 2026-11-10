"use server";

import { queryService } from '@/services/queryService';
import { queryModel } from '@/models/queryModel';
import { getSession } from '@/config/auth';
import { requireRole, AuthError } from '@/lib/auth';
import { querySchema, queryFiltersSchema, respondToQuerySchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { QueryFiltersInput } from '@/lib/validation';

export async function getQueries(filters: QueryFiltersInput = {}) {
  const user = await getSession();
  if (!user) throw new AuthError('UNAUTHORIZED', 401, 'Authentication required');
  
  const validation = queryFiltersSchema.safeParse(filters);
  if (!validation.success) {
    throw new AuthError('VALIDATION_ERROR', 400, validation.error.issues[0].message);
  }
  
  return queryService.findAllForUser(user, validation.data);
}

export async function createQuery(data: unknown) {
  const user = await getSession();

  const validation = querySchema.safeParse(data);
  if (!validation.success) {
    throw new AuthError('VALIDATION_ERROR', 400, validation.error.issues[0].message);
  }

  if (!user) {
    logger.info('Creating anonymous query', {
      action: 'query_create_anonymous',
    });
    return queryService.createAnonymous(validation.data);
  }

  requireRole(user, ['student']);

  logger.info('Creating query', {
    action: 'query_create',
    userId: user?.id,
  });

  return queryService.create(user, validation.data);
}

export async function getQueryById(id: string) {
  const queryId = parseInt(id, 10);
  if (isNaN(queryId)) {
    throw new AuthError('VALIDATION_ERROR', 400, 'Invalid query ID');
  }
  return queryModel.findById(queryId);
}

export async function respondToQuery(id: number, data: unknown) {
  const user = await getSession();
  requireRole(user, ['super_admin', 'hod']);
  
  const validation = respondToQuerySchema.safeParse(data);
  if (!validation.success) {
    throw new AuthError('VALIDATION_ERROR', 400, validation.error.issues[0].message);
  }

  logger.info('Responding to query', {
    action: 'query_respond',
    userId: user?.id,
    metadata: { queryId: id },
  });

  return queryService.respond(user, id, validation.data);
}