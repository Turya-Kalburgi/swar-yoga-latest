import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IPageState {
  _id?: string;
  userId: string;
  pageName: string;
  pageData?: Record<string, any>;
  timestamp?: Date;
  lastVisited?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const pageStateSchema = new Schema<IPageState>(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: { type: String, required: true, index: true },
    pageName: { type: String, required: true },
    pageData: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: () => new Date() },
    lastVisited: { type: Date, default: () => new Date() },
  },
  { _id: false, timestamps: true }
);

pageStateSchema.index({ userId: 1, pageName: 1 });

export default mongoose.model<IPageState>('PageState', pageStateSchema);
