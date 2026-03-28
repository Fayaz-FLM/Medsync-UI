import axios from 'axios';

// Determine API base URL in a way that avoids CORS problems.
// - In dev (Vite), ALWAYS go through the proxy at `/api` so the browser
//   only talks to the same origin (see vite.config.js).
// - In non-dev (prod), honor VITE_API_BASE_URL if set, otherwise fall back
//   to the gateway URL.
let API_BASE_URL;
const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

if (isDev) {
  API_BASE_URL = '/api';
} else {
  const fromEnv = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    ? import.meta.env.VITE_API_BASE_URL
    : null;
  API_BASE_URL = fromEnv || 'http://localhost:8000';
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only logout on 401 if it's an authentication endpoint or if token is truly invalid
    if (error.response?.status === 401) {
      const url = error.config?.url || ''
      // Don't logout for these cases:
      // 1. Login endpoint (already handled)
      // 2. Password reset endpoints
      // 3. 404 errors that return 401 (resource not found, not auth issue)
      const isAuthEndpoint = url.includes('/auth/login') || 
                            url.includes('/forgot-password') || 
                            url.includes('/verify-otp') || 
                            url.includes('/reset-password')
      
      if (!isAuthEndpoint) {
        // Check if we have a token - if not, redirect to login
        const token = localStorage.getItem('token')
        if (!token) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('ms_auth')
          window.location.href = '/login'
        }
        // If we have a token but got 401, it might be expired
        // Let the error propagate so the component can handle it
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance;
export { API_BASE_URL };
