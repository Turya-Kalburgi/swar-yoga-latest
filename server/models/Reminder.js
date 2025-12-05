import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const reminderSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    
    // What this reminder is for
    reminderType: { type: String, enum: ['Milestone', 'Task', 'Todo', 'Goal', 'Vision', 'Custom'], default: 'Custom' },
    relatedId: { type: String, default: '' }, // ID of Milestone/Task/Todo/Goal/Vision
    relatedTitle: { type: String, default: '' }, // Display name
    
    // Milestone connection
    milestoneId: { type: String, default: '' },
    milestoneDueDate: { type: Date, default: null },
    
    // Reminder details
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: '' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium', index: true },
    
    // Timing
    reminderDate: { type: Date, required: true, index: true },
    reminderTime: { type: String, default: '09:00' }, // HH:MM format
    
    // Recurrence
    isRecurring: { type: Boolean, default: false },
    recurrencePattern: { type: String, enum: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Yearly', 'Custom'], default: 'Daily' },
    recurrenceEnd: { type: Date, default: null },
    
    // Notification channels
    notificationChannels: {
      email: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false },
      browser: { type: Boolean, default: true }
    },
    
    // Status
    status: { type: String, enum: ['Active', 'Snoozed', 'Dismissed', 'Completed', 'Expired'], default: 'Active', index: true },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    snoozedUntil: { type: Date, default: null },
    
    // Tracking
    sentAt: { type: Date, default: null },
    clickedAt: { type: Date, default: null },
    dismissedAt: { type: Date, default: null },
    snoozeCount: { type: Number, default: 0 },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

// Indexes for performance
reminderSchema.index({ userId: 1, status: 1 });
reminderSchema.index({ userId: 1, reminderDate: 1 });
reminderSchema.index({ userId: 1, milestoneId: 1 });
reminderSchema.index({ reminderDate: 1, status: 1 });
reminderSchema.index({ userId: 1, isRecurring: 1 });

const Reminder = mongoose.model('Reminder', reminderSchema);

export default Reminder;
