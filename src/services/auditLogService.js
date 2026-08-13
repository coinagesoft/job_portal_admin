import { apiRequest } from './api';

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
  }
};
