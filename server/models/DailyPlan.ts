import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IDailyPlan {
  _id?: string;
  userId: string;
  date: string;
  time: string;
  activity: string;
  category?: string;
  duration?: number;
  notes?: string;
  completed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const dailyPlanSchema = new Schema<IDailyPlan>(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    activity: { type: String, required: true },
    category: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    completed: { type: Boolean, default: false },
  },
  { _id: false, timestamps: true }
);

dailyPlanSchema.index({ userId: 1, date: 1 });

export default mongoose.model<IDailyPlan>('DailyPlan', dailyPlanSchema);
