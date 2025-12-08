import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const dailyPlanSchema = new Schema({
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    activity: { type: String, required: true },
    category: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    completed: { type: Boolean, default: false },
}, { _id: false, timestamps: true });
dailyPlanSchema.index({ userId: 1, date: 1 });
export default mongoose.model('DailyPlan', dailyPlanSchema);
//# sourceMappingURL=DailyPlan.js.map