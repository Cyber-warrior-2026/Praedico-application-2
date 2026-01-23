import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  isVerified: boolean;
  verificationToken?: string; 
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
}

const UserSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true 
  },
  passwordHash: { 
    type: String, 
    select: false 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  verificationToken: { 
    type: String, 
    select: false // Hide internal tokens from API responses
  },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },
  lastLogin: { type: Date }
}, {
  timestamps: true
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);