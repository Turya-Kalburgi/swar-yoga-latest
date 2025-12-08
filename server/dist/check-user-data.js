import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
async function checkUserData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('Connected to MongoDB\n');
        const userId = 'swarsakshi9@gmail.com';
        // Check all collections for this user
        const db = mongoose.connection.db;
        console.log(`📊 CHECKING DATA FOR: ${userId}\n`);
        console.log('═'.repeat(80) + '\n');
        // Check each collection
        const collections = [
            'visions',
            'goals',
            'tasks',
            'todos',
            'health',
            'reminders',
            'dailyplans',
            'milestones',
            'users',
            'signupdata',
            'signindata',
            'contacts'
        ];
        for (const collectionName of collections) {
            try {
                const collection = db.collection(collectionName);
                const count = await collection.countDocuments({ userId });
                const documents = await collection.find({ userId }).limit(3).toArray();
                console.log(`📋 ${collectionName.toUpperCase()}`);
                console.log(`   Count: ${count}`);
                if (documents.length > 0) {
                    console.log(`   Sample:`, JSON.stringify(documents[0], null, 2));
                }
                console.log('');
            }
            catch (err) {
                console.log(`   Error checking ${collectionName}`);
            }
        }
        await mongoose.connection.close();
    }
    catch (error) {
        console.error('Error:', error);
    }
}
checkUserData();
//# sourceMappingURL=check-user-data.js.map