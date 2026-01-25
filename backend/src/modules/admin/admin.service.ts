import { AdminModel } from './admin.model';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export class AdminService {
  

  // Added 'name' parameter with a default string
static async createAdmin(email: string, plainPass: string, name: string = "Admin") {
  const hash = await argon2.hash(plainPass);
  // Pass 'name' to the database
  return await AdminModel.create({ email, passwordHash: hash, name });
}


  static async login(email: string, plainPass: string) {

    const admin = await AdminModel.findOne({ email }).select('+passwordHash');
    
    if (!admin) throw new Error('Invalid Credentials'); // Vague error for security


    const isValid = await argon2.verify(admin.passwordHash, plainPass);
    if (!isValid) throw new Error('Invalid Credentials');


    const token = jwt.sign(
  { 
    id: admin._id, 
    role: admin.role, 
    email: admin.email, 
    name: admin.name || "Admin"
  },
  process.env.JWT_SECRET as string,
  { expiresIn: '1h' }
);

    return token;
  }
}