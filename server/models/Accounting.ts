import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ITransaction {
  _id?: string;
  adminId: string;
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  notes?: string;
  invoiceNumber?: string;
  attachments?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  _id?: string;
  adminId: string;
  name: string;
  type: 'income' | 'expense';
  budget?: number;
  description?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    _id: { type: String, default: () => uuidv4() },
    adminId: { type: String, required: true, index: true },
    date: { type: Date, required: true, index: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    paymentMethod: { type: String, default: 'cash' },
    status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
    notes: { type: String, default: '' },
    invoiceNumber: { type: String },
    attachments: [String],
  },
  { _id: false, timestamps: true }
);

const categorySchema = new Schema<ICategory>(
  {
    _id: { type: String, default: () => uuidv4() },
    adminId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    budget: { type: Number },
    description: { type: String, default: '' },
    color: { type: String, default: '#3B82F6' },
  },
  { _id: false, timestamps: true }
);

transactionSchema.index({ adminId: 1, date: -1 });
transactionSchema.index({ adminId: 1, type: 1 });
categorySchema.index({ adminId: 1, type: 1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
export const Category = mongoose.model<ICategory>('Category', categorySchema);
