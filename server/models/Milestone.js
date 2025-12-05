import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const milestoneSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    visionId: { type: String, default: '' },
    visionTitle: { type: String, default: '' },
    goalId: { type: String, required: true, index: true },
    goalTitle: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: '' },
    
    // Timeline
    startDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true, index: true },
    completionDate: { type: Date, default: null },
    
    // Status and Progress
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'On Hold', 'Cancelled'], default: 'Pending', index: true },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    
    // Related Items
    linkedTasks: [{ type: String }], // Array of Task IDs
    linkedTodos: [{ type: String }], // Array of Todo IDs
    linkedReminders: [{ type: String }], // Array of Reminder IDs
    
    // Metrics
    tasksCount: { type: Number, default: 0 },
    todosCount: { type: Number, default: 0 },
    completedTasksCount: { type: Number, default: 0 },
    completedTodosCount: { type: Number, default: 0 },
    
    // Additional Info
    keyResults: [String], // Key results for this milestone
    deliverables: [String], // What will be delivered
    risks: [String], // Potential risks
    notes: { type: String, default: '' },
    
    // Metadata
    estimatedHours: { type: Number, default: 0 },
    actualHours: { type: Number, default: 0 },
    owner: { type: String, default: '' }, // Who is responsible
    collaborators: [String], // Team members involved
    
    // Tracking
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
    archivedAt: { type: Date, default: null }
  },
  { _id: false }
);

// Indexes for better query performance
milestoneSchema.index({ userId: 1, status: 1 });
milestoneSchema.index({ userId: 1, dueDate: 1 });
milestoneSchema.index({ userId: 1, goalId: 1 });
milestoneSchema.index({ userId: 1, visionId: 1 });
milestoneSchema.index({ status: 1, dueDate: 1 });

// Pre-save hook to update timestamps
milestoneSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Milestone = mongoose.model('Milestone', milestoneSchema);

export default Milestone;
