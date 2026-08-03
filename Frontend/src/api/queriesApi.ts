import { apiClient } from './client';
import type { Query } from '../types';

export const queriesApi = {
  findAll: async (params?: any): Promise<Query[]> => {
    const response = await apiClient.get('/queries', { params });
    return response.data;
  },
  create: async (data: any): Promise<Query> => {
    const response = await apiClient.post('/queries', data);
    return response.data;
  },
  respond: async (id: number, data: any): Promise<Query> => {
    const response = await apiClient.put(`/queries/${id}/respond`, data);
    return response.data;
  }
};
