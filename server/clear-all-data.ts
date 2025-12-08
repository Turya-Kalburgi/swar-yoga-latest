import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function clearAllData() {
  try {
    // Use the MongoDB URI with proper connection
    const mongoURI = "mongodb://admin:MySecurePass123@157.173.221.234:27017/?authSource=admin";
    
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
    
    const collections = [
      'users',
      'visions',
      'goals',
      'tasks',
      'todos',
      'mywords',
      'healthtrackers',
      'workshops',
      'contacts',
      'carts',
      'checkouts',
      'transactions',
      'signupdatas',
      'signindatas',
      'milestones',
      'reminders',
      'dailyplans',
      'admins'
    ];
    
    console.log('\n🗑️  Clearing collections...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    for (const collectionName of collections) {
      try {
        const collection = mongoose.connection.collection(collectionName);
        const count = await collection.countDocuments();
        
        if (count > 0) {
          const result = await collection.deleteMany({});
          console.log(`✅ ${collectionName}: Deleted ${result.deletedCount} documents`);
        } else {
          console.log(`⏭️  ${collectionName}: Already empty (0 documents)`);
        }
      } catch (err) {
        console.log(`⚠️  ${collectionName}: Collection doesn't exist or error occurred`);
      }
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 Verifying database is clean...');
    
    let totalDocuments = 0;
    for (const collectionName of collections) {
      try {
        const collection = mongoose.connection.collection(collectionName);
        const count = await collection.countDocuments();
        if (count > 0) {
          console.log(`⚠️  ${collectionName}: ${count} documents remaining`);
          totalDocuments += count;
        }
      } catch (err) {
        // Ignore
      }
    }
    
    if (totalDocuments === 0) {
      console.log('✅ Database is now completely clean!');
      console.log('📝 Ready for real user data only');
    }
    
    console.log('\n✨ Cleanup complete!');
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    const err = error as Error;
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

clearAllData();
