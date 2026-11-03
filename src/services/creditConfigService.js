import { apiRequest } from './api';

export const creditConfigService = {
  // GET /api/admin/credit-plans/configuration
  getConfiguration: async () => {
    return await apiRequest('/api/admin/credit-plans/configuration', {
      method: 'GET',
      quietStatuses: [404], // 404 = not configured yet; the Plans page handles it
    });
  },

  // PUT /api/admin/credit-plans/configuration
  updateConfiguration: async (data) => {
    return await apiRequest('/api/admin/credit-plans/configuration', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

 

};