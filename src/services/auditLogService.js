import { apiRequest, API_BASE_URL } from './api';



export const auditLogService = {
  // GET /api/admin/audit-logs
  getAuditLogs: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('Search', params.search);
    if (params.actorType) query.append('ActorType', params.actorType);
    if (params.severity) query.append('Severity', params.severity);
    if (params.date) query.append('Date', params.date);
    if (params.page) query.append('Page', params.page);
    if (params.pageSize) query.append('PageSize', params.pageSize);

    const queryString = query.toString();
    const endpoint = `/api/admin/audit-logs${queryString ? `?${queryString}` : ''}`;

    return await apiRequest(endpoint, {
      method: 'GET',
    });
  },

  // GET /api/admin/audit-logs/export/csv
  // Returns a downloadable CSV blob. Handled separately from apiRequest
  // since the response here is a file, not JSON.
  exportCsv: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.action) query.append('Action', params.action);
    if (params.date) query.append('Date', params.date);
    if (params.actorType !== undefined && params.actorType !== null && params.actorType !== '') {
      query.append('ActorType', params.actorType);
    }
    if (params.severity !== undefined && params.severity !== null && params.severity !== '') {
      query.append('Severity', params.severity);
    }
    if (params.page) query.append('Page', params.page);
    if (params.pageSize) query.append('PageSize', params.pageSize);

    const queryString = query.toString();
    const endpoint = `${API_BASE_URL}/api/admin/audit-logs/export/csv${queryString ? `?${queryString}` : ''}`;

    const token = typeof window !== 'undefined' ? localStorage.getItem('jobbox_access_token') : null;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Export failed with status ${response.status}`);
    }

    const blob = await response.blob();

    // Pull the filename the server suggested (Content-Disposition),
    // fall back to a generated one if it's missing.
    const disposition = response.headers.get('content-disposition');
    let filename = `audit-logs-${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, '')}.csv`;

    if (disposition) {
      const match = disposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
      if (match && match[1]) {
        filename = decodeURIComponent(match[1].replace(/"/g, ''));
      }
    }

    return { blob, filename };
  },
};