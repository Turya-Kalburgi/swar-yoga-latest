import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const transactionSchema = new Schema({
    _id: { type: String, default: () => uuidv4() },
    adminId: { type: String, required: true, index: true },
    date: { type: Date, required: true, index: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    paymentMethod: { type: String, default: 'cash' },
    status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
    notes: { type: String, default: '' },
    invoiceNumber: { type: String },
    attachments: [String],
}, { _id: false, timestamps: true });
const categorySchema = new Schema({
    _id: { type: String, default: () => uuidv4() },
    adminId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    budget: { type: Number },
    description: { type: String, default: '' },
    color: { type: String, default: '#3B82F6' },
}, { _id: false, timestamps: true });
transactionSchema.index({ adminId: 1, date: -1 });
transactionSchema.index({ adminId: 1, type: 1 });
categorySchema.index({ adminId: 1, type: 1 });
export const Transaction = mongoose.model('Transaction', transactionSchema);
export const Category = mongoose.model('Category', categorySchema);
//# sourceMappingURL=Accounting.js.map