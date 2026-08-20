import { apiRequest } from './api';

export const dashboardService = {
  getPlatformOverview: async () => {
    return await apiRequest('/api/admin/dashboard/platform-overview', {
      method: 'GET',
    });
  },
};
