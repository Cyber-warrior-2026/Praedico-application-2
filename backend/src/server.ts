import dotenv from 'dotenv';
dotenv.config(); 

import { createApp } from './app';
import connectDB from './config/database';

const app = createApp();
const PORT = process.env.PORT || 5000;

// 1. Connect to Database
connectDB();

// 2. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔒 Admin Security Mode: ACTIVE`);
});