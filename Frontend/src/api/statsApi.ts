import { apiClient } from './client';

export const statsApi = {
  getStats: async (): Promise<{ totalNotices: number; upcomingEvents: number }> => {
    const response = await apiClient.get('/stats');
    return response.data;
  }
};
