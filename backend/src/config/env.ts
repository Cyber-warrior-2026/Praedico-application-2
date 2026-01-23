import dotenv from 'dotenv';
dotenv.config();

// Helper function to validate existence
const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`❌ Missing Environment Variable: ${key}`);
  }
  return value;
};

export const ENV = {
  PORT: getEnv('PORT', '4000'),
  
  // Database
  MONGODB_URI: getEnv('MONGODB_URI'),
  
  // Security Secrets
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET'), // You called it REFRESH_SECRET in .env, make sure names match!
  ADMIN_SECRET_KEY: getEnv('ADMIN_SECRET_KEY'),
  
  // Configs
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '15m'),
  JWT_REFRESH_EXPIRES_IN: getEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  
  // Email
  EMAIL_USER: getEnv('EMAIL_USER'),
  EMAIL_PASS: getEnv('EMAIL_PASS'),
  
  // Frontend
  FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:3000')
};