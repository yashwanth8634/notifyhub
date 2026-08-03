import { apiClient } from './client';
import type { Event } from '../types';

export const eventsApi = {
  findAll: async (params?: any): Promise<Event[]> => {
    const response = await apiClient.get('/events', { params });
    return response.data;
  },
  create: async (data: any): Promise<Event> => {
    const response = await apiClient.post('/events', data);
    return response.data;
  },
  update: async (id: number, data: any): Promise<Event> => {
    const response = await apiClient.put(`/events/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  }
};
