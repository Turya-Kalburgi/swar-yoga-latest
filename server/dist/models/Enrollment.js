import mongoose, { Schema } from 'mongoose';
const EnrollmentSchema = new Schema({
    workshopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workshop',
        required: true,
        index: true
    },
    batchId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    selectedMode: {
        type: String,
        enum: ['online', 'offline', 'residential', 'recorded'],
        required: true
    },
    selectedLanguage: {
        type: String,
        enum: ['hindi', 'marathi', 'english'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled', 'paused'],
        default: 'active',
        index: true
    },
    progressPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    certificateUrl: String,
    certificateIssueDate: Date,
    certificateNumber: String,
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    address: String,
    notes: String,
    cancelledAt: Date,
    cancelledReason: String
}, { timestamps: true });
// Index for finding user enrollments
EnrollmentSchema.index({ userId: 1, workshopId: 1 });
EnrollmentSchema.index({ status: 1 });
export default mongoose.model('Enrollment', EnrollmentSchema);
//# sourceMappingURL=Enrollment.js.map