import mongoose, { Schema, Document } from 'mongoose';

export interface IInstitute extends Document {
  // Organization Details
  organizationName: string;
  contactPerson: string;
  address: string;
  email: string;
  mobile: string;
  website?: string;
  
  // Auth Fields
  passwordHash?: string;
  role: 'institute';
  isVerified: boolean;
  isActive: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  
  // Status Fields
  lastLogin?: Date;
  lastActive?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
  
  // Institute-specific Stats
  totalStudents?: number;
  activeStudents?: number;
  pendingApprovals?: number;
}

const InstituteSchema: Schema = new Schema({
  organizationName: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  passwordHash: {
    type: String,
    select: false
  },
  role: {
    type: String,
    enum: ['institute'],
    default: 'institute'
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
  
  // Stats
  totalStudents: { type: Number, default: 0 },
  activeStudents: { type: Number, default: 0 },
  pendingApprovals: { type: Number, default: 0 },
}, {
  timestamps: true
});

export const InstituteModel = mongoose.model<IInstitute>('Institute', InstituteSchema);