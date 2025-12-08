import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IGoal {
  _id?: string;
  userId: string;
  goalTitle: string;
  linkedVisionId?: string;
  description?: string;
  timeFrame?: string;
  category?: string;
  priority?: 'High' | 'Medium' | 'Low';
  status?: 'Active' | 'Paused' | 'Archived' | 'Completed';
  targetDate?: Date;
  milestones?: string[];
  progress?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    goalTitle: { type: String, required: true },
    linkedVisionId: { type: String, ref: 'Vision' },
    description: { type: String, default: '' },
    timeFrame: { type: String, default: '' },
    category: { type: String, default: '' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    status: { type: String, enum: ['Active', 'Paused', 'Archived', 'Completed'], default: 'Active' },
    targetDate: { type: Date },
    milestones: [String],
    progress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: false, timestamps: true }
);

goalSchema.index({ userId: 1, linkedVisionId: 1 });

export default mongoose.model<IGoal>('Goal', goalSchema);
