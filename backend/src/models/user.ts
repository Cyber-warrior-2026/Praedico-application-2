import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: 'user' | 'admin' | 'super_admin';
  isVerified: boolean;
  isActive: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  lastActive?: Date;
  
  // Subscription Fields
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'created' | 'authenticated' | 'past_due' | 'completed' | 'cancelled' | 'paused' | 'expired' | 'pending' | 'halted';
  currentPlan?: 'Pro' | 'Team' | 'Enterprise' | 'Free';
  subscriptionExpiry?: Date;
}


const UserSchema: Schema = new Schema({
  name: {
    type: String,
    trim: true,
    default: "User"
  },
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

  role: {
    type: String,
    enum: ['user', 'admin', 'super_admin'],
    default: 'user'
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  verificationToken: { type: String, select: false },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },
lastLogin: { type: Date },
isActive: {
  type: Boolean,
  default: true
},
lastActive: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  
  // Subscription Fields (New)
  subscriptionId: { type: String },
  subscriptionStatus: { type: String, default: 'active' }, // Defaulting to active for free tier logic if needed, or null
  currentPlan: { type: String, default: 'Free' },
  subscriptionExpiry: { type: Date },
}, {
  timestamps: true
});

//Checking some new Git functionalities
export const UserModel = mongoose.model<IUser>('User', UserSchema);