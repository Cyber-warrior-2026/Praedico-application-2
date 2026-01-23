import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import { securityHeaders } from './common/middlewares/security.middleware';
import { requestLogger } from './common/middlewares/logging.middleware';
import { globalErrorHandler } from './common/errors/errorHandler';
import userRoutes from './modules/user/user.routes';
import adminRoutes from './modules/admin/admin.routes'

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(securityHeaders);
  app.use(requestLogger);
  app.use(hpp());

  app.get('/health', (req, res) => res.json({ success: true, message: 'Server running' }));

  app.use('/api/users', userRoutes);
  app.use('api/admin', adminRoutes);

  app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
  app.use(globalErrorHandler);

  return app;
};
