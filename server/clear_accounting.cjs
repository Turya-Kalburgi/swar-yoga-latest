const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://admin:MySecurePass123@157.173.221.234:27017/?authSource=admin';

const transactionSchema = new mongoose.Schema({
  _id: { type: String, default: () => require('uuid').v4() },
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

const categorySchema = new mongoose.Schema({
  _id: { type: String, default: () => require('uuid').v4() },
  adminId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  budget: { type: Number },
  description: { type: String, default: '' },
  color: { type: String, default: '#3B82F6' },
}, { _id: false, timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
const Category = mongoose.model('Category', categorySchema);

async function main() {
  try {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     SWAR YOGA ACCOUNTING - CLEAR & REFRESH DATA            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Connect
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    const adminId = 'admin_sadhak_001';

    // Get before stats
    const txBefore = await Transaction.countDocuments({ adminId });
    const catBefore = await Category.countDocuments({ adminId });
    console.log('📊 BEFORE CLEANUP:');
    console.log(`   • Transactions: ${txBefore}`);
    console.log(`   • Categories: ${catBefore}\n`);

    // Delete old data
    const txDel = await Transaction.deleteMany({ adminId });
    const catDel = await Category.deleteMany({ adminId });
    console.log('🗑️  DELETION COMPLETE:');
    console.log(`   • Deleted ${txDel.deletedCount} transactions`);
    console.log(`   • Deleted ${catDel.deletedCount} categories\n`);

    // Add sample categories
    const categories = [
      { adminId, name: 'Salary', type: 'income', color: '#10B981', description: 'Monthly salary' },
      { adminId, name: 'Freelance', type: 'income', color: '#3B82F6', description: 'Freelance work income' },
      { adminId, name: 'Investment', type: 'income', color: '#8B5CF6', description: 'Investment returns' },
      { adminId, name: 'Gifts', type: 'income', color: '#F59E0B', description: 'Gifts received' },
      { adminId, name: 'Food & Groceries', type: 'expense', color: '#EF4444', description: 'Food expenses' },
      { adminId, name: 'Transportation', type: 'expense', color: '#F97316', description: 'Transport costs' },
      { adminId, name: 'Utilities', type: 'expense', color: '#EC4899', description: 'Bills & utilities' },
      { adminId, name: 'Entertainment', type: 'expense', color: '#06B6D4', description: 'Entertainment' },
      { adminId, name: 'Health & Fitness', type: 'expense', color: '#6366F1', description: 'Health expenses' },
      { adminId, name: 'Yoga Classes', type: 'expense', color: '#D946EF', description: 'Swar Yoga classes' }
    ];

    console.log('📝 ADDING CATEGORIES:');
    for (const cat of categories) {
      await Category.create(cat);
      console.log(`   ✅ ${cat.name} (${cat.type})`);
    }

    console.log('\n📝 ADDING TRANSACTIONS:');
    
    const transactions = [
      { adminId, date: new Date(2025, 11, 1), description: 'Monthly Salary', amount: 5000, type: 'income', category: 'Salary', paymentMethod: 'bank_transfer', status: 'completed', invoiceNumber: 'SAL-2025-12-001' },
      { adminId, date: new Date(2025, 11, 2), description: 'Grocery Shopping', amount: 250, type: 'expense', category: 'Food & Groceries', paymentMethod: 'credit_card', status: 'completed', notes: 'Weekly shopping' },
      { adminId, date: new Date(2025, 11, 3), description: 'Yoga Classes - Monthly Pack', amount: 150, type: 'expense', category: 'Yoga Classes', paymentMethod: 'cash', status: 'completed', notes: 'Monthly Swar Yoga' },
      { adminId, date: new Date(2025, 11, 5), description: 'Freelance Project Payment', amount: 1200, type: 'income', category: 'Freelance', paymentMethod: 'bank_transfer', status: 'completed', invoiceNumber: 'FL-2025-12-001' },
      { adminId, date: new Date(2025, 11, 7), description: 'Electric Bill', amount: 120, type: 'expense', category: 'Utilities', paymentMethod: 'bank_transfer', status: 'completed', notes: 'Monthly electricity' },
      { adminId, date: new Date(2025, 11, 10), description: 'Investment Dividend', amount: 2000, type: 'income', category: 'Investment', paymentMethod: 'bank_transfer', status: 'completed', notes: 'Portfolio returns' },
      { adminId, date: new Date(2025, 11, 12), description: 'Restaurant Dinner', amount: 85, type: 'expense', category: 'Food & Groceries', paymentMethod: 'credit_card', status: 'completed', notes: 'Family dinner' },
      { adminId, date: new Date(2025, 11, 15), description: 'Gym Membership', amount: 50, type: 'expense', category: 'Health & Fitness', paymentMethod: 'credit_card', status: 'completed' },
      { adminId, date: new Date(2025, 11, 18), description: 'Movie Tickets', amount: 30, type: 'expense', category: 'Entertainment', paymentMethod: 'credit_card', status: 'completed' },
      { adminId, date: new Date(2025, 11, 20), description: 'Car Fuel', amount: 60, type: 'expense', category: 'Transportation', paymentMethod: 'credit_card', status: 'completed' }
    ];

    for (const txn of transactions) {
      await Transaction.create(txn);
      console.log(`   ✅ ${txn.description} - $${txn.amount}`);
    }

    // Verify final data
    console.log('\n🔍 VERIFYING DATA:');
    
    const allTransactions = await Transaction.find({ adminId }).sort({ date: -1 });
    const allCategories = await Category.find({ adminId });

    let income = 0, expense = 0;
    allTransactions.forEach(tx => {
      if (tx.type === 'income') income += tx.amount;
      else expense += tx.amount;
    });

    console.log(`   • Total Transactions: ${allTransactions.length}`);
    console.log(`   • Total Categories: ${allCategories.length}`);
    console.log(`   • Total Income: $${income.toFixed(2)}`);
    console.log(`   • Total Expense: $${expense.toFixed(2)}`);
    console.log(`   • Net Balance: $${(income - expense).toFixed(2)}`);

    console.log('\n📊 RECENT TRANSACTIONS (Last 5):');
    allTransactions.slice(0, 5).forEach((tx, i) => {
      const date = new Date(tx.date).toLocaleDateString();
      const icon = tx.type === 'income' ? '📈' : '📉';
      console.log(`   ${i+1}. ${icon} ${tx.description} - $${tx.amount} (${date})`);
    });

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║        ✅ ACCOUNTING DATA CLEANED & VERIFIED! ✅           ║');
    console.log('║        All data safely stored in MongoDB Atlas             ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

main();
