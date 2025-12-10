import mongoose, { Schema } from 'mongoose';
const AssignmentSchema = new Schema({
    workshopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workshop',
        required: true,
        index: true
    },
    sessionId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    submissionDeadlineDays: {
        type: Number,
        default: 7
    },
    allowLateSubmission: {
        type: Boolean,
        default: true
    },
    latePenaltyPercentage: {
        type: Number,
        default: 0
    },
    totalPoints: {
        type: Number,
        default: 100
    },
    passingPercentage: {
        type: Number,
        default: 60
    },
    attachments: [
        {
            title: String,
            url: String,
            type: {
                type: String,
                enum: ['pdf', 'document', 'image', 'video']
            }
        }
    ],
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    totalSubmissions: {
        type: Number,
        default: 0
    },
    averageScore: {
        type: Number,
        default: 0
    },
    submissionRate: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });
// Index for finding assignments by workshop and session
AssignmentSchema.index({ workshopId: 1, sessionId: 1 });
export default mongoose.model('Assignment', AssignmentSchema);
//# sourceMappingURL=Assignment.js.map