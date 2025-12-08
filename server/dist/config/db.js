import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/swar-yoga-db';
        const conn = await mongoose.connect(mongoURI, {
            connectTimeoutMS: 10000,
            serverSelectionTimeoutMS: 10000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    }
    catch (error) {
        const err = error;
        console.error(`❌ MongoDB Connection Error: ${err.message}`);
        console.error('Make sure MongoDB is running: mongosh or brew services start mongodb-community');
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map