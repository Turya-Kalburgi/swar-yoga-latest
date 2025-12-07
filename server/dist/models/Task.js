import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const taskSchema = new Schema({
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    taskTitle: { type: String, required: true },
    linkedGoalId: { type: String, ref: 'Goal' },
    description: { type: String, default: '' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'On Hold'], default: 'Pending' },
    dueDate: { type: Date },
    timeRequired: { type: Number, default: 0 },
    category: { type: String, default: '' },
    subtasks: [String],
    attachments: [String],
}, { _id: false, timestamps: true });
taskSchema.index({ userId: 1, linkedGoalId: 1, status: 1 });
export default mongoose.model('Task', taskSchema);
//# sourceMappingURL=Task.js.map