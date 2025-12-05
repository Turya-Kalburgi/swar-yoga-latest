import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    contactId: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    countryCode: {
      type: String,
      default: '+91'
    },
    whatsapp: {
      type: String,
      trim: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied', 'closed'],
      default: 'unread',
      index: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    replyMessage: {
      type: String,
      default: null
    },
    assignedTo: {
      type: String,
      default: null
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    repliedAt: {
      type: Date,
      default: null
    },
    metadata: {
      device: String,
      browser: String,
      location: String,
      tags: [String]
    }
  },
  {
    timestamps: true,
    collection: 'contacts'
  }
);

// Indexes for performance
contactSchema.index({ status: 1, submittedAt: -1 });
contactSchema.index({ email: 1, submittedAt: -1 });
contactSchema.index({ priority: 1, status: 1 });

export default mongoose.model('Contact', contactSchema);
