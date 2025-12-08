import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const loginHistorySchema = new Schema({
    date: Date,
    device: String,
    browser: String,
    ipAddress: String,
}, { _id: false });
const preferencesSchema = new Schema({
    receiveEmails: { type: Boolean, default: true },
    receiveNotifications: { type: Boolean, default: true },
    twoFactorEnabled: { type: Boolean, default: false },
    theme: { type: String, default: 'light' },
}, { _id: false });
const metadataSchema = new Schema({
    device: String,
    browser: String,
    ipAddress: String,
    loginHistory: [loginHistorySchema],
}, { _id: false });
const userSchema = new Schema({
    _id: {
        type: String,
        default: () => uuidv4(),
    },
    userId: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: null,
    },
    countryCode: {
        type: String,
        default: '+91',
    },
    country: {
        type: String,
        default: null,
    },
    state: {
        type: String,
        default: null,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', null],
        default: null,
    },
    age: {
        type: Number,
        default: null,
    },
    profession: {
        type: String,
        default: null,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: null,
    },
    bio: {
        type: String,
        default: null,
    },
    accountStatus: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active',
        index: true,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    phoneVerified: {
        type: Boolean,
        default: false,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    loginCount: {
        type: Number,
        default: 0,
    },
    signupDate: {
        type: Date,
        default: () => new Date(),
        index: true,
    },
    lastUpdated: {
        type: Date,
        default: () => new Date(),
    },
    preferences: preferencesSchema,
    metadata: metadataSchema,
}, {
    timestamps: true,
    collection: 'users',
});
userSchema.index({ accountStatus: 1, signupDate: -1 });
userSchema.index({ lastLogin: -1 });
export default mongoose.model('User', userSchema);
//# sourceMappingURL=User.js.map