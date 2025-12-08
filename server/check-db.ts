import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/swar-yoga-db';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    
    console.log('📊 CHECKING ALL COLLECTIONS FOR DATA:\n');
    console.log('=' .repeat(70));
    
    for (const collection of collections) {
      const coll = db.collection(collection.name);
      const count = await coll.countDocuments();
      
      if (count > 0) {
        console.log(`\n📋 ${collection.name.toUpperCase()} (${count} documents)`);
        console.log('-' .repeat(70));
        const sample = await coll.findOne();
        console.log(JSON.stringify(sample, null, 2));
      }
    }

    console.log('\n' + '=' .repeat(70));
    console.log('✅ Scan complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

checkDatabase();
