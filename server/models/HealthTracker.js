import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const healthTrackerSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    date: { type: Date, required: true },
    waterIntake: { type: Number, default: 0 },
    mealsLogged: [String],
    exercise: { type: String, default: '' },
    exerciseDuration: { type: Number, default: 0 },
    mood: { type: String, enum: ['Excellent', 'Good', 'Average', 'Poor'], default: 'Average' },
    sleepHours: { type: Number, default: 0 },
    weight: { type: Number },
    bloodPressure: { type: String, default: '' },
    heartRate: { type: Number },
    symptoms: [String],
    medications: [String],
    notes: { type: String, default: '' },
    energyLevel: { type: Number, min: 1, max: 10, default: 5 },
    stressLevel: { type: Number, min: 1, max: 10, default: 5 },
    meditationMinutes: { type: Number, default: 0 },
    yogaMinutes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

healthTrackerSchema.index({ userId: 1, date: -1 });

const HealthTracker = mongoose.model('HealthTracker', healthTrackerSchema);

export default HealthTracker;
