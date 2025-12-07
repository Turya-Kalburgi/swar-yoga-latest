import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const mywordSchema = new Schema({
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    wordText: { type: String, required: true },
    affirmationType: { type: String, default: '' },
    category: { type: String, default: '' },
    source: { type: String, default: '' },
    frequency: { type: String, enum: ['Daily', 'Weekly', 'Monthly'], default: 'Daily' },
    lastRecited: { type: Date },
    recitationCount: { type: Number, default: 0 },
    impact: { type: String, default: '' },
    tags: [String],
}, { _id: false, timestamps: true });
mywordSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.model('MyWord', mywordSchema);
//# sourceMappingURL=MyWord.js.map