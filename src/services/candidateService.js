import { apiRequest } from './api';

export const candidateService = {
  // GET /api/admin/candidates
  getCandidates: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('Search', params.search);
    if (params.status) query.append('Status', params.status);
    if (params.page) query.append('Page', params.page);
    if (params.pageSize) query.append('PageSize', params.pageSize);
    
    const queryString = query.toString();
    const endpoint = `/api/admin/candidates${queryString ? `?${queryString}` : ''}`;
    
    return await apiRequest(endpoint, {
      method: 'GET',
    });
  },

  // GET /api/admin/candidates/{id}
  getCandidateById: async (id) => {
    return await apiRequest(`/api/admin/candidates/${id}`, {
      method: 'GET',
    });
  },

  // PATCH /api/admin/candidates/{id}/account-status
  updateAccountStatus: async (id, accountStatus, reason = '') => {
    return await apiRequest(`/api/admin/candidates/${id}/account-status`, {
      method: 'PATCH',
      body: JSON.stringify({ accountStatus, reason }),
    });
  }
};
