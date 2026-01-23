import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit'; // Run: npm install express-rate-limit
import { securityHeaders } from './common/middlewares/security.middleware';
import { requestLogger } from './common/middlewares/logging.middleware';
import { globalErrorHandler } from './common/errors/errorHandler';

// Import Routes
import userRoutes from './modules/user/user.routes';
import adminRoutes from './modules/admin/admin.routes';
import { ENV } from './config/env';

export const createApp = (): Application => {
  const app = express();

  // --- 1. Security Middleware Layer ---
  app.use(helmet()); // Secure HTTP Headers
  app.use(securityHeaders); // Your Custom Headers
  app.use(cors({ 
    origin: ENV.FRONTEND_URL, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }));
  app.use(hpp()); // Prevent Parameter Pollution

  // Global Rate Limiting (Basic DDoS Protection)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use('/api', limiter); // Apply to all API routes

  // --- 2. Parser Middleware Layer ---
  app.use(express.json({ limit: '10kb' })); // Limit body size to prevent crashes
  app.use(cookieParser());
  app.use(requestLogger); // Your Logger

  // --- 3. Health Check (Keep this fast) ---
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'System Operational', timestamp: new Date() });
  });

  // --- 4. Routes ---
  app.use('/api/users', userRoutes);
  app.use('/api/admin', adminRoutes); // Fixed: Added leading slash '/'

  // --- 5. Error Handling Layer ---
  // 404 Handler for undefined routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
  });

  // Global Error Handler (Must be last)
  app.use(globalErrorHandler);

  return app;
};