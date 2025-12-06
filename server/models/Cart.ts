import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ICartItem {
  id?: number;
  workshopId: string;
  workshopTitle: string;
  instructor: string;
  price: number;
  currency?: string;
  quantity: number;
  image?: string | null;
  addedAt?: Date;
}

export interface ICart extends Document {
  userId: string;
  email: string;
  items: ICartItem[];
  totalItems?: number;
  totalPrice?: number;
  status: 'active' | 'purchased' | 'abandoned' | 'cleared';
  currencyBreakdown?: Map<string, { total: number; count: number; items: string[] }>;
  lastModified?: Date;
  createdAt?: Date;
  purchasedAt?: Date | null;
  abandonedAt?: Date | null;
  metadata?: {
    checkoutAttempts?: number;
    lastCheckoutDate?: Date | null;
    discountApplied?: number;
    couponCode?: string | null;
  };
}

const cartItemSchema = new Schema<ICartItem>(
  {
    workshopId: { type: String, required: true },
    workshopTitle: { type: String, required: true },
    instructor: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    quantity: { type: Number, default: 1, min: 1 },
    image: { type: String, default: null },
    addedAt: { type: Date, default: () => new Date() },
  },
  { _id: false }
);

const cartSchema = new Schema<ICart>(
  {
    userId: { type: String, required: true, index: true, ref: 'User' },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    items: [cartItemSchema],
    totalItems: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'purchased', 'abandoned', 'cleared'],
      default: 'active',
      index: true,
    },
    currencyBreakdown: {
      type: Map,
      of: { total: Number, count: Number, items: [Number] },
      default: new Map(),
    },
    lastModified: { type: Date, default: () => new Date() },
    purchasedAt: { type: Date, default: null },
    abandonedAt: { type: Date, default: null },
    metadata: {
      checkoutAttempts: { type: Number, default: 0 },
      lastCheckoutDate: { type: Date, default: null },
      discountApplied: { type: Number, default: 0 },
      couponCode: { type: String, default: null },
    },
  },
  { timestamps: true, collection: 'carts' }
);

cartSchema.index({ userId: 1, status: 1 });
cartSchema.index({ email: 1, status: 1 });
cartSchema.index({ status: 1, lastModified: -1 });
cartSchema.index({ createdAt: -1 });

export default mongoose.model<ICart>('Cart', cartSchema);
