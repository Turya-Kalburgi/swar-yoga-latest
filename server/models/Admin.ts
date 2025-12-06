import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ILoginHistory {
  date?: Date;
  ipAddress?: string;
  userAgent?: string;
  device?: string;
  browser?: string;
  status?: 'success' | 'failed';
}

export interface IAdmin {
  _id?: string;
  adminId: string;
  email: string;
  name: string;
  passwordHash: string;
  role?: 'superadmin' | 'admin' | 'moderator' | 'support';
  permissions?: string[];
  accountStatus?: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date | null;
  loginCount?: number;
  createdAt?: Date;
  createdBy?: string;
  loginHistory?: ILoginHistory[];
  metadata?: {
    department?: string;
    phoneNumber?: string;
    lastPasswordChange?: Date;
    twoFactorEnabled?: boolean;
  };
}

const loginHistorySchema = new Schema<ILoginHistory>(
  {
    date: { type: Date, default: () => new Date() },
    ipAddress: String,
    userAgent: String,
    device: String,
    browser: String,
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
  },
  { _id: false }
);

const adminSchema = new Schema<IAdmin>(
  {
    _id: { type: String, default: () => uuidv4() },
    adminId: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true, index: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'admin', 'moderator', 'support'], default: 'admin' },
    permissions: [{ type: String, enum: ['manage_users', 'manage_workshops', 'manage_orders', 'manage_contacts', 'manage_admins', 'view_analytics', 'view_reports', 'manage_settings'] }],
    accountStatus: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    lastLogin: { type: Date, default: null },
    loginCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: () => new Date() },
    createdBy: { type: String, default: 'system' },
    loginHistory: [loginHistorySchema],
    metadata: {
      department: String,
      phoneNumber: String,
      lastPasswordChange: Date,
      twoFactorEnabled: { type: Boolean, default: false },
    },
  },
  { _id: false, timestamps: true }
);

adminSchema.index({ adminId: 1 });
adminSchema.index({ email: 1 });

export default mongoose.model<IAdmin>('Admin', adminSchema);
