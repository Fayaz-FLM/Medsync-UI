import axios from 'axios';

// Determine API base URL in a way that avoids CORS during local development.
// - In dev (Vite), if VITE_API_BASE_URL is not set, we use '/api' so calls go
//   through the Vite proxy (see vite.config.js) and never leave the origin.
// - In other environments, fall back to explicit gateway URL.
let API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : null;

if (!API_BASE_URL) {
  const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
  API_BASE_URL = isDev ? '/api' : 'http://localhost:8000';
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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('ms_auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { API_BASE_URL };
