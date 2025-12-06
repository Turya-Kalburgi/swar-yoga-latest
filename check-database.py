#!/usr/bin/env python3
"""
Check MongoDB Atlas database for saved data
"""

import os
import sys
from pymongo import MongoClient
from datetime import datetime

# MongoDB connection string
MONGO_URI = "mongodb+srv://admin:admin%402024@swaryogadb.dheqmu1.mongodb.net/swar-yoga-db?retryWrites=true&w=majority"

print("\n" + "="*70)
print("🔍 CHECKING MONGODB ATLAS DATABASE FOR DATA")
print("="*70 + "\n")

try:
    print("🔗 Connecting to MongoDB Atlas...")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    
    # Verify connection
    client.admin.command('ping')
    print("✅ Connected to MongoDB Atlas!\n")
    
    # Get database
    db = client['swar-yoga-db']
    
    print("📊 DATABASE COLLECTIONS AND DOCUMENT COUNT:")
    print("-" * 70)
    
    collections = db.list_collection_names()
    
    if not collections:
        print("❌ No collections found in database")
    else:
        total_docs = 0
        for collection_name in sorted(collections):
            collection = db[collection_name]
            count = collection.count_documents({})
            total_docs += count
            
            status = "✅" if count > 0 else "⚠️ "
            print(f"{status} {collection_name:20} : {count:6} documents")
            
            # Show sample document if exists
            if count > 0:
                sample = collection.find_one()
                if '_id' in sample:
                    print(f"   └─ Sample ID: {sample['_id']}")
                if 'email' in sample:
                    print(f"   └─ Email: {sample['email']}")
                if 'title' in sample:
                    print(f"   └─ Title: {sample['title']}")
                if 'name' in sample:
                    print(f"   └─ Name: {sample['name']}")
        
        print("-" * 70)
        print(f"\n📈 TOTAL DOCUMENTS IN DATABASE: {total_docs}\n")
        
        # Show detailed stats
        print("📋 DETAILED COLLECTION BREAKDOWN:")
        print("-" * 70)
        
        collections_with_data = {}
        for collection_name in sorted(collections):
            collection = db[collection_name]
            count = collection.count_documents({})
            if count > 0:
                collections_with_data[collection_name] = count
        
        if collections_with_data:
            for coll, count in collections_with_data.items():
                print(f"✅ {coll}")
                print(f"   Documents: {count}")
                collection = db[coll]
                # Show first 3 sample IDs
                docs = collection.find().limit(3)
                for i, doc in enumerate(docs, 1):
                    if 'email' in doc:
                        print(f"   {i}. Email: {doc.get('email', 'N/A')}")
                    elif 'title' in doc:
                        print(f"   {i}. Title: {doc.get('title', 'N/A')}")
                    elif 'name' in doc:
                        print(f"   {i}. Name: {doc.get('name', 'N/A')}")
                    else:
                        print(f"   {i}. ID: {doc.get('_id', 'N/A')}")
            print("")
        else:
            print("⚠️ No documents found in any collection\n")
    
    # Check specific users
    print("\n" + "="*70)
    print("👤 CHECKING FOR TEST USERS:")
    print("="*70 + "\n")
    
    users_collection = db['users']
    
    test_emails = [
        "swarsakshi9@gmail.com",
        "upamanyukalburgi@gmail.com"
    ]
    
    for email in test_emails:
        user = users_collection.find_one({"email": email})
        if user:
            print(f"✅ User found: {email}")
            print(f"   ID: {user.get('_id')}")
            print(f"   Name: {user.get('name', 'N/A')}")
            print(f"   Created: {user.get('createdAt', 'N/A')}\n")
        else:
            print(f"❌ User NOT found: {email}\n")
    
    # Final summary
    print("="*70)
    print("✅ DATABASE STATUS:")
    print("="*70)
    print(f"Cluster: swaryogadb")
    print(f"Database: swar-yoga-db")
    print(f"Status: Connected")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70 + "\n")
    
    client.close()
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    print("\nMake sure:")
    print("1. MongoDB Atlas cluster is accessible")
    print("2. IP whitelist includes your machine")
    print("3. Connection string is correct")
    sys.exit(1)
