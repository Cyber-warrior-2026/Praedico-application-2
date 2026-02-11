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
  
} as const;
