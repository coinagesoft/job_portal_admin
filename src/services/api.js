const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If running locally, hit the API directly (localhost is typically permitted or bypasses browser origin restrictions)
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
      return 'https://jobportal.coinage.in';
    }
  }
  // In production (Vercel), use relative pathing to proxy requests through Vercel's rewrite rule, bypassing CORS
  return '';
};

const BASE_URL = getBaseUrl();

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
