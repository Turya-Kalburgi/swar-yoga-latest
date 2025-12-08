import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IReminder {
  _id?: string;
  userId: string;
  milestoneId?: string;
  title: string;
  description?: string;
  reminderDate?: Date;
  reminderType?: 'Email' | 'SMS' | 'Push' | 'In-App';
  status?: 'Active' | 'Sent' | 'Dismissed' | 'Expired';
  createdAt?: Date;
  updatedAt?: Date;
}

const reminderSchema = new Schema<IReminder>(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    milestoneId: { type: String, ref: 'Milestone' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    reminderDate: { type: Date },
    reminderType: { type: String, enum: ['Email', 'SMS', 'Push', 'In-App'], default: 'In-App' },
    status: { type: String, enum: ['Active', 'Sent', 'Dismissed', 'Expired'], default: 'Active' },
  },
  { _id: false, timestamps: true }
);

reminderSchema.index({ userId: 1, reminderDate: 1 });

export default mongoose.model<IReminder>('Reminder', reminderSchema);
