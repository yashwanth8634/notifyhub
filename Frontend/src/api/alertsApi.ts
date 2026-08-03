import { apiClient } from './client';
import type { Announcement } from '../types';

export const alertsApi = {
  findAll: async (params?: any): Promise<Announcement[]> => {
    const response = await apiClient.get('/alerts', { params });
    return response.data;
  },
  create: async (data: any): Promise<Announcement> => {
    const response = await apiClient.post('/alerts', data);
    return response.data;
  },
  update: async (id: number, data: any): Promise<Announcement> => {
    const response = await apiClient.put(`/alerts/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/alerts/${id}`);
    return response.data;
  }
};
