import { apiRequest } from './api' // this resolves to src/services/api.js

const SETTINGS_ENDPOINT = '/api/admin/settings'

export const settingsService = {
  getSettings: () => {
    return apiRequest(SETTINGS_ENDPOINT, { method: 'GET' })
  },

  updateSettings: (payload) => {
    return apiRequest(SETTINGS_ENDPOINT, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },
}