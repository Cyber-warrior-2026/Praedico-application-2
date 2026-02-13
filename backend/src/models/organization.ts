import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganization extends Document {
  // Organization Details
  organizationName: string;
  organizationType: 'university' | 'college' | 'institute' | 'school' | 'other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  
  // Registration details (for first admin who registers org)
  registeredBy: {
    name: string;
    email: string;
    designation: string;
  };
  
  // Auth Fields (only for initial registration, later use organizationAdmin model)
  passwordHash?: string;
  isVerified: boolean;
  isActive: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  
  // Activity
  lastLogin?: Date;
  lastActive?: Date;
  
  // Status
  isDeleted: boolean;
  deletedAt?: Date;
  
  // Organization Stats
  totalDepartments: number;
  totalAdmins: number;
  totalCoordinators: number;
  totalStudents: number;
  activeStudents: number;
  pendingApprovals: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema: Schema = new Schema({
  organizationName: {
    type: String,
    required: true,
    trim: true
  },
  organizationType: {
    type: String,
    enum: ['university', 'college', 'institute', 'school', 'other'],
    default: 'institute'
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    default: 'India',
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  
  registeredBy: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    designation: { type: String, required: true }
  },
  
  passwordHash: {
    type: String,
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  verificationToken: { type: String, select: false },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },
  lastLogin: { type: Date },
  lastActive: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  
  // Stats
  totalDepartments: { type: Number, default: 0 },
  totalAdmins: { type: Number, default: 0 },
  totalCoordinators: { type: Number, default: 0 },
  totalStudents: { type: Number, default: 0 },
  activeStudents: { type: Number, default: 0 },
  pendingApprovals: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const OrganizationModel = mongoose.model<IOrganization>('Organization', OrganizationSchema);
