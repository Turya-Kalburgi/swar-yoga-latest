import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const signinDataSchema = new Schema({
    _id: { type: String, default: () => uuidv4() },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    name: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['success', 'failed'], default: 'failed' },
    ip: { type: String, default: 'unknown' },
    device: { type: String, default: 'unknown' },
}, { _id: false, timestamps: true });
signinDataSchema.index({ email: 1, timestamp: -1 });
export default mongoose.model('SigninData', signinDataSchema);
//# sourceMappingURL=SigninData.js.map