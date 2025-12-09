import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  enrollmentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  workshopId: mongoose.Types.ObjectId;
  
  // Payment Details
  amount: number;
  currency: 'INR' | 'NPR' | 'USD';
  
  // PayU Order Information
  orderId: string; // PayU Order ID (mihpayid)
  paymentId?: string; // PayU Payment ID
  transactionId?: string; // PayU txnid
  signature?: string; // PayU Hash signature
  
  // Payment Method & Gateway
  paymentMethod: 'payu' | 'paypal' | 'upi' | 'card' | 'netbanking' | 'wallet';
  paymentGateway: 'payu' | 'paypal' | 'external'; // Which gateway was used
  
  // QR Payment
  qrCodeUrl?: string; // For QR code based payments
  qrPaymentLink?: string; // UPI/Payment link for Nepal
  qrStatus?: 'pending' | 'scanned' | 'processed';
  
  // Status
  status: 'pending' | 'initiated' | 'completed' | 'failed' | 'refunded' | 'cancelled' | 'abandoned';
  statusChangedAt: Date;
  
  // Refund
  refundStatus?: 'none' | 'partial' | 'full';
  refundAmount?: number;
  refundId?: string;
  refundDate?: Date;
  refundReason?: string;
  
  // Metadata
  remarks?: string;
  failureReason?: string;
  receiptUrl?: string;
  
  // PayU Specific
  payuResponse?: Record<string, any>; // Full PayU response
  paypalTransactionId?: string; // PayPal transaction ID
  nepalPaymentRef?: string; // Nepal payment reference
  
  // Invoice
  invoiceNumber: string;
  invoiceGeneratedAt?: Date;
  invoiceUrl?: string;
  
  // Tax (if applicable)
  subtotal: number;
  tax?: number;
  discount?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
      index: true
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
    
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      enum: ['INR', 'NPR', 'USD'],
      required: true
    },
    
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    paymentId: String,
    transactionId: String,
    signature: String,
    
    paymentMethod: {
      type: String,
      enum: ['payu', 'paypal', 'upi', 'card', 'netbanking', 'wallet'],
      default: 'payu'
    },
    paymentGateway: {
      type: String,
      enum: ['payu', 'paypal', 'external'],
      default: 'payu'
    },
    
    qrCodeUrl: String,
    qrPaymentLink: String,
    qrStatus: {
      type: String,
      enum: ['pending', 'scanned', 'processed'],
      default: 'pending'
    },
    
    status: {
      type: String,
      enum: ['pending', 'initiated', 'completed', 'failed', 'refunded', 'cancelled', 'abandoned'],
      default: 'pending',
      index: true
    },
    statusChangedAt: {
      type: Date,
      default: Date.now
    },
    
    refundStatus: {
      type: String,
      enum: ['none', 'partial', 'full'],
      default: 'none'
    },
    refundAmount: Number,
    refundId: String,
    refundDate: Date,
    refundReason: String,
    
    remarks: String,
    failureReason: String,
    receiptUrl: String,
    
    payuResponse: mongoose.Schema.Types.Mixed,
    paypalTransactionId: String,
    nepalPaymentRef: String,
    
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true
    },
    invoiceGeneratedAt: Date,
    invoiceUrl: String,
    
    subtotal: {
      type: Number,
      required: true
    },
    tax: Number,
    discount: Number
  },
  { timestamps: true }
);

// Index for finding payments by status
PaymentSchema.index({ status: 1, createdAt: 1 });
PaymentSchema.index({ userId: 1, status: 1 });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
