import axiosInstance from '../axios';
import { API_ENDPOINTS } from '../constants';

// ============================================
// TYPES
// ============================================

export interface OrganizationRegisterData {
  organizationName: string;
  organizationType: 'university' | 'college' | 'institute' | 'school' | 'other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  registeredBy: {
    name: string;
    email: string;
    designation: string;
  };
}

export interface OrganizationVerifyData {
  token: string;
  password: string;
}

export interface OrganizationLoginData {
  email: string;
  password: string;
}

export interface CreateAdminData {
  name: string;
  email: string;
  mobile: string;
  designation: 'dean' | 'director' | 'principal' | 'admin' | 'other';
}

export interface ApproveRejectData {
  reason?: string;
}

// ============================================
// ORGANIZATION API
// ============================================

export const organizationApi = {
  // ============================================
  // PUBLIC ROUTES
  // ============================================

  register: async (data: OrganizationRegisterData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORGANIZATION.REGISTER, data);
    return response.data;
  },

  verify: async (data: OrganizationVerifyData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORGANIZATION.VERIFY, data);
    return response.data;
  },

  login: async (data: OrganizationLoginData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORGANIZATION.LOGIN, data);

    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('organization', JSON.stringify(response.data.organization));
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
    }

    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORGANIZATION.LOGOUT);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('organization');
    localStorage.removeItem('admin');
    return response.data;
  },

  getPublicList: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORGANIZATION.PUBLIC_LIST);
    return response.data;
  },

  // ============================================
  // PROTECTED ORGANIZATION ADMIN ROUTES
  // ============================================

  getMe: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORGANIZATION.ME);
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORGANIZATION.STATS);
    return response.data;
  },

  createAdmin: async (data: CreateAdminData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORGANIZATION.ADMINS, data);
    return response.data;
  },

  getPendingStudents: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORGANIZATION.STUDENTS_PENDING);
    return response.data;
  },

  getStudents: async (params?: { status?: string; departmentId?: string }) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORGANIZATION.STUDENTS, { params });
    return response.data;
  },

  approveStudent: async (studentId: string) => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.ORGANIZATION.APPROVE_STUDENT(studentId)
    );
    return response.data;
  },

  rejectStudent: async (studentId: string, data?: ApproveRejectData) => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.ORGANIZATION.REJECT_STUDENT(studentId),
      data
    );
    return response.data;
  },

  // ============================================
  // STUDENT MANAGEMENT
  // ============================================

  addStudent: async (data: { name: string; email: string; departmentId: string }) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORGANIZATION.ADD_STUDENT, data);
    return response.data;
  },

  importStudentsCSV: async (data: { students: Array<{ name: string; email: string; department: string }> }) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORGANIZATION.IMPORT_CSV, data);
    return response.data;
  },

  // Student Management
  getStudentById: async (studentId: string) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORGANIZATION.GET_STUDENT(studentId));
    return response.data;
  },

  updateStudent: async (studentId: string, data: {
    name?: string;
    email?: string;
  }) => {
    const response = await axiosInstance.put(API_ENDPOINTS.ORGANIZATION.UPDATE_STUDENT(studentId), data);
    return response.data;
  },

  archiveStudent: async (studentId: string) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.ORGANIZATION.ARCHIVE_STUDENT(studentId));
    return response.data;
  },

  unarchiveStudent: async (studentId: string) => {
    const response = await axiosInstance.patch(API_ENDPOINTS.ORGANIZATION.UNARCHIVE_STUDENT(studentId));
    return response.data;
  },

  getStudentPortfolio: async (studentId: string) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORGANIZATION.STUDENT_PORTFOLIO(studentId));
    return response.data;
  },

  // ============================================
  // PLATFORM ADMIN ROUTES (Manage Organizations)
  // ============================================

  getAllOrganizations: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORGANIZATION.ALL, { params });
    return response.data;
  },

  toggleOrganizationActive: async (organizationId: string) => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.ORGANIZATION.TOGGLE_ACTIVE(organizationId)
    );
    return response.data;
  },
};
