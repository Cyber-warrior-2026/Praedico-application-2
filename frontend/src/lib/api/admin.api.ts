import axiosInstance from '../axios';
import { API_ENDPOINTS } from '../constants';

export interface AdminLoginData {
  email: string;
  password: string;
}

export const adminApi = {
  login: async (data: AdminLoginData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.LOGIN, data);
    
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
    }
    
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.DASHBOARD);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.USERS);
    return response.data;
  },
};
