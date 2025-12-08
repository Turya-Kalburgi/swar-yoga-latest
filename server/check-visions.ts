import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('✅ Connected to MongoDB');
    
    const Vision = mongoose.model('Vision', new mongoose.Schema({}, { strict: false }), 'visions');
    const visions = await Vision.find({ userId: 'swarsakshi9@gmail.com' });
    console.log(`📊 Found ${visions.length} visions for swarsakshi9@gmail.com`);
    console.log(JSON.stringify(visions, null, 2));
    
    await mongoose.disconnect();
  } catch (err: any) {
    console.error('❌ Error:', err.message);
  }
}

checkDB();
