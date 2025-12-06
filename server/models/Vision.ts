import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IVision {
  _id?: string;
  userId: string;
  visionStatement: string;
  timeFrame?: string;
  description?: string;
  category?: string;
  visualImageUrl?: string;
  affirmations?: string[];
  status?: 'Active' | 'Paused' | 'Archived';
  priority?: 'High' | 'Medium' | 'Low';
  createdAt?: Date;
  updatedAt?: Date;
}

const visionSchema = new Schema<IVision>(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    visionStatement: { type: String, required: true },
    timeFrame: { type: String, default: '' },
    description: { type: String, default: '' },
    category: { type: String, default: '' },
    visualImageUrl: { type: String, default: '' },
    affirmations: [String],
    status: { type: String, enum: ['Active', 'Paused', 'Archived'], default: 'Active' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  },
  { _id: false, timestamps: true }
);

visionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IVision>('Vision', visionSchema);
