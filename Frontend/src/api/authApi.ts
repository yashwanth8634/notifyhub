import { apiClient } from './client';
import type { User } from '../types';

export const authApi = {
  login: async (credentials: any): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  }
};
