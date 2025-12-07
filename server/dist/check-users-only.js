import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
async function checkUsersData() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/swar-yoga-db';
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB\n');
        const db = mongoose.connection.db;
        // Check Users collection
        const usersCollection = db.collection('users');
        const userCount = await usersCollection.countDocuments();
        console.log('📋 USERS COLLECTION');
        console.log('='.repeat(70));
        console.log(`Total Users: ${userCount}`);
        if (userCount > 0) {
            const users = await usersCollection.find({}).toArray();
            users.forEach((user, idx) => {
                console.log(`\n${idx + 1}. User:`);
                console.log(JSON.stringify(user, null, 2));
            });
        }
        else {
            console.log('❌ No users found in the users collection');
            console.log('\nℹ️  Note: Users need to sign up first to be created.');
            console.log('    The user account gets created when they register.');
        }
        // Check SignupData collection
        const signupCollection = db.collection('signupdatas');
        const signupCount = await signupCollection.countDocuments();
        console.log('\n' + '='.repeat(70));
        console.log('📋 SIGNUPDATA COLLECTION (User Registration Records)');
        console.log('='.repeat(70));
        console.log(`Total Signups: ${signupCount}`);
        if (signupCount > 0) {
            const signups = await signupCollection.find({}).toArray();
            signups.forEach((signup, idx) => {
                console.log(`\n${idx + 1}. Signup Record:`);
                console.log(JSON.stringify(signup, null, 2));
            });
        }
        else {
            console.log('❌ No signups found');
        }
        console.log('\n' + '='.repeat(70));
        await mongoose.disconnect();
    }
    catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}
checkUsersData();
//# sourceMappingURL=check-users-only.js.map