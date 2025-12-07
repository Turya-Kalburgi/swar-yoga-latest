import mongoose, { Schema } from 'mongoose';
const workshopSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    instructor: {
        type: String,
        required: true,
        trim: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    duration: {
        type: String,
        trim: true,
    },
    startTime: {
        type: String,
        default: '09:00',
    },
    endTime: {
        type: String,
        default: '17:00',
    },
    priceINR: {
        type: Number,
        default: 0,
    },
    priceNPR: {
        type: Number,
        default: 0,
    },
    priceUSD: {
        type: Number,
        default: 0,
    },
    maxParticipants: {
        type: Number,
        default: 50,
    },
    category: {
        type: String,
        trim: true,
    },
    mode: {
        type: String,
        enum: ['Online', 'Offline', 'Hybrid'],
        default: 'Online',
    },
    language: {
        type: String,
        default: 'English',
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
        default: 'All Levels',
    },
    location: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        default: '',
    },
    youtubeId: {
        type: String,
        default: '',
    },
    paymentLinkINR: {
        type: String,
        default: '',
    },
    paymentLinkNPR: {
        type: String,
        default: '',
    },
    paymentLinkUSD: {
        type: String,
        default: '',
    },
    whatsappGroupLink: {
        type: String,
        default: '',
    },
    prerequisites: {
        type: String,
        default: '',
    },
    learningOutcomes: {
        type: String,
        default: '',
    },
    includedItems: {
        type: String,
        default: '',
    },
    remarks: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
    enrolledCount: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
}, {
    timestamps: true,
});
// Create index for better query performance
workshopSchema.index({ title: 1 });
workshopSchema.index({ category: 1 });
workshopSchema.index({ isPublic: 1 });
workshopSchema.index({ startDate: 1 });
export default mongoose.model('Workshop', workshopSchema);
//# sourceMappingURL=Workshop.js.map