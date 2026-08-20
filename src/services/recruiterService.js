import { apiRequest } from './api';

export const recruiterService = {
  // GET /api/admin/recruiters
  getRecruiters: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('Search', params.search);
    if (params.status) query.append('Status', params.status);
    if (params.page) query.append('Page', params.page);
    if (params.pageSize) query.append('PageSize', params.pageSize);
    
    const queryString = query.toString();
    const endpoint = `/api/admin/recruiters${queryString ? `?${queryString}` : ''}`;
    
    return await apiRequest(endpoint, {
      method: 'GET',
    });
  },

  // GET /api/admin/recruiters/{id}
  getRecruiterById: async (id) => {
    return await apiRequest(`/api/admin/recruiters/${id}`, {
      method: 'GET',
    });
  },

  // PATCH /api/admin/recruiters/{id}/account-status
  updateAccountStatus: async (id, accountStatus, reason = '') => {
    return await apiRequest(`/api/admin/recruiters/${id}/account-status`, {
      method: 'PATCH',
      body: JSON.stringify({ accountStatus, reason }),
    });
  },

  // GET /api/admin/recruiters/{id}/transactions
  getRecruiterTransactions: async (id) => {
    return await apiRequest(`/api/admin/recruiters/${id}/transactions`, {
      method: 'GET',
    });
  },

  // GET /api/admin/recruiters/{id}/transactions/{transactionId}/invoice/download
  downloadTransactionInvoice: async (id, transactionId) => {
    return await apiRequest(`/api/admin/recruiters/${id}/transactions/${transactionId}/invoice/download`, {
      method: 'GET',
    });
  },

  // GET /api/admin/recruiters/{id}/documents
  getRecruiterDocuments: async (id) => {
    return await apiRequest(`/api/admin/recruiters/${id}/documents`, {
      method: 'GET',
    });
  },

  // GET /api/admin/recruiters/{id}/documents/checklist or /api/admin/recruiters/{id}/document-checklist
  getRecruiterDocumentChecklist: async (id) => {
    try {
      return await apiRequest(`/api/admin/recruiters/${id}/documents/checklist`, {
        method: 'GET',
      });
    } catch (err) {
      return await apiRequest(`/api/admin/recruiters/${id}/document-checklist`, {
        method: 'GET',
      });
    }
  },

  // PATCH /api/admin/recruiters/documents/{documentId}/status
  updateDocumentStatus: async (documentId, status, remarks = '') => {
    return await apiRequest(`/api/admin/recruiters/documents/${documentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, remarks }),
    });
  },

  // POST /api/admin/recruiters/document-types/optional
  addOptionalDocumentType: async (documentName, category) => {
    return await apiRequest(`/api/admin/recruiters/document-types/optional`, {
      method: 'POST',
      body: JSON.stringify({ documentName, category }),
    });
  },

  // GET /api/admin/recruiters/document-types/masterAllDocuments
  getMasterAllDocuments: async () => {
    return await apiRequest(`/api/admin/recruiters/document-types/masterAllDocuments`, {
      method: 'GET',
    });
  },

  // GET /api/admin/recruiters/Alloptional/names
  getAllOptionalNames: async () => {
    return await apiRequest(`/api/admin/recruiters/Alloptional/names`, {
      method: 'GET',
    });
  },

  // PATCH /api/admin/recruiters/document-types/{documentTypeId}/updatStatus/requiredDoc
  updateRequiredDocStatus: async (documentTypeId, isMandatory) => {
    return await apiRequest(`/api/admin/recruiters/document-types/${documentTypeId}/updatStatus/requiredDoc`, {
      method: 'PATCH',
      body: JSON.stringify({ isMandatory }),
    });
  },

  // POST /api/admin/recruiters/{employerId}/document-requests
  requestDocument: async (employerId, documentTypeId, customDocumentName = '', message = '') => {
    return await apiRequest(`/api/admin/recruiters/${employerId}/document-requests`, {
      method: 'POST',
      body: JSON.stringify({ documentTypeId: documentTypeId || null, customDocumentName, message }),
    });
  }
};
