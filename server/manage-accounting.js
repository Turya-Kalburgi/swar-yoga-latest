"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Accounting_1 = require("./models/Accounting");
var MONGODB_URI = 'mongodb://admin:MySecurePass123@157.173.221.234:27017/?authSource=admin';
function connectDB() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, mongoose_1.default.connect(MONGODB_URI, {
                            serverSelectionTimeoutMS: 5000,
                            socketTimeoutMS: 45000,
                        })];
                case 1:
                    _a.sent();
                    console.log('✅ MongoDB Connected Successfully');
                    return [2 /*return*/, true];
                case 2:
                    error_1 = _a.sent();
                    console.error('❌ MongoDB Connection Failed:', error_1);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function clearOldData(adminId) {
    return __awaiter(this, void 0, void 0, function () {
        var transactionsBefore, categoriesBefore, transactionsResult, categoriesResult, transactionsAfter, categoriesAfter, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    console.log('\n📋 Clearing Old Accounting Data...\n');
                    return [4 /*yield*/, Accounting_1.Transaction.countDocuments({ adminId: adminId })];
                case 1:
                    transactionsBefore = _a.sent();
                    return [4 /*yield*/, Accounting_1.Category.countDocuments({ adminId: adminId })];
                case 2:
                    categoriesBefore = _a.sent();
                    console.log("\uD83D\uDCCA Records before deletion:");
                    console.log("   \u2022 Transactions: ".concat(transactionsBefore));
                    console.log("   \u2022 Categories: ".concat(categoriesBefore));
                    return [4 /*yield*/, Accounting_1.Transaction.deleteMany({ adminId: adminId })];
                case 3:
                    transactionsResult = _a.sent();
                    console.log("\n\u2705 Deleted ".concat(transactionsResult.deletedCount, " old transactions"));
                    return [4 /*yield*/, Accounting_1.Category.deleteMany({ adminId: adminId })];
                case 4:
                    categoriesResult = _a.sent();
                    console.log("\u2705 Deleted ".concat(categoriesResult.deletedCount, " old categories"));
                    return [4 /*yield*/, Accounting_1.Transaction.countDocuments({ adminId: adminId })];
                case 5:
                    transactionsAfter = _a.sent();
                    return [4 /*yield*/, Accounting_1.Category.countDocuments({ adminId: adminId })];
                case 6:
                    categoriesAfter = _a.sent();
                    console.log("\n\u2705 Cleanup Complete!");
                    console.log("\uD83D\uDCCA Records after deletion:");
                    console.log("   \u2022 Transactions: ".concat(transactionsAfter));
                    console.log("   \u2022 Categories: ".concat(categoriesAfter));
                    return [2 /*return*/, { transactionsAfter: transactionsAfter, categoriesAfter: categoriesAfter }];
                case 7:
                    error_2 = _a.sent();
                    console.error('❌ Error clearing data:', error_2);
                    throw error_2;
                case 8: return [2 /*return*/];
            }
        });
    });
}
function addSampleData(adminId) {
    return __awaiter(this, void 0, void 0, function () {
        var incomeCategories, expenseCategories, categories, createdCategories, _i, categories_1, cat, category, transactionsData, createdTransactions, _a, transactionsData_1, txn, transaction, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 9, , 10]);
                    console.log('\n📝 Adding Fresh Sample Data...\n');
                    incomeCategories = [
                        { name: 'Salary', type: 'income', color: '#10B981' },
                        { name: 'Freelance', type: 'income', color: '#3B82F6' },
                        { name: 'Investment', type: 'income', color: '#8B5CF6' },
                        { name: 'Gifts', type: 'income', color: '#F59E0B' }
                    ];
                    expenseCategories = [
                        { name: 'Food & Groceries', type: 'expense', color: '#EF4444' },
                        { name: 'Transportation', type: 'expense', color: '#F97316' },
                        { name: 'Utilities', type: 'expense', color: '#EC4899' },
                        { name: 'Entertainment', type: 'expense', color: '#06B6D4' },
                        { name: 'Health & Fitness', type: 'expense', color: '#6366F1' },
                        { name: 'Yoga Classes', type: 'expense', color: '#D946EF' }
                    ];
                    categories = __spreadArray(__spreadArray([], incomeCategories, true), expenseCategories, true);
                    createdCategories = [];
                    _i = 0, categories_1 = categories;
                    _b.label = 1;
                case 1:
                    if (!(_i < categories_1.length)) return [3 /*break*/, 4];
                    cat = categories_1[_i];
                    category = new Accounting_1.Category({
                        adminId: adminId,
                        name: cat.name,
                        type: cat.type,
                        color: cat.color,
                        description: "".concat(cat.type === 'income' ? 'Income from' : 'Expense for', " ").concat(cat.name)
                    });
                    return [4 /*yield*/, category.save()];
                case 2:
                    _b.sent();
                    createdCategories.push(category);
                    console.log("   \u2705 Created category: ".concat(cat.name));
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    transactionsData = [
                        {
                            adminId: adminId,
                            date: new Date(2025, 11, 1),
                            description: 'Monthly Salary',
                            amount: 5000,
                            type: 'income',
                            category: 'Salary',
                            paymentMethod: 'bank_transfer',
                            status: 'completed',
                            invoiceNumber: 'SAL-2025-12-001'
                        },
                        {
                            adminId: adminId,
                            date: new Date(2025, 11, 2),
                            description: 'Grocery Shopping',
                            amount: 250,
                            type: 'expense',
                            category: 'Food & Groceries',
                            paymentMethod: 'credit_card',
                            status: 'completed',
                            notes: 'Weekly grocery shopping at supermarket'
                        },
                        {
                            adminId: adminId,
                            date: new Date(2025, 11, 3),
                            description: 'Yoga Classes - Monthly Pack',
                            amount: 150,
                            type: 'expense',
                            category: 'Yoga Classes',
                            paymentMethod: 'cash',
                            status: 'completed',
                            notes: 'Monthly subscription for Swar Yoga classes'
                        },
                        {
                            adminId: adminId,
                            date: new Date(2025, 11, 5),
                            description: 'Freelance Project Payment',
                            amount: 1200,
                            type: 'income',
                            category: 'Freelance',
                            paymentMethod: 'bank_transfer',
                            status: 'completed',
                            invoiceNumber: 'FREELANCE-2025-12-001'
                        },
                        {
                            adminId: adminId,
                            date: new Date(2025, 11, 7),
                            description: 'Electric Bill Payment',
                            amount: 120,
                            type: 'expense',
                            category: 'Utilities',
                            paymentMethod: 'bank_transfer',
                            status: 'completed',
                            notes: 'Monthly electricity bill'
                        },
                        {
                            adminId: adminId,
                            date: new Date(2025, 11, 10),
                            description: 'Investment - Stock Purchase',
                            amount: 2000,
                            type: 'income',
                            category: 'Investment',
                            paymentMethod: 'bank_transfer',
                            status: 'completed',
                            notes: 'Dividend received from portfolio'
                        },
                        {
                            adminId: adminId,
                            date: new Date(2025, 11, 12),
                            description: 'Restaurant Dinner',
                            amount: 85,
                            type: 'expense',
                            category: 'Food & Groceries',
                            paymentMethod: 'credit_card',
                            status: 'completed',
                            notes: 'Dinner with family'
                        },
                        {
                            adminId: adminId,
                            date: new Date(2025, 11, 15),
                            description: 'Gym Membership',
                            amount: 50,
                            type: 'expense',
                            category: 'Health & Fitness',
                            paymentMethod: 'credit_card',
                            status: 'completed'
                        },
                        {
                            adminId: adminId,
                            date: new Date(2025, 11, 18),
                            description: 'Movie Tickets',
                            amount: 30,
                            type: 'expense',
                            category: 'Entertainment',
                            paymentMethod: 'credit_card',
                            status: 'completed'
                        },
                        {
                            adminId: adminId,
                            date: new Date(2025, 11, 20),
                            description: 'Car Fuel',
                            amount: 60,
                            type: 'expense',
                            category: 'Transportation',
                            paymentMethod: 'credit_card',
                            status: 'completed'
                        }
                    ];
                    createdTransactions = [];
                    _a = 0, transactionsData_1 = transactionsData;
                    _b.label = 5;
                case 5:
                    if (!(_a < transactionsData_1.length)) return [3 /*break*/, 8];
                    txn = transactionsData_1[_a];
                    transaction = new Accounting_1.Transaction(txn);
                    return [4 /*yield*/, transaction.save()];
                case 6:
                    _b.sent();
                    createdTransactions.push(transaction);
                    console.log("   \u2705 Created transaction: ".concat(txn.description, " - $").concat(txn.amount));
                    _b.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 5];
                case 8:
                    console.log("\n\u2705 Data Added Successfully!");
                    console.log("   \u2022 Categories: ".concat(createdCategories.length));
                    console.log("   \u2022 Transactions: ".concat(createdTransactions.length));
                    return [2 /*return*/, { categories: createdCategories, transactions: createdTransactions }];
                case 9:
                    error_3 = _b.sent();
                    console.error('❌ Error adding sample data:', error_3);
                    throw error_3;
                case 10: return [2 /*return*/];
            }
        });
    });
}
function verifyData(adminId) {
    return __awaiter(this, void 0, void 0, function () {
        var transactions, categories, totalIncome_1, totalExpense_1, typeBreakdown_1, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log('\n🔍 Verifying Data in MongoDB...\n');
                    return [4 /*yield*/, Accounting_1.Transaction.find({ adminId: adminId }).sort({ date: -1 })];
                case 1:
                    transactions = _a.sent();
                    return [4 /*yield*/, Accounting_1.Category.find({ adminId: adminId })];
                case 2:
                    categories = _a.sent();
                    console.log("\uD83D\uDCCA Database Status:");
                    console.log("   \u2022 Total Transactions: ".concat(transactions.length));
                    console.log("   \u2022 Total Categories: ".concat(categories.length));
                    totalIncome_1 = 0;
                    totalExpense_1 = 0;
                    typeBreakdown_1 = {};
                    transactions.forEach(function (tx) {
                        if (tx.type === 'income') {
                            totalIncome_1 += tx.amount;
                        }
                        else {
                            totalExpense_1 += tx.amount;
                        }
                        typeBreakdown_1[tx.category] = (typeBreakdown_1[tx.category] || 0) + tx.amount;
                    });
                    console.log("\n\uD83D\uDCB0 Financial Summary:");
                    console.log("   \u2022 Total Income: $".concat(totalIncome_1.toFixed(2)));
                    console.log("   \u2022 Total Expense: $".concat(totalExpense_1.toFixed(2)));
                    console.log("   \u2022 Net Balance: $".concat((totalIncome_1 - totalExpense_1).toFixed(2)));
                    console.log("\n\uD83D\uDCC8 Breakdown by Category:");
                    Object.entries(typeBreakdown_1).forEach(function (_a) {
                        var cat = _a[0], amount = _a[1];
                        console.log("   \u2022 ".concat(cat, ": $").concat(amount.toFixed(2)));
                    });
                    console.log("\n\uD83D\uDCCB Recent Transactions (Last 5):");
                    transactions.slice(0, 5).forEach(function (tx, idx) {
                        var date = new Date(tx.date).toLocaleDateString();
                        var icon = tx.type === 'income' ? '📈' : '📉';
                        console.log("   ".concat(idx + 1, ". ").concat(icon, " ").concat(tx.description, " - $").concat(tx.amount, " (").concat(date, ")"));
                    });
                    console.log("\n\u2705 Data Verification Complete!");
                    return [2 /*return*/, { transactions: transactions, categories: categories, totalIncome: totalIncome_1, totalExpense: totalExpense_1 }];
                case 3:
                    error_4 = _a.sent();
                    console.error('❌ Error verifying data:', error_4);
                    throw error_4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var adminId, connected, newData, verified, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adminId = 'admin_sadhak_001';
                    console.log('╔════════════════════════════════════════════════════════════╗');
                    console.log('║          SWAR YOGA ACCOUNTING DATA MANAGER                 ║');
                    console.log('║          Clean & Verify MongoDB Storage                    ║');
                    console.log('╚════════════════════════════════════════════════════════════╝');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 9]);
                    return [4 /*yield*/, connectDB()];
                case 2:
                    connected = _a.sent();
                    if (!connected) {
                        process.exit(1);
                    }
                    // Clear old data
                    return [4 /*yield*/, clearOldData(adminId)];
                case 3:
                    // Clear old data
                    _a.sent();
                    return [4 /*yield*/, addSampleData(adminId)];
                case 4:
                    newData = _a.sent();
                    return [4 /*yield*/, verifyData(adminId)];
                case 5:
                    verified = _a.sent();
                    console.log('\n╔════════════════════════════════════════════════════════════╗');
                    console.log('║                   ✅ ALL OPERATIONS SUCCESSFUL             ║');
                    console.log('║   Data is properly stored and verified in MongoDB Atlas   ║');
                    console.log('╚════════════════════════════════════════════════════════════╝\n');
                    return [4 /*yield*/, mongoose_1.default.disconnect()];
                case 6:
                    _a.sent();
                    process.exit(0);
                    return [3 /*break*/, 9];
                case 7:
                    error_5 = _a.sent();
                    console.error('❌ Fatal Error:', error_5);
                    return [4 /*yield*/, mongoose_1.default.disconnect()];
                case 8:
                    _a.sent();
                    process.exit(1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
main();
