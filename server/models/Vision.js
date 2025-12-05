import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const visionSchema = new mongoose.Schema(
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

visionSchema.index({ userId: 1, createdAt: -1 });

const Vision = mongoose.model('Vision', visionSchema);

export default Vision;
