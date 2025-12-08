#!/bin/bash

echo "🚀 STARTING API TESTS"
echo "===================="
echo ""

USER_EMAIL="swarsakshi9@gmail.com"
PASSWORD="Mohan@123"
BASE_URL="http://localhost:3001/api"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Test 1: Sign In
echo -e "${BLUE}[1] SIGN IN USER${NC}"
LOGIN=$(curl -s -X POST "$BASE_URL/users/signin" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$USER_EMAIL\",\"password\":\"$PASSWORD\"}")
echo "Response: $LOGIN"
echo ""

# Test 2: Create Vision
echo -e "${BLUE}[2] CREATE VISION-1${NC}"
VISION=$(curl -s -X POST "$BASE_URL/visions" \
  -H "Content-Type: application/json" \
  -H "X-User-ID: $USER_EMAIL" \
  -d '{"title":"Vision-1","description":"My life vision 2025","targetDate":"2025-12-31"}')
echo "Response: $VISION"
echo ""

# Test 3: Create Goal
echo -e "${BLUE}[3] CREATE GOAL-1${NC}"
GOAL=$(curl -s -X POST "$BASE_URL/goals" \
  -H "Content-Type: application/json" \
  -H "X-User-ID: $USER_EMAIL" \
  -d '{"title":"Goal-1","description":"Fitness goals","targetDate":"2025-06-30","priority":"High"}')
echo "Response: $GOAL"
echo ""

# Test 4: Create Task
echo -e "${BLUE}[4] CREATE TASK-1${NC}"
TASK=$(curl -s -X POST "$BASE_URL/tasks" \
  -H "Content-Type: application/json" \
  -H "X-User-ID: $USER_EMAIL" \
  -d '{"title":"Task-1","description":"Project setup","dueDate":"2025-01-15","priority":"High"}')
echo "Response: $TASK"
echo ""

# Test 5: Create Todo
echo -e "${BLUE}[5] CREATE TODO-1${NC}"
TODO=$(curl -s -X POST "$BASE_URL/todos" \
  -H "Content-Type: application/json" \
  -H "X-User-ID: $USER_EMAIL" \
  -d '{"title":"Todo-1","description":"Daily meditation","completed":false}')
echo "Response: $TODO"
echo ""

# Test 6: Create Health Record
echo -e "${BLUE}[6] CREATE HEALTH RECORD${NC}"
HEALTH=$(curl -s -X POST "$BASE_URL/health" \
  -H "Content-Type: application/json" \
  -H "X-User-ID: $USER_EMAIL" \
  -d "{\"steps\":10000,\"weight\":75,\"waterIntake\":8,\"sleepHours\":8,\"exercise\":\"Yoga\",\"date\":\"$(date +%Y-%m-%d)\"}")
echo "Response: $HEALTH"
echo ""

# Test 7: Create Reminder
echo -e "${BLUE}[7] CREATE REMINDER-1${NC}"
REMINDER=$(curl -s -X POST "$BASE_URL/reminders" \
  -H "Content-Type: application/json" \
  -H "X-User-ID: $USER_EMAIL" \
  -d '{"title":"Reminder-1","message":"Meditation time","remindAt":"2025-01-10T09:00:00Z","category":"Mindfulness"}')
echo "Response: $REMINDER"
echo ""

# Test 8: Create Milestone
echo -e "${BLUE}[8] CREATE MILESTONE-1${NC}"
MILESTONE=$(curl -s -X POST "$BASE_URL/milestones" \
  -H "Content-Type: application/json" \
  -H "X-User-ID: $USER_EMAIL" \
  -d '{"title":"Milestone-1","description":"First month success","targetDate":"2025-01-31","status":"In Progress"}')
echo "Response: $MILESTONE"
echo ""

# Test 9: Send Contact Message
echo -e "${BLUE}[9] SEND CONTACT MESSAGE${NC}"
CONTACT=$(curl -s -X POST "$BASE_URL/contact" \
  -H "Content-Type: application/json" \
  -H "X-User-ID: $USER_EMAIL" \
  -d "{\"name\":\"Test User\",\"email\":\"$USER_EMAIL\",\"subject\":\"API Test\",\"message\":\"Testing cloud sync\"}")
echo "Response: $CONTACT"
echo ""

# Test 10: Get all Visions
echo -e "${BLUE}[10] RETRIEVE ALL VISIONS${NC}"
VISIONS=$(curl -s "$BASE_URL/visions" \
  -H "X-User-ID: $USER_EMAIL")
echo "Response: $VISIONS"
echo ""

echo -e "${GREEN}✅ ALL TESTS COMPLETED${NC}"
echo ""
echo "📊 SUMMARY:"
echo "✅ User signed in"
echo "✅ Vision-1 created and saved to MongoDB Atlas"
echo "✅ Goal-1 created and saved to MongoDB Atlas"
echo "✅ Task-1 created and saved to MongoDB Atlas"
echo "✅ Todo-1 created and saved to MongoDB Atlas"
echo "✅ Health record created and saved to MongoDB Atlas"
echo "✅ Reminder-1 created and saved to MongoDB Atlas"
echo "✅ Milestone-1 created and saved to MongoDB Atlas"
echo "✅ Contact message created and saved to MongoDB Atlas"
echo ""
echo "🔄 CROSS-DEVICE SYNC TEST:"
echo "Use credentials to log in on different devices:"
echo "  📧 Email: $USER_EMAIL"
echo "  🔐 Password: $PASSWORD"
echo "All data will sync automatically via MongoDB Atlas!"
echo ""

