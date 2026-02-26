// API Base URL
// If you are in Production (Vercel), use empty string.
// This makes requests go to "https://praedico-frontend.vercel.app/api/..."
// which the Rewrite rule above then forwards to the backend.
export const API_BASE_URL = process.env.NODE_ENV === "production"
  ? ""
  : "http://localhost:5001";

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
    PROFILE: '/api/users/me',
    UPDATE: '/api/users/update',
    LOGOUT: "/api/users/logout",
  },

  // ✨ NEW: Stock Market Data
  STOCK: {
    ALL_LATEST: '/api/stocks/latest',
    NIFTY50: '/api/stocks/latest?category=NIFTY50',
    NIFTY100: '/api/stocks/latest?category=NIFTY100',
    ETF: '/api/stocks/latest?category=ETF',
    BY_SYMBOL: (symbol: string) => `/api/stocks/${symbol}`,
    HISTORY: (symbol: string) => `/api/stocks/${symbol}/history`,
    SCRAPER_STATUS: '/api/scraper/status',
    MANUAL_SCRAPE: '/api/stocks/scrape',
  },

  // ✨ NEW: News Data
  NEWS: {
    LATEST: '/api/news/latest',
    ALL: '/api/news',
    MARKET: '/api/news/market',
    STOCKS: '/api/news/stocks',
    IPO: '/api/news/ipo',
    BY_SYMBOL: (symbol: string) => `/api/news/symbol/${symbol}`,
    SCRAPER_STATUS: '/api/news/scraper/status',
    MANUAL_SCRAPE: '/api/news/scrape',
  },

  // ✨ NEW: Payment Endpoints
  PAYMENT: {
    SUBSCRIBE: '/api/payments/subscribe',
    TRIAL: '/api/payments/trial',
    VERIFY: '/api/payments/verify',
  },

  // ✨ NEW: Organization Endpoints
  ORGANIZATION: {
    // Public
    REGISTER: '/api/organization/register',
    VERIFY: '/api/organization/verify',
    LOGIN: '/api/organization/login',
    LOGOUT: '/api/organization/logout',
    PUBLIC_LIST: '/api/organization/public/list',

    // Protected (Org Admin)
    ME: '/api/organization/me',
    STATS: '/api/organization/stats',
    ADMINS: '/api/organization/admins',
    STUDENTS_PENDING: '/api/organization/students/pending',
    STUDENTS: '/api/organization/students',
    APPROVE_STUDENT: (studentId: string) => `/api/organization/students/${studentId}/approve`,
    REJECT_STUDENT: (studentId: string) => `/api/organization/students/${studentId}/reject`,
    ADD_STUDENT: '/api/organization/students/add',
    IMPORT_CSV: '/api/organization/students/import-csv',

    // Student Management
    GET_STUDENT: (studentId: string) => `/api/organization/students/${studentId}`,
    UPDATE_STUDENT: (studentId: string) => `/api/organization/students/${studentId}`,
    ARCHIVE_STUDENT: (studentId: string) => `/api/organization/students/${studentId}`,
    UNARCHIVE_STUDENT: (studentId: string) => `/api/organization/students/${studentId}/unarchive`,
    STUDENT_PORTFOLIO: (studentId: string) => `/api/organization/students/${studentId}/portfolio`,
    BULK_ACTION: '/api/organization/students/bulk-action',

    // Platform Admin
    ALL: '/api/organization/all',
    TOGGLE_ACTIVE: (id: string) => `/api/organization/${id}/toggle-active`,
  },

  // ✨ NEW: Coordinator Endpoints
  COORDINATOR: {
    // Public
    VERIFY: '/api/coordinator/verify',
    LOGIN: '/api/coordinator/login',
    LOGOUT: '/api/coordinator/logout',

    // Protected (Coordinator)
    ME: '/api/coordinator/me',
    STUDENTS: '/api/coordinator/students',
    STUDENTS_PENDING: '/api/coordinator/students/pending',
    APPROVE_STUDENT: (studentId: string) => `/api/coordinator/students/${studentId}/approve`,
    REJECT_STUDENT: (studentId: string) => `/api/coordinator/students/${studentId}/reject`,
    ADD_STUDENT: '/api/coordinator/students/add',
    IMPORT_CSV: '/api/coordinator/students/import-csv',

    // Student Management
    GET_STUDENT: (studentId: string) => `/api/coordinator/students/${studentId}`,
    UPDATE_STUDENT: (studentId: string) => `/api/coordinator/students/${studentId}`,
    ARCHIVE_STUDENT: (studentId: string) => `/api/coordinator/students/${studentId}`,
    UNARCHIVE_STUDENT: (studentId: string) => `/api/coordinator/students/${studentId}/unarchive`,
    STUDENT_PORTFOLIO: (studentId: string) => `/api/coordinator/students/${studentId}/portfolio`,
    STUDENT_REPORT: (studentId: string) => `/api/coordinator/students/${studentId}/report`,
    STUDENT_REVIEW: (studentId: string) => `/api/coordinator/students/${studentId}/review`,
    RECONCILE: '/api/coordinator/reconcile',
    BULK_ACTION: '/api/coordinator/students/bulk-action',

    // Org Admin
    CREATE: '/api/coordinator',
    ALL: '/api/coordinator/all',
    DELETE: (id: string) => `/api/coordinator/${id}`,
  },

  // ✨ NEW: Department Endpoints
  DEPARTMENT: {
    // Public
    PUBLIC: (organizationId: string) => `/api/department/public/${organizationId}`,

    // Protected
    CREATE: '/api/department',
    LIST: '/api/department',
    BY_ID: (id: string) => `/api/department/${id}`,
    DETAILS: (id: string) => `/api/department/${id}/details`,
    UPDATE: (id: string) => `/api/department/${id}`,
    DELETE: (id: string) => `/api/department/${id}`,
  },

} as const;

