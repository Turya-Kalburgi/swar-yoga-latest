"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = exports.Transaction = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var uuid_1 = require("uuid");
var transactionSchema = new mongoose_1.Schema({
    _id: { type: String, default: function () { return (0, uuid_1.v4)(); } },
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
var categorySchema = new mongoose_1.Schema({
    _id: { type: String, default: function () { return (0, uuid_1.v4)(); } },
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
exports.Transaction = mongoose_1.default.model('Transaction', transactionSchema);
exports.Category = mongoose_1.default.model('Category', categorySchema);
