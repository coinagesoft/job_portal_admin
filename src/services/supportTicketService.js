import { apiRequest } from './api';

export const supportTicketService = {
  // GET /api/admin/support-tickets
  getTickets: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.raisedByType) {
      query.append('RaisedByType', params.raisedByType);
      query.append('raisedByType', params.raisedByType);
    }
    if (params.status) {
      query.append('Status', params.status);
      query.append('status', params.status);
    }
    if (params.category) {
      query.append('Category', params.category);
      query.append('category', params.category);
    }
    if (params.search) {
      query.append('Search', params.search);
      query.append('search', params.search);
    }
    if (params.page) {
      query.append('Page', params.page);
      query.append('page', params.page);
    }
    if (params.pageSize) {
      query.append('PageSize', params.pageSize);
      query.append('pageSize', params.pageSize);
    }

    const queryString = query.toString();
    const endpoint = `/api/admin/support-tickets${queryString ? `?${queryString}` : ''}`;

    return await apiRequest(endpoint, {
      method: 'GET',
    });
  },

  // GET /api/admin/support-tickets/summary
  getSummary: async () => {
    return await apiRequest('/api/admin/support-tickets/summary', {
      method: 'GET',
    });
  },

  // GET /api/admin/support-tickets/{ticketId}
  getTicketDetails: async (ticketId) => {
    return await apiRequest(`/api/admin/support-tickets/${ticketId}`, {
      method: 'GET',
    });
  },

  // POST /api/admin/support-tickets/{ticketId}/reply
  replyTicket: async (ticketId, message) => {
    return await apiRequest(`/api/admin/support-tickets/${ticketId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }
};
