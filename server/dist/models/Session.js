import mongoose, { Schema } from 'mongoose';
const SessionSchema = new Schema({
    workshopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workshop',
        required: true,
        index: true
    },
    sessionNumber: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    duration: {
        type: Number,
        required: true
    },
    videoUrl: String,
    s3Key: String,
    youtubeId: String,
    thumbnailUrl: String,
    unlockRules: {
        requiresPreviousCompletion: {
            type: Boolean,
            default: true
        },
        timeGapAfterPreviousHours: {
            type: Number,
            default: 24
        },
        requiresAssignment: {
            type: Boolean,
            default: false
        },
        assignmentId: mongoose.Schema.Types.ObjectId,
        requiresRating: {
            type: Boolean,
            default: false
        },
        requiresTestimony: {
            type: Boolean,
            default: false
        }
    },
    transcript: String,
    resources: [
        {
            title: String,
            url: String,
            type: {
                type: String,
                enum: ['pdf', 'document', 'link', 'image']
            }
        }
    ],
    isPublished: {
        type: Boolean,
        default: false,
        index: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });
// Index for finding sessions by workshop
SessionSchema.index({ workshopId: 1, sessionNumber: 1 });
export default mongoose.model('Session', SessionSchema);
//# sourceMappingURL=Session.js.map