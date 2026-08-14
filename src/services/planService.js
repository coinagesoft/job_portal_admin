import { apiRequest } from './api';

export const planService = {
  // GET /api/admin/membership-plans?planType=Recruiter
  getMembershipPlans: async (planType, region) => {
    let url = `/api/admin/membership-plans?planType=${planType}`;
    if (region) {
      url += `&region=${encodeURIComponent(region)}`;
    }
    return await apiRequest(url, {
      method: 'GET',
    });
  },

  // POST /api/admin/membership-plans
  createMembershipPlan: async (data) => {
    return await apiRequest('/api/admin/membership-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /api/admin/membership-plans
  updateMembershipPlan: async (data) => {
    return await apiRequest('/api/admin/membership-plans', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /api/admin/membership-plans/{planId}
  deleteMembershipPlan: async (planId) => {
    return await apiRequest(`/api/admin/membership-plans/${planId}`, {
      method: 'DELETE',
    });
  },

  // GET /api/admin/credit-plans
  getCreditPlans: async (region) => {
    let url = '/api/admin/credit-plans';
    if (region) {
      url += `?region=${encodeURIComponent(region)}`;
    }
    return await apiRequest(url, {
      method: 'GET',
    });
  },

  // POST /api/admin/credit-plans
  createCreditPlan: async (data) => {
    return await apiRequest('/api/admin/credit-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /api/admin/credit-plans
  updateCreditPlan: async (data) => {
    return await apiRequest('/api/admin/credit-plans', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /api/admin/credit-plans/{planId}
  deleteCreditPlan: async (planId) => {
    return await apiRequest(`/api/admin/credit-plans/${planId}`, {
      method: 'DELETE',
    });
  },
};
