import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  contactId: string;
  name: string;
  email: string;
  countryCode?: string;
  whatsapp?: string;
  subject: string;
  message: string;
  status?: 'unread' | 'read' | 'replied' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string | null;
  response?: string;
  respondedAt?: Date | null;
  attachments?: string[];
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const contactSchema = new Schema<IContact>(
  {
    contactId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    countryCode: {
      type: String,
      default: '+91',
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied', 'closed'],
      default: 'unread',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    assignedTo: {
      type: String,
      default: null,
      index: true,
    },
    response: {
      type: String,
      default: '',
    },
    respondedAt: {
      type: Date,
      default: null,
    },
    attachments: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true, collection: 'contacts' }
);

contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1, priority: 1 });

export default mongoose.model<IContact>('Contact', contactSchema);
