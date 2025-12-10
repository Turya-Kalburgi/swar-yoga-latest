import mongoose, { Schema } from 'mongoose';
const ChatMessageSchema = new Schema({
    workshopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workshop',
        required: true,
        index: true
    },
    enrollmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enrollment',
        required: true,
        index: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderRole: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    attachments: [
        {
            url: String,
            type: {
                type: String,
                enum: ['image', 'document', 'video', 'audio']
            },
            fileName: String
        }
    ],
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
    readAt: Date,
    replyToMessageId: mongoose.Schema.Types.ObjectId,
    reactions: [
        {
            emoji: String,
            userId: mongoose.Schema.Types.ObjectId
        }
    ],
    messageType: {
        type: String,
        enum: ['text', 'system', 'poll', 'announcement'],
        default: 'text'
    },
    threadId: String,
    isPinned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
// Index for finding messages by workshop and enrollment
ChatMessageSchema.index({ workshopId: 1, enrollmentId: 1, createdAt: -1 });
ChatMessageSchema.index({ isRead: 1 });
export default mongoose.model('ChatMessage', ChatMessageSchema);
//# sourceMappingURL=ChatMessage.js.map