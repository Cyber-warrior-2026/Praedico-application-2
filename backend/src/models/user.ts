import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: 'user' | 'admin' | 'super_admin' | 'institute';

  isVerified: boolean;
  isActive: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  lastActive?: Date;

  // Institute Relationship
institute?: mongoose.Types.ObjectId;
instituteApprovalStatus?: 'pending' | 'approved' | 'rejected';
instituteApprovedBy?: mongoose.Types.ObjectId;
instituteApprovedAt?: Date;
instituteRejectedReason?: string;

  
  // Subscription Fields
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'created' | 'authenticated' | 'past_due' | 'completed' | 'cancelled' | 'paused' | 'expired' | 'pending' | 'halted';
  currentPlan?: 'Pro' | 'Team' | 'Enterprise' | 'Free';
  subscriptionExpiry?: Date;
  
  // Trial Fields
  hasUsedTrial?: boolean;
  isOnTrial?: boolean;
  trialEndDate?: Date;

    // ✨ Add these two properties:
  isDeleted?: boolean;
  deletedAt?: Date;

    // Paper Trading Fields
  virtualBalance: number;
  initialVirtualBalance: number;
  virtualBalanceLastReset?: Date;
  totalPaperTradesCount: number;
  profitablePaperTrades: number;
  totalPaperPL: number;
  bestPaperTrade?: number;
  worstPaperTrade?: number;
  tradingLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
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
enum: ['user', 'admin', 'super_admin', 'institute'],

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

  // Institute Relationship
institute: {
  type: Schema.Types.ObjectId,
  ref: 'Institute'
},
instituteApprovalStatus: {
  type: String,
  enum: ['pending', 'approved', 'rejected']
},
instituteApprovedBy: {
  type: Schema.Types.ObjectId,
  ref: 'Institute'
},
instituteApprovedAt: { type: Date },
instituteRejectedReason: { type: String },

  
  // Subscription Fields (New)
  subscriptionId: { type: String },
  subscriptionStatus: { type: String }, // No default - only set when user has an actual subscription
  currentPlan: { type: String, default: 'Free' },
  subscriptionExpiry: { type: Date },

  // Trial Fields
  hasUsedTrial: { type: Boolean, default: false },
  isOnTrial: { type: Boolean, default: false },
  trialEndDate: { type: Date },

  virtualBalance: { type: Number, default: 100000 }, // ₹1,00,000 default
initialVirtualBalance: { type: Number, default: 100000 },
virtualBalanceLastReset: { type: Date },
totalPaperTradesCount: { type: Number, default: 0 },
profitablePaperTrades: { type: Number, default: 0 },
totalPaperPL: { type: Number, default: 0 },
bestPaperTrade: { type: Number },
worstPaperTrade: { type: Number },
tradingLevel: { 
  type: String, 
  enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
  default: 'BEGINNER'
},
}, 

{
  timestamps: true
});

//Checking some new Git functionalities
export const UserModel = mongoose.model<IUser>('User', UserSchema);