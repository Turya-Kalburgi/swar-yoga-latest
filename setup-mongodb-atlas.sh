#!/bin/bash

# MongoDB Atlas Setup Helper Script
# This script helps you set up MongoDB Atlas and update your environment

echo "🚀 MongoDB Atlas Setup Helper"
echo "=============================="
echo ""

# Check if .env exists
if [ ! -f "server/.env" ]; then
    echo "❌ Error: server/.env file not found"
    echo "📝 Creating server/.env from server/.env.example"
    cp server/.env.example server/.env
    echo "✅ Created server/.env"
fi

echo ""
echo "📋 MongoDB Atlas Setup Steps:"
echo "1. Go to https://www.mongodb.com/cloud/atlas"
echo "2. Create a free account (if you don't have one)"
echo "3. Create a new project: 'Swar-Yoga'"
echo "4. Create a M0 (free) cluster"
echo "5. Create a database user with a strong password"
echo "6. Add your IP to the whitelist"
echo ""
echo "For development: Add 0.0.0.0/0"
echo "For production: Add your server's IP only"
echo ""

echo "📝 Enter your MongoDB Atlas connection details:"
echo ""

read -p "Enter MongoDB Atlas Connection String (mongodb+srv://...): " MONGODB_URI

if [ -z "$MONGODB_URI" ]; then
    echo "❌ Connection string is required!"
    exit 1
fi

# Check if connection string is valid
if [[ ! "$MONGODB_URI" =~ ^mongodb\+srv:// ]]; then
    echo "❌ Error: Connection string must start with 'mongodb+srv://'"
    exit 1
fi

# Update .env file
echo ""
echo "🔧 Updating server/.env..."

# Use sed to update MONGODB_URI
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|^MONGODB_URI=.*|MONGODB_URI=$MONGODB_URI|" server/.env
else
    # Linux
    sed -i "s|^MONGODB_URI=.*|MONGODB_URI=$MONGODB_URI|" server/.env
fi

echo "✅ Updated MONGODB_URI in server/.env"

echo ""
echo "📋 Current Configuration:"
echo "========================"
grep "MONGODB_URI" server/.env

echo ""
echo "🧪 Testing connection..."
echo ""

cd server

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create a simple test script
cat > test-connection.js << 'EOF'
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    console.log('🔗 Connecting to MongoDB Atlas...');
    console.log('URI (first 50 chars):', mongoURI?.substring(0, 50) + '...');
    
    await mongoose.connect(mongoURI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('✅ Host:', mongoose.connection.host);
    console.log('✅ Database:', mongoose.connection.name);
    console.log('✅ Collections:', mongoose.connection.collections);
    
    // List existing collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📚 Existing collections:');
    collections.forEach(col => console.log('  - ' + col.name));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();
EOF

# Run the test
node test-connection.js

# Clean up
rm test-connection.js

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Commit your changes: git add -A && git commit -m 'Setup MongoDB Atlas'"
echo "2. Start server: npm start (from server directory)"
echo "3. Test the app: http://localhost:5173"
echo "4. Add a vision and verify it appears in MongoDB Atlas"
echo ""
echo "🚀 For production deployment on Render:"
echo "1. Update environment variable MONGODB_URI in Render dashboard"
echo "2. Redeploy your backend service"
echo "3. Verify data appears in MongoDB Atlas console"
echo ""
