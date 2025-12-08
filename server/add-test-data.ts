import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function addTestData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('✅ Connected to MongoDB');
    
    // Create Vision document using direct insertion
    const visionCollection = mongoose.connection.collection('visions');
    
    const testVision = {
      userId: 'swarsakshi9@gmail.com',
      title: 'Vision-1 TEST',
      description: 'This is test vision data for swarsakshi9@gmail.com',
      priority: 'High',
      status: 'In Progress',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const visionResult = await visionCollection.insertOne(testVision as any);
    console.log('✅ Vision Created:', visionResult.insertedId);
    
    // Verify it was saved
    const visions = await visionCollection.find({ userId: 'swarsakshi9@gmail.com' }).toArray();
    console.log(`📊 Found ${visions.length} visions after creation`);
    
    // Also test Goals
    const goalCollection = mongoose.connection.collection('goals');
    
    const testGoal = {
      userId: 'swarsakshi9@gmail.com',
      title: 'Goal-1 TEST',
      description: 'This is test goal data',
      priority: 'Medium',
      status: 'Not Started',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const goalResult = await goalCollection.insertOne(testGoal as any);
    console.log('✅ Goal Created:', goalResult.insertedId);
    
    // Verify goal
    const goals = await goalCollection.find({ userId: 'swarsakshi9@gmail.com' }).toArray();
    console.log(`📊 Found ${goals.length} goals after creation`);
    
    await mongoose.disconnect();
    console.log('✅ Test data added successfully!');
  } catch (err: any) {
    console.error('❌ Error:', err.message);
  }
}

addTestData();
