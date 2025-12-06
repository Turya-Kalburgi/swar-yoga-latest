#!/bin/bash

# Life Planner CRUD Testing Script
# This script tests all CRUD operations for the Life Planner routes

BASE_URL="http://localhost:3001"
USER_ID="testuser123"
HEADERS='-H "Content-Type: application/json" -H "X-User-ID: '$USER_ID'"'

echo "🧪 Testing Life Planner CRUD Operations"
echo "========================================"
echo ""

# Test 1: CREATE Vision
echo "📝 TEST 1: CREATE Vision (POST /api/visions)"
echo "-------------------------------------------"
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/visions" \
  -H "Content-Type: application/json" \
  -H "X-User-ID: $USER_ID" \
  -d '{"title":"Test Vision - Achieve Success","description":"Build a thriving life","timeline":"2025"}')

echo "Response:"
echo "$CREATE_RESPONSE" | jq '.'
echo ""

# Extract Vision ID for further tests
VISION_ID=$(echo "$CREATE_RESPONSE" | jq -r '.data._id // empty')

if [ -z "$VISION_ID" ]; then
  echo "❌ Failed to create vision. Skipping remaining tests."
  exit 1
fi

echo "✅ Vision created with ID: $VISION_ID"
echo ""

# Test 2: GET All Visions
echo "📖 TEST 2: GET All Visions (GET /api/visions)"
echo "--------------------------------------------"
GET_ALL_RESPONSE=$(curl -s -X GET "$BASE_URL/api/visions" \
  -H "X-User-ID: $USER_ID")

echo "Response:"
echo "$GET_ALL_RESPONSE" | jq '.'
echo ""

# Test 3: GET Single Vision
echo "📖 TEST 3: GET Single Vision (GET /api/visions/$VISION_ID)"
echo "---------------------------------------------------"
GET_ONE_RESPONSE=$(curl -s -X GET "$BASE_URL/api/visions/$VISION_ID" \
  -H "X-User-ID: $USER_ID")

echo "Response:"
echo "$GET_ONE_RESPONSE" | jq '.'
echo ""

# Test 4: UPDATE Vision
echo "✏️  TEST 4: UPDATE Vision (PUT /api/visions/$VISION_ID)"
echo "-----------------------------------------------------"
UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/api/visions/$VISION_ID" \
  -H "Content-Type: application/json" \
  -H "X-User-ID: $USER_ID" \
  -d '{"title":"Updated Vision - Achieve Greatness","status":"Active","milestone":"50% Complete"}')

echo "Response:"
echo "$UPDATE_RESPONSE" | jq '.'
echo ""

# Test 5: DELETE Vision
echo "🗑️  TEST 5: DELETE Vision (DELETE /api/visions/$VISION_ID)"
echo "---------------------------------------------------------"
DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/visions/$VISION_ID" \
  -H "X-User-ID: $USER_ID")

echo "Response:"
echo "$DELETE_RESPONSE" | jq '.'
echo ""

# Verify Deletion
echo "✅ Verify Deletion (GET /api/visions after delete)"
echo "---------------------------------------------------"
VERIFY_RESPONSE=$(curl -s -X GET "$BASE_URL/api/visions" \
  -H "X-User-ID: $USER_ID")

echo "Response (should be empty or not contain deleted vision):"
echo "$VERIFY_RESPONSE" | jq '.data | length'
echo ""

echo "========================================"
echo "✨ All CRUD tests completed!"
echo "========================================"
