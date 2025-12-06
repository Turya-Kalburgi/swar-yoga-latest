import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IMilestone {
  _id?: string;
  userId: string;
  goalId?: string;
  visionId?: string;
  title: string;
  description?: string;
  dueDate?: Date;
  status?: 'Pending' | 'In Progress' | 'Completed';
  progress?: number;
  rewards?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const milestoneSchema = new Schema<IMilestone>(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    goalId: { type: String, ref: 'Goal' },
    visionId: { type: String, ref: 'Vision' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    dueDate: { type: Date },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    rewards: { type: String, default: '' },
  },
  { _id: false, timestamps: true }
);

milestoneSchema.index({ userId: 1, goalId: 1 });

export default mongoose.model<IMilestone>('Milestone', milestoneSchema);
