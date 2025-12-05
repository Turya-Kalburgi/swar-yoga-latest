import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const mywordSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    word: { type: String, required: true },
    affirmation: { type: String, required: true },
    meaning: { type: String, default: '' },
    linkedVisionId: { type: String, default: '' },
    linkedVisionTitle: { type: String, default: '' },
    linkedGoalId: { type: String, default: '' },
    linkedGoalTitle: { type: String, default: '' },
    linkedTaskId: { type: String, default: '' },
    linkedTaskTitle: { type: String, default: '' },
    category: { type: String, default: 'Personal Growth' },
    recitation: { type: String, default: '' },
    colorCode: { type: String, default: '#3B82F6' },
    frequency: { type: String, enum: ['Daily', 'Weekly', 'Occasional'], default: 'Daily' },
    lastRecitedAt: { type: Date },
    recitationCount: { type: Number, default: 0 },
    tags: [String],
    sourceReference: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

mywordSchema.index({ userId: 1, createdAt: -1 });
mywordSchema.index({ linkedVisionId: 1 });
mywordSchema.index({ linkedGoalId: 1 });
mywordSchema.index({ linkedTaskId: 1 });

const MyWord = mongoose.model('MyWord', mywordSchema);

export default MyWord;
