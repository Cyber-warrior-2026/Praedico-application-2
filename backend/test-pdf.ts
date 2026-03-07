import mongoose from 'mongoose';
import dotenv from 'dotenv';
import certificateService from './src/services/certificateService';
import connectDB from './src/config/database';

dotenv.config();

async function runTest() {
  console.log('--- Generating Preview Certificate ---');
  await connectDB();
  
  try {
    // Generate dummy certificate directly
    await certificateService.generateCertificate({
      userId: new mongoose.Types.ObjectId().toString(),
      userName: "Alexander Sterling",
      planName: "Enterprise Vanguard",
      startDate: new Date('2025-01-01'),
      endDate: new Date('2026-01-01'),
      // Fallback praedico logo will be used
    });
    
    console.log('Preview certificate generated successfully! Check public/certificates/');
  } catch (error) {
    console.error('Error in generation:', error);
  }
}

runTest();
