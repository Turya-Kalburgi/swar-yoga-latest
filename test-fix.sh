#!/bin/bash

echo "🧪 Testing API with Email as User ID..."
echo ""

# Test 1: Get Visions for swarsakshi9@gmail.com
echo "1️⃣ GET /api/visions with X-User-ID: swarsakshi9@gmail.com"
curl -s -X GET "http://localhost:3001/api/visions" \
  -H "X-User-ID: swarsakshi9@gmail.com" \
  -H "Content-Type: application/json" | jq .

echo ""
echo "---"
echo ""

# Test 2: Create a Vision
echo "2️⃣ POST /api/visions - Create new vision"
curl -s -X POST "http://localhost:3001/api/visions" \
  -H "X-User-ID: swarsakshi9@gmail.com" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Vision from Fix",
    "description": "Testing the email-based userId fix",
    "priority": "High",
    "status": "In Progress"
  }' | jq .

echo ""
echo "---"
echo ""

# Test 3: Get all Goals
echo "3️⃣ GET /api/goals"
curl -s -X GET "http://localhost:3001/api/goals" \
  -H "X-User-ID: swarsakshi9@gmail.com" \
  -H "Content-Type: application/json" | jq .

echo ""
echo "---"
echo ""

# Test 4: Create a Goal
echo "4️⃣ POST /api/goals - Create new goal"
curl -s -X POST "http://localhost:3001/api/goals" \
  -H "X-User-ID: swarsakshi9@gmail.com" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Goal from Fix",
    "description": "Testing goal creation with fixed userId",
    "priority": "Medium",
    "status": "Not Started"
  }' | jq .

echo ""
echo "✅ API Tests Complete!"
