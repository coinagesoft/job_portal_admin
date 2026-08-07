import { apiRequest } from './api';

export const subAdminService = {
  // GET /api/admin/sub-admins
  getSubAdmins: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('Search', params.search);
    if (params.status) query.append('Status', params.status);
    if (params.page) query.append('Page', params.page);
    if (params.pageSize) query.append('PageSize', params.pageSize);
    
    const queryString = query.toString();
    const endpoint = `/api/admin/sub-admins${queryString ? `?${queryString}` : ''}`;
    
    return await apiRequest(endpoint, {
      method: 'GET',
    });
  },

  // POST /api/admin/sub-admins
  createSubAdmin: async (data) => {
    return await apiRequest('/api/admin/sub-admins', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /api/admin/sub-admins/{id}
  updateSubAdmin: async (id, data) => {
    return await apiRequest(`/api/admin/sub-admins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /api/admin/sub-admins/{id}
  deleteSubAdmin: async (id) => {
    return await apiRequest(`/api/admin/sub-admins/${id}`, {
      method: 'DELETE',
    });
  },

  // PATCH /api/admin/sub-admins/{id}/suspend
  suspendSubAdmin: async (id, reason = 'Suspended by admin') => {
    return await apiRequest(`/api/admin/sub-admins/${id}/suspend`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },

  // PATCH /api/admin/sub-admins/{id}/activate
  activateSubAdmin: async (id) => {
    return await apiRequest(`/api/admin/sub-admins/${id}/activate`, {
      method: 'PATCH',
    });
  }
};
