import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const goalSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    goalTitle: { type: String, required: true },
    goalStatement: { type: String, default: '' },
    category: { type: String, default: '' },
    linkedVisionId: { type: String, default: '' },
    linkedVisionTitle: { type: String, default: '' },
    startDate: { type: Date, default: Date.now },
    targetDate: { type: Date },
    timeFrame: { type: String, default: '' },
    status: { type: String, enum: ['Not Started', 'In Progress', 'On Hold', 'Completed', 'Cancelled'], default: 'Not Started' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    progressPercentage: { type: Number, min: 0, max: 100, default: 0 },
    description: { type: String, default: '' },
    milestones: [String],
    resources: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

goalSchema.index({ userId: 1, createdAt: -1 });
goalSchema.index({ linkedVisionId: 1 });

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
