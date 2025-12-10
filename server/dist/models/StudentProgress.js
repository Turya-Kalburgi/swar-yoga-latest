import mongoose, { Schema } from 'mongoose';
const StudentProgressSchema = new Schema({
    enrollmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enrollment',
        required: true,
        index: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    workshopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workshop',
        required: true,
        index: true
    },
    sessionsCompleted: [
        {
            sessionId: Number,
            completedDate: Date,
            watchTime: { type: Number, default: 0 },
            isWatched: { type: Boolean, default: false },
            isCompleted: { type: Boolean, default: false },
            assessmentScore: Number
        }
    ],
    unlockedSessions: [Number],
    currentSessionNumber: {
        type: Number,
        default: 1
    },
    assignmentsSubmitted: [
        {
            assignmentId: mongoose.Schema.Types.ObjectId,
            submittedDate: Date,
            submissionUrl: String,
            status: {
                type: String,
                enum: ['submitted', 'reviewed', 'approved', 'rejected'],
                default: 'submitted'
            },
            adminReview: String,
            reviewedDate: Date
        }
    ],
    ratingSubmitted: {
        type: Boolean,
        default: false
    },
    ratingDate: Date,
    ratingScore: {
        type: Number,
        min: 1,
        max: 5
    },
    ratingComment: String,
    testimonySubmitted: {
        type: Boolean,
        default: false
    },
    testimonyDate: Date,
    testimonyText: String,
    testimonyVideoUrl: String,
    totalSessionsCompleted: {
        type: Number,
        default: 0
    },
    totalAssignmentsCompleted: {
        type: Number,
        default: 0
    },
    completionPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    estimatedCompletionDate: Date,
    lastActivityDate: {
        type: Date,
        default: Date.now
    },
    totalEngagementMinutes: {
        type: Number,
        default: 0
    },
    isCompleted: {
        type: Boolean,
        default: false,
        index: true
    },
    completionDate: Date
}, { timestamps: true });
// Index for finding progress by user and workshop
StudentProgressSchema.index({ userId: 1, workshopId: 1 });
export default mongoose.model('StudentProgress', StudentProgressSchema);
//# sourceMappingURL=StudentProgress.js.map