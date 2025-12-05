import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const taskSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    particulars: { type: String, default: '' },
    description: { type: String, default: '' },
    linkedGoalId: { type: String, default: '' },
    linkedGoalTitle: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'On Hold'], default: 'Pending' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    category: { type: String, default: '' },
    startDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    completedDate: { type: Date },
    recurrence: { type: String, enum: ['None', 'Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'], default: 'None' },
    customRecurrenceDays: { type: Number, default: 1 },
    reminder: { type: Boolean, default: false },
    reminderTime: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    subtasks: [
      {
        id: String,
        title: String,
        completed: Boolean
      }
    ],
    tags: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ linkedGoalId: 1 });
taskSchema.index({ status: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
