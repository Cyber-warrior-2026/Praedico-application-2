import { createApp } from "./app";
import connectDB from "./config/database"; // Ensure this path matches your folder
import { ENV } from "./config/env"; // Use the safe ENV loader we built
import http from "http";
import mongoose from "mongoose";

const startServer = async () => {
  // 1. Initialize App
  const app = createApp();
  const server = http.createServer(app);

  // 2. Connect to Database
  await connectDB();

  // 3. Start Listener
  server.listen(ENV.PORT, () => {
    console.log(`\n🚀 Ferrari Engine Started on Port: ${ENV.PORT}`);
    console.log(`🔒 Admin Security Mode: ACTIVE`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}\n`);
  });

  // --- GRACEFUL SHUTDOWN LOGIC (The Legendary Part) ---

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Closing HTTP server...`);

    server.close(async () => {
      console.log("✅ HTTP server closed.");

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
