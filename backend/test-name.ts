import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './src/config/database';
import { UserModel } from './src/models/user';

dotenv.config();

async function run() {
  await connectDB();
  const user = await UserModel.findOne({ role: 'admin' }) || await UserModel.findOne({});
  console.log('User Name:', user?.name || (user as any)?.firstName + ' ' + (user as any)?.lastName);
  process.exit(0);
}
run();
