import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IHealthTracker {
  _id?: string;
  userId: string;
  date: string;
  mood?: string;
  energy?: number;
  sleepHours?: number;
  water?: number;
  exercise?: number;
  dietQuality?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const healthTrackerSchema = new Schema<IHealthTracker>(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    mood: { type: String, default: '' },
    energy: { type: Number, default: 0, min: 0, max: 10 },
    sleepHours: { type: Number, default: 0 },
    water: { type: Number, default: 0 },
    exercise: { type: Number, default: 0 },
    dietQuality: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { _id: false, timestamps: true }
);

healthTrackerSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IHealthTracker>('HealthTracker', healthTrackerSchema);
