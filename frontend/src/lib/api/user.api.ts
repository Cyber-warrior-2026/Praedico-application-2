import axiosInstance from '../axios';
import { API_ENDPOINTS } from '../constants';

// User API Service
export const userApi = {
  // Get User Profile
  getProfile: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.USER.PROFILE);
    return response.data;
  },

  // Update User Profile
  updateProfile: async (data: any) => {
    const response = await axiosInstance.put(API_ENDPOINTS.USER.UPDATE, data);
    return response.data;
  },

// get me function
  getMe: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.USER.PROFILE, { withCredentials: true });
    return response.data;
  },
  logout: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.USER.LOGOUT);
    return response.data;
  },
};
