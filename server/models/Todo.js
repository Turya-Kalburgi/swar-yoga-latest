import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const todoSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    particulars: { type: String, required: true },
    linkedTaskId: { type: String, default: '' },
    linkedTaskTitle: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    time: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    category: { type: String, default: 'General' },
    tags: [String],
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

todoSchema.index({ userId: 1, createdAt: -1 });
todoSchema.index({ linkedTaskId: 1 });
todoSchema.index({ date: 1 });

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
