import { queryModel } from '@/models/queryModel';
import { AuthError } from '@/lib/auth';
import { Query, QueryFilters, QueryStatus } from '@/types';

interface AuthUser {
  id: number;
  role: string;
  name?: string;
  email?: string;
}

interface QueryCreateData {
  name?: string | null;
  roll_no?: string | null;
  email?: string | null;
  subject: string;
  message: string;
}

interface QueryRespondData {
  response: string | null;
  status?: QueryStatus | null;
}

export const queryService = {
  async findAllForUser(user: AuthUser, filters: QueryFilters = {}): Promise<Query[]> {
    // All authenticated users can view all queries (based on current logic)
    return queryModel.findAll(filters);
  },

  async create(user: AuthUser, data: QueryCreateData): Promise<Query> {
    return queryModel.create({
      name: data.name ?? user.name ?? null,
      roll_no: data.roll_no ?? null,
      email: data.email ?? user.email ?? null,
      subject: data.subject,
      message: data.message,
    });
  },

  async createAnonymous(data: QueryCreateData): Promise<Query> {
    return queryModel.create({
      name: data.name ?? null,
      roll_no: data.roll_no ?? null,
      email: data.email ?? null,
      subject: data.subject,
      message: data.message,
    });
  },

  async respond(_user: AuthUser, id: number, responseData: QueryRespondData): Promise<Query | null> {
    const existing = await queryModel.findById(id);
    if (!existing) throw new AuthError('NOT_FOUND', 404, 'Query not found');

    return queryModel.respond(id, {
      response: responseData.response,
      status: responseData.status ?? null,
    });
  },
};