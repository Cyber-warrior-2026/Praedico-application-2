// src/lib/types/axios.ts
import axios from 'axios';
import { API_BASE_URL } from './constants';

// Create axios instance
const axiosInstance = axios.create({
  // 🟢 FORCE RELATIVE PATHS:
  // Even if API_BASE_URL has a value, we prefer '' in production to ensure
  // we hit the Next.js middleware/proxy.
  baseURL: process.env.NODE_ENV === 'production' ? '' : API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for Cookies
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // We are relying on Cookies now, but keeping this for safety
    // if you still use localStorage for UI state.
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For admin routes, add secret header
    if (config.url?.includes('/admin')) {
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY;
      if (adminKey) {
        config.headers['X-Uplink-Security'] = adminKey;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 🟢 FIX: Use relative path for refresh token too
        const { data } = await axios.post(
          `/api/users/refresh-token`, 
          {},
          { withCredentials: true }
        );
        
        if (typeof window !== 'undefined') {
           localStorage.setItem('accessToken', data.accessToken);
        }
        
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
           localStorage.removeItem('accessToken');
           localStorage.removeItem('user');
           // Optional: Redirect to login
           // window.location.href = '/'; 
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;