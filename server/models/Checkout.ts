import mongoose, { Schema, Document } from 'mongoose';

export interface ICheckoutItem {
  workshopId: string;
  workshopTitle: string;
  instructor: string;
  price: number;
  quantity: number;
  currency: string;
}

export interface ICheckout extends Document {
  userId: string;
  email: string;
  orderId: string;
  items: ICheckoutItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  shippingAddress?: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  createdAt?: Date;
  updatedAt?: Date;
  paidAt?: Date | null;
  cancelledAt?: Date | null;
}

const checkoutItemSchema = new Schema<ICheckoutItem>(
  {
    workshopId: { type: String, required: true },
    workshopTitle: { type: String, required: true },
    instructor: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    currency: { type: String, default: 'INR' },
  },
  { _id: false }
);

const addressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const checkoutSchema = new Schema<ICheckout>(
  {
    userId: { type: String, required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    orderId: { type: String, required: true, unique: true, index: true },
    items: [checkoutItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    shippingAddress: addressSchema,
    billingAddress: addressSchema,
    notes: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled', 'refunded'],
      default: 'pending',
      index: true,
    },
    paidAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true, collection: 'checkouts' }
);

checkoutSchema.index({ userId: 1, createdAt: -1 });
checkoutSchema.index({ orderId: 1, paymentStatus: 1 });
checkoutSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<ICheckout>('Checkout', checkoutSchema);
