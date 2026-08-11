import { apiRequest } from './api';

export const legalPagesService = {
  // GET /api/admin/legal-pages
  getLegalPages: async () => {
    return await apiRequest('/api/admin/legal-pages', {
      method: 'GET',
    });
  },

  // GET /api/admin/legal-pages/{type}
  getLegalPageByType: async (type) => {
    return await apiRequest(`/api/admin/legal-pages/${type}`, {
      method: 'GET',
    });
  },

  // PUT /api/admin/legal-pages/{type}
  updateDraft: async (type, content, effectiveDate) => {
    return await apiRequest(`/api/admin/legal-pages/${type}`, {
      method: 'PUT',
      body: JSON.stringify({ content, effectiveDate }),
    });
  },

  // POST /api/admin/legal-pages/{type}/publish
  publishDraft: async (type, content, effectiveDate) => {
    return await apiRequest(`/api/admin/legal-pages/${type}/publish`, {
      method: 'POST',
      body: JSON.stringify({ content, effectiveDate }),
    });
  },

  // POST /api/admin/legal-pages/{type}/discard
  discardDraft: async (type) => {
    return await apiRequest(`/api/admin/legal-pages/${type}/discard`, {
      method: 'POST',
    });
  }
};
