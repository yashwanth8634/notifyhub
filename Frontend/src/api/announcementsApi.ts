import { apiClient } from './client';
import type { Announcement } from '../types';

export const announcementsApi = {
  findAll: async (params?: any): Promise<Announcement[]> => {
    const response = await apiClient.get('/announcements', { params });
    return response.data;
  },
  create: async (data: any): Promise<Announcement> => {
    const response = await apiClient.post('/announcements', data);
    return response.data;
  },
  update: async (id: number, data: any): Promise<Announcement> => {
    const response = await apiClient.put(`/announcements/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/announcements/${id}`);
    return response.data;
  }
};
