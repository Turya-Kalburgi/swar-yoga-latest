import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ITodo {
  _id?: string;
  userId: string;
  todoText: string;
  description?: string;
  completed?: boolean;
  dueDate?: Date;
  priority?: 'High' | 'Medium' | 'Low';
  category?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const todoSchema = new Schema<ITodo>(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    todoText: { type: String, required: true },
    description: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    category: { type: String, default: '' },
    tags: [String],
  },
  { _id: false, timestamps: true }
);

todoSchema.index({ userId: 1, completed: 1 });

export default mongoose.model<ITodo>('Todo', todoSchema);
