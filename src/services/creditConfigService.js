import { apiRequest } from './api';

export const creditConfigService = {
  // GET /api/admin/credit-configuration
  getConfiguration: async () => {
    return await apiRequest('/api/admin/credit-configuration', {
      method: 'GET',
    });
  },

  // PUT /api/admin/credit-configuration
  updateConfiguration: async (data) => {
    return await apiRequest('/api/admin/credit-configuration', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};