// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/api/users/register',
    VERIFY: '/api/users/verify',
    LOGIN: '/api/users/login',
    LOGOUT: '/api/users/logout',
    FORGOT_PASSWORD: '/api/users/forgot-password',
    RESET_PASSWORD: '/api/users/reset-password',
    REFRESH_TOKEN: '/api/users/refresh-token',
  },
  
  // Admin
  ADMIN: {
    LOGIN: '/api/admin/login',
    DASHBOARD: '/api/admin/dashboard',
    USERS: '/api/admin/users',
  },
  
  // User
  USER: {
    PROFILE: '/api/users/profile',
    UPDATE: '/api/users/update',
  },
} as const;
