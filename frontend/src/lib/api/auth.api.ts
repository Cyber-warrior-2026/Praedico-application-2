import axiosInstance from '../axios';
import { API_ENDPOINTS } from '../constants';

export interface RegisterData {
  email: string;
}

export interface VerifyData {
  token: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}


export const authApi = {
  register: async (data: RegisterData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  verify: async (data: VerifyData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY, data);
    return response.data;
  },

  
  // NEW: Change Password (for logged-in users)
  changePassword: async (data: ChangePasswordData) => {
    const response = await axiosInstance.put('/api/users/reset-password', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, data);
    
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  },
};
