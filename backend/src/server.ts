import { createApp } from "./app";
import connectDB from "./config/database";
import { ENV } from "./config/env";
import http from "http";
import mongoose from "mongoose";
import cronService from "./services/cronService";
import { TradingSocketServer } from "./websocket/tradingSocket";

const startServer = async () => {
  // 1. Initialize App
  const app = createApp();
  const server = http.createServer(app);

  // 2. Connect to Database
  await connectDB();

  // 3. Initialize WebSocket Server (NEW)
  const tradingSocket = new TradingSocketServer(server);
  
  // Make WebSocket instance globally available for controllers
  (global as any).tradingSocket = tradingSocket;
  
  console.log('🌐 WebSocket server initialized');

  // 4. Start Cron Jobs
  cronService.startScraperJob();
  cronService.startNewsScraperJob();
  cronService.startTradingLevelJob();
  console.log('📊 Stock scraper cron job started');
  console.log('📰 News scraper cron job started');

  // Optional: Run scraper immediately on startup for testing
  // await cronService.runScraperNow();

  // 5. Start Listener
  server.listen(ENV.PORT, () => {
    console.log(`\n🚀 Ferrari Engine Started on Port: ${ENV.PORT}`);
    console.log(`🛡️ RBAC Security System: ACTIVE`);
    console.log(`🌐 WebSocket Real-Time System: ACTIVE`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}\n`);
  });

  // --- GRACEFUL SHUTDOWN LOGIC (The Legendary Part) ---
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Closing HTTP server...`);
    
    server.close(async () => {
      console.log("✅ HTTP server closed.");
      
      // Stop WebSocket server (NEW)
      tradingSocket.shutdown();
      console.log("✅ WebSocket server closed.");
      
      // Stop cron jobs
      cronService.stopScraperJob();
      cronService.stopNewsScraperJob();
      cronService.stopTradingLevelJob();
      console.log("✅ Cron jobs stopped.");
      
      // Close Database Connection
      await mongoose.connection.close(false);
      console.log("✅ MongoDB connection closed.");
      
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT")); // Catches Ctrl+C
};

// Catch Unhandled Rejections (Async errors that weren't caught)
process.on("unhandledRejection", (err: Error) => {
  console.error("❌ UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

startServer();
