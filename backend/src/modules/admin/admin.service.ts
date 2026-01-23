import { AdminModel } from './admin.model';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export class AdminService {
  
  // 1. Create Admin (Only used initially to seed the DB)
  static async createAdmin(email: string, plainPass: string) {
    const hash = await argon2.hash(plainPass);
    return await AdminModel.create({ email, passwordHash: hash });
  }

  // 2. Login Logic
  static async login(email: string, plainPass: string) {
    // Find admin and select the hidden password field
    const admin = await AdminModel.findOne({ email }).select('+passwordHash');
    
    if (!admin) throw new Error('Invalid Credentials'); // Vague error for security

    // Verify Password
    const isValid = await argon2.verify(admin.passwordHash, plainPass);
    if (!isValid) throw new Error('Invalid Credentials');

    // Generate Token
    const token = jwt.sign(
      { id: admin._id, role: admin.role, email: admin.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' } // Short lived access token
    );

    return token;
  }
}