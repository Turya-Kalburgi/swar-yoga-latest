import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const todoSchema = new Schema({
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    todoText: { type: String, required: true },
    description: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    category: { type: String, default: '' },
    tags: [String],
}, { _id: false, timestamps: true });
todoSchema.index({ userId: 1, completed: 1 });
export default mongoose.model('Todo', todoSchema);
//# sourceMappingURL=Todo.js.map