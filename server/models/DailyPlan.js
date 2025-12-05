import mongoose from 'mongoose';

const dailyPlanSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  activity: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['work', 'health', 'personal', 'learning', 'other'], default: 'personal' },
  duration: { type: Number, default: 30 }, // in minutes
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  reminder: { type: Boolean, default: false },
  reminderTime: { type: String },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index for faster queries
dailyPlanSchema.index({ userId: 1, date: 1 });

export default mongoose.model('DailyPlan', dailyPlanSchema);
