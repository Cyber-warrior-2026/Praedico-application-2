import mongoose, { Document, Schema } from 'mongoose';
import argon2 from 'argon2';

export interface IUser extends Document {
  email: string;
  password?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      minlength: 8,
      select: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  { timestamps: true }
);

// Hash password with Argon2 before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    this.password = await argon2.hash(this.password);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password using Argon2
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch {
    return false;
  }
};

export const User = mongoose.model<IUser>('User', userSchema);
