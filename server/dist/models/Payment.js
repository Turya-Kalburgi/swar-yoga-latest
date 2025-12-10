import mongoose, { Schema } from 'mongoose';
const PaymentSchema = new Schema({
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
}, { timestamps: true });
// Index for finding payments by status
PaymentSchema.index({ status: 1, createdAt: 1 });
PaymentSchema.index({ userId: 1, status: 1 });
export default mongoose.model('Payment', PaymentSchema);
//# sourceMappingURL=Payment.js.map