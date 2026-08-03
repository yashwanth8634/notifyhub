import { apiClient } from './client';
import type { User } from '../types';

export const usersApi = {
  findAll: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data;
  },
  create: async (data: any): Promise<User> => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },
  update: async (id: number, data: any): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },
  deactivate: async (id: number): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  }
};
