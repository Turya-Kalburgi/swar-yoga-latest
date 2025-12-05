import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    },
    dueDate: {
      type: String,
      default: ''
    },
    dueTime: {
      type: String,
      default: ''
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    category: {
      type: String,
      default: 'Personal'
    },
    reminder: {
      type: Boolean,
      default: false
    },
    reminderTime: {
      type: String,
      default: ''
    },
    linkedTaskId: {
      type: String,
      default: ''
    },
    linkedTaskTitle: {
      type: String,
      default: ''
    },
    tags: [String],
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    completedAt: {
      type: Date,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Indexes for efficient querying
todoSchema.index({ userId: 1, createdAt: -1 });
todoSchema.index({ userId: 1, completed: 1 });
todoSchema.index({ userId: 1, dueDate: 1 });
todoSchema.index({ userId: 1, priority: 1 });

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
