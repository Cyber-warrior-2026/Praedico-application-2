import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  role: 'super_admin' | 'moderator';
  createdAt: Date;
}

const AdminSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    lowercase: true 
  },
  passwordHash: { 
    type: String, 
    required: true,
    select: false // SECURITY: Never return password in queries by default
  },
  role: { 
    type: String, 
    enum: ['super_admin', 'moderator'], 
    default: 'super_admin' 
  }
}, {
  timestamps: true
});

export const AdminModel = mongoose.model<IAdmin>('Admin', AdminSchema);