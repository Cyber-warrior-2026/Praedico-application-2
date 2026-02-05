import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import { securityHeaders } from "./common/middlewares/security.middleware";
import { requestLogger } from "./common/middlewares/logging.middleware";
import { globalErrorHandler } from "./common/errors/errorHandler";
import stockDataRoutes from './routes/stockData';
import newsDataRoutes from './routes/newsData';
import cronService from './services/cronService';
import aiChatRoutes from './routes/aiChat'; 
import paymentRoutes from './routes/payment';

import userRoutes from "./routes/user";
import { ENV } from "./config/env";

export const createApp = (): Application => {
  const app = express();

  // --- 1. Security Middleware Layer ---
  app.use(helmet());
  app.use(securityHeaders);
  app.use(
    cors({
      origin: ENV.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
    }),
  );
  app.use(hpp());

  // Global Rate Limiting (Basic DDoS Protection)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  });
  app.use("/api", limiter);

  // --- 2. Parser Middleware Layer ---
  app.use(express.json({ limit: "10kb" }));
  app.use(cookieParser());
  app.use(requestLogger);

  // --- 3. Health Check (Keep this fast) ---
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "System Operational",
      timestamp: new Date(),
    });
  });

  // --- 4. Routes ---
  app.use("/api/users", userRoutes);
  app.use('/api', stockDataRoutes);
  app.use('/api', newsDataRoutes); 
  app.use('/api', aiChatRoutes);
  app.use('/api/payments', paymentRoutes);

  // --- 5. Error Handling Layer ---
  // 404 Handler for undefined routes
  app.use((req: Request, res: Response) => {
    res
      .status(404)
      .json({ success: false, message: `Route ${req.originalUrl} not found` });
  });

  app.use(globalErrorHandler);

  return app;
};
