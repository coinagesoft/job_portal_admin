// ─────────────────────────────────────────────────────────────────────────────
// Backend address comes ONLY from the .env file (project root):
//     NEXT_PUBLIC_API_URL=https://localhost:7011
// Restart `npm run dev` (or rebuild/redeploy) after changing it.
// ─────────────────────────────────────────────────────────────────────────────
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
const BASE_URL = API_BASE_URL;

/** Turn a stored file/image value ("/uploads/x.pdf" or old absolute URL) into a loadable URL. */
export const resolveFileUrl = (url) => {
  if (!url) return '';
  if (/^(data|blob):/i.test(url)) return url;
  if (/^https?:\/\//i.test(url)) {
    try {
      const u = new URL(url);
      // our own uploads: always use the CURRENT base URL (fixes old IP/localhost rows)
      if (API_BASE_URL && u.pathname.startsWith('/uploads/')) return `${API_BASE_URL}${u.pathname}${u.search}`;
    } catch { /* invalid URL */ }
    return url;
  }
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

export const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jobbox_access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    ...getHeaders(),
    ...options.headers,
  };
  
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }
  
  const config = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(url, config);
    
    // Check if the response is unauthorized and try to refresh token
    if (response.status === 401 && typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('jobbox_refresh_token');
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${BASE_URL}/api/admin/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });
          
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem('jobbox_access_token', data.accessToken);
            localStorage.setItem('jobbox_refresh_token', data.refreshToken);
            
            // Retry the original request with the new token
            config.headers['Authorization'] = `Bearer ${data.accessToken}`;
            const retryResponse = await fetch(url, config);
            return await handleResponse(retryResponse, options.responseType);
          } else {
            // Refresh token failed/expired - clear session and redirect to login
            logoutUser();
          }
        } catch (refreshErr) {
          logoutUser();
        }
      } else {
        logoutUser();
      }
    }
    
    return await handleResponse(response, options.responseType);
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

const handleResponse = async (response, responseType) => {
  if (responseType === 'blob') {
    if (!response.ok) {
      const errorText = await response.text();
      let errorData = errorText;
      try { errorData = JSON.parse(errorText); } catch { /* The API returned a non-JSON error. */ }
      const error = new Error((errorData && errorData.message) || response.statusText || 'An error occurred');
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
    return await response.blob();
  }

  const contentType = response.headers.get('content-type');
  let data = null;
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }
  
  if (!response.ok) {
    const errorMsg = (data && data.message) || response.statusText || 'An error occurred';
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jobbox_access_token');
    localStorage.removeItem('jobbox_refresh_token');
    localStorage.removeItem('jobbox_superadmin');
    window.location.href = '/';
  }
};