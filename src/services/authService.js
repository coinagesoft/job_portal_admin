import { apiRequest } from './api';

export const authService = {
  // POST /api/admin/auth/send-otp
  sendOtp: async (email) => {
    return await apiRequest('/api/admin/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // POST /api/admin/auth/resend-otp
  resendOtp: async (email) => {
    return await apiRequest('/api/admin/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // POST /api/admin/auth/verify-otp
  verifyOtp: async (email, otp, rememberMe = true) => {
    const data = await apiRequest('/api/admin/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, rememberMe }),
    });
    
    // On success, save the credentials
    if (data && data.accessToken) {
      localStorage.setItem('jobbox_access_token', data.accessToken);
      localStorage.setItem('jobbox_refresh_token', data.refreshToken);
      
      // Keep superadmin layout sync
      const adminData = data.admin || data.item || data.data || data;
      console.log('authService: verifyOtp response raw:', data);
      console.log('authService: verifyOtp parsed adminData:', adminData);
      if (adminData && adminData.adminType) {
        const adminInfo = {
          name: adminData.fullName || 'Admin User',
          email: adminData.email || email,
          adminType: adminData.adminType,
          permissions: adminData.permissions,
        };
        localStorage.setItem('jobbox_logged_in_admin', JSON.stringify(adminInfo));
        if (adminData.adminType !== 'SubAdmin') {
          localStorage.setItem('jobbox_superadmin', JSON.stringify(adminInfo));
        }
        // Dispatch event for instant header update if header is mounted
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('jobbox-superadmin-updated', { detail: adminInfo }));
        }
      }
    }
    
    return data;
  },

  // POST /api/admin/auth/refresh
  refreshToken: async (refreshToken) => {
    return await apiRequest('/api/admin/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  // POST /api/admin/auth/logout
  logout: async () => {
    try {
      await apiRequest('/api/admin/auth/logout', {
        method: 'POST',
      });
    } catch (err) {
      console.error('Failed to call API logout endpoint:', err);
    } finally {
      // Always clear local session
      localStorage.removeItem('jobbox_access_token');
      localStorage.removeItem('jobbox_refresh_token');
      localStorage.removeItem('jobbox_superadmin');
      localStorage.removeItem('jobbox_logged_in_admin');
    }
  },

  // GET /api/admin/auth/me
  getCurrentUser: async () => {
    return await apiRequest('/api/admin/auth/me', {
      method: 'GET',
    });
  },
  
  // Helper to check if user is authenticated locally
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('jobbox_access_token');
  }
};
