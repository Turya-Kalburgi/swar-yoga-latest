import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const cartItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  workshopId: { type: Number, required: true },
  workshopTitle: { type: String, required: true },
  instructor: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  quantity: { type: Number, default: 1, min: 1 },
  image: { type: String, default: null },
  addedAt: { type: Date, default: () => new Date() }
}, { _id: false });

const cartSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4(), primary: true },
    userId: { type: String, required: true, index: true, ref: 'User' },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    items: [cartItemSchema],
    totalItems: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'purchased', 'abandoned', 'cleared'], default: 'active', index: true },
    currencyBreakdown: { type: Map, of: { total: Number, count: Number, items: [Number] }, default: new Map() },
    lastModified: { type: Date, default: () => new Date() },
    createdAt: { type: Date, default: () => new Date(), index: true },
    purchasedAt: { type: Date, default: null },
    abandonedAt: { type: Date, default: null },
    metadata: {
      checkoutAttempts: { type: Number, default: 0 },
      lastCheckoutDate: { type: Date, default: null },
      discountApplied: { type: Number, default: 0 },
      couponCode: { type: String, default: null }
    }
  },
  { timestamps: true, collection: 'carts' }
);

cartSchema.index({ userId: 1, status: 1 });
cartSchema.index({ email: 1, status: 1 });
cartSchema.index({ status: 1, lastModified: -1 });
cartSchema.index({ createdAt: -1 });

cartSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const breakdown = {};
    this.items.forEach(item => {
      if (!breakdown[item.currency]) {
        breakdown[item.currency] = { total: 0, count: 0, items: [] };
      }
      breakdown[item.currency].total += item.price * item.quantity;
      breakdown[item.currency].count += item.quantity;
      breakdown[item.currency].items.push(item.workshopId);
    });
    this.currencyBreakdown = breakdown;
  } else {
    this.totalItems = 0;
    this.totalPrice = 0;
    this.currencyBreakdown = {};
  }
  this.lastModified = new Date();
  next();
});

export default mongoose.model('Cart', cartSchema);
