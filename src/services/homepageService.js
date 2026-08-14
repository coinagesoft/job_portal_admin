import { apiRequest } from './api';

export const homepageService = {
  // GET /api/admin/homepage/hero
  getHero: async () => {
    return await apiRequest('/api/admin/homepage/hero', {
      method: 'GET',
    });
  },

  // PUT /api/admin/homepage/hero
  updateHero: async (data) => {
    return await apiRequest('/api/admin/homepage/hero', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // POST /api/admin/homepage/hero/banner
  uploadHeroBanner: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await apiRequest('/api/admin/homepage/hero/banner', {
      method: 'POST',
      body: formData,
    });
  },

  // GET /api/admin/homepage/industries
  getIndustries: async () => {
    return await apiRequest('/api/admin/homepage/industries', {
      method: 'GET',
    });
  },

  // POST /api/admin/homepage/industries
  saveIndustry: async (data) => {
    return await apiRequest('/api/admin/homepage/industries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // DELETE /api/admin/homepage/industries/{industryId}
  deleteIndustry: async (industryId) => {
    return await apiRequest(`/api/admin/homepage/industries/${industryId}`, {
      method: 'DELETE',
    });
  },

  // GET /api/admin/homepage/statistics
  getStats: async () => {
    return await apiRequest('/api/admin/homepage/statistics', {
      method: 'GET',
    });
  },

  // PUT /api/admin/homepage/statistics
  updateStats: async (data) => {
    return await apiRequest('/api/admin/homepage/statistics', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // GET /api/admin/homepage/locations
  getLocations: async () => {
    return await apiRequest('/api/admin/homepage/locations', {
      method: 'GET',
    });
  },

  // POST /api/admin/homepage/locations
  createLocation: async (data) => {
    return await apiRequest('/api/admin/homepage/locations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /api/admin/homepage/locations/{locationId}
  updateLocation: async (locationId, data) => {
    return await apiRequest(`/api/admin/homepage/locations/${locationId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // POST /api/admin/homepage/locations/{locationId}/image
  uploadLocationImage: async (locationId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await apiRequest(`/api/admin/homepage/locations/${locationId}/image`, {
      method: 'POST',
      body: formData,
    });
  },

  // PATCH /api/admin/homepage/locations/{locationId}/toggle
  toggleLocation: async (locationId) => {
    return await apiRequest(`/api/admin/homepage/locations/${locationId}/toggle`, {
      method: 'PATCH',
    });
  },

  // DELETE /api/admin/homepage/locations/{locationId}
  deleteLocation: async (locationId) => {
    return await apiRequest(`/api/admin/homepage/locations/${locationId}`, {
      method: 'DELETE',
    });
  },

  // GET /api/admin/homepage/roles
  getRoles: async () => {
    return await apiRequest('/api/admin/homepage/roles', {
      method: 'GET',
    });
  },

  // POST /api/admin/homepage/roles
  createRole: async (data) => {
    return await apiRequest('/api/admin/homepage/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /api/admin/homepage/roles/{roleId}
  updateRole: async (roleId, data) => {
    return await apiRequest(`/api/admin/homepage/roles/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // POST /api/admin/homepage/roles/{roleId}/icon
  uploadRoleImage: async (roleId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await apiRequest(`/api/admin/homepage/roles/${roleId}/icon`, {
      method: 'POST',
      body: formData,
    }).catch(err => {
      console.warn(`Optional role image upload failed or is not implemented on server:`, err);
      return null;
    });
  },

  // PATCH /api/admin/homepage/roles/{roleId}/toggle
  toggleRole: async (roleId) => {
    return await apiRequest(`/api/admin/homepage/roles/${roleId}/toggle`, {
      method: 'PATCH',
    });
  },

  // DELETE /api/admin/homepage/roles/{roleId}
  deleteRole: async (roleId) => {
    return await apiRequest(`/api/admin/homepage/roles/${roleId}`, {
      method: 'DELETE',
    });
  },

  // GET /api/admin/homepage/registration-industries
  getRegistrationIndustries: async () => {
    return await apiRequest('/api/admin/homepage/registration-industries', {
      method: 'GET',
    });
  },

  // POST /api/admin/homepage/registration-industries
  createRegistrationIndustry: async (data) => {
    return await apiRequest('/api/admin/homepage/registration-industries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /api/admin/homepage/registration-industries/{id}
  updateRegistrationIndustry: async (id, data) => {
    return await apiRequest(`/api/admin/homepage/registration-industries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // PATCH /api/admin/homepage/registration-industries/{id}/toggle
  toggleRegistrationIndustry: async (id) => {
    return await apiRequest(`/api/admin/homepage/registration-industries/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  // DELETE /api/admin/homepage/registration-industries/{id}
  deleteRegistrationIndustry: async (id) => {
    return await apiRequest(`/api/admin/homepage/registration-industries/${id}`, {
      method: 'DELETE',
    });
  },

  // GET /api/admin/homepage/departments
  getDepartments: async () => {
    return await apiRequest('/api/admin/homepage/departments', {
      method: 'GET',
    });
  },

  // POST /api/admin/homepage/departments
  createDepartment: async (data) => {
    return await apiRequest('/api/admin/homepage/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /api/admin/homepage/departments/{id}
  updateDepartment: async (id, data) => {
    return await apiRequest(`/api/admin/homepage/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // PATCH /api/admin/homepage/departments/{id}/toggle
  toggleDepartment: async (id) => {
    return await apiRequest(`/api/admin/homepage/departments/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  // DELETE /api/admin/homepage/departments/{id}
  deleteDepartment: async (id) => {
    return await apiRequest(`/api/admin/homepage/departments/${id}`, {
      method: 'DELETE',
    });
  },

  // GET /api/admin/homepage/trade-categories
  getTradeCategories: async () => {
    return await apiRequest('/api/admin/homepage/trade-categories', {
      method: 'GET',
    });
  },

  // POST /api/admin/homepage/trade-categories
  createTradeCategory: async (data) => {
    return await apiRequest('/api/admin/homepage/trade-categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /api/admin/homepage/trade-categories/{id}
  updateTradeCategory: async (id, data) => {
    return await apiRequest(`/api/admin/homepage/trade-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // PATCH /api/admin/homepage/trade-categories/{id}/toggle
  toggleTradeCategory: async (id) => {
    return await apiRequest(`/api/admin/homepage/trade-categories/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  // DELETE /api/admin/homepage/trade-categories/{id}
  deleteTradeCategory: async (id) => {
    return await apiRequest(`/api/admin/homepage/trade-categories/${id}`, {
      method: 'DELETE',
    });
  },

  // GET /api/admin/homepage/suggestions
  getSuggestions: async () => {
    return await apiRequest('/api/admin/homepage/suggestions', {
      method: 'GET',
    });
  },

  // PATCH /api/admin/homepage/suggestions/{id}/approve
  approveSuggestion: async (id, data) => {
    return await apiRequest(`/api/admin/homepage/suggestions/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // PATCH /api/admin/homepage/suggestions/{id}/reject
  rejectSuggestion: async (id, data) => {
    return await apiRequest(`/api/admin/homepage/suggestions/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // DELETE /api/admin/homepage/suggestions/{id}
  deleteSuggestion: async (id) => {
    return await apiRequest(`/api/admin/homepage/suggestions/${id}`, {
      method: 'DELETE',
    });
  }
};
