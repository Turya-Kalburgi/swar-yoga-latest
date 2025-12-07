import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const signupDataSchema = new Schema({
    _id: { type: String, default: () => uuidv4() },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: null },
    countryCode: { type: String, default: '+91' },
    country: { type: String, default: null },
    state: { type: String, default: null },
    gender: { type: String, enum: ['Male', 'Female', 'Other', null], default: null },
    age: { type: Number, default: null },
    profession: { type: String, default: null },
    registrationDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive', 'blocked'], default: 'active' },
    source: { type: String, default: 'signup' },
}, { _id: false, timestamps: true });
signupDataSchema.index({ email: 1, registrationDate: -1 });
export default mongoose.model('SignupData', signupDataSchema);
//# sourceMappingURL=SignupData.js.map