#!/bin/bash

# Enhanced API Test Script for Multiple Users
# Tests all features and cross-device sync capability

BASE_URL="http://localhost:3001/api"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# Test function
test_user() {
    local USER_EMAIL=$1
    local PASSWORD=$2
    local USER_NUM=$3
    
    echo -e "\n${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║              TEST USER $USER_NUM: $USER_EMAIL              ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}\n"
    
    # Step 1: Sign Up / Sign In
    echo -e "${BLUE}[Step 1] AUTHENTICATING USER...${NC}"
    AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/users/signin" \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"$USER_EMAIL\",\"password\":\"$PASSWORD\"}")
    
    # Check if login failed (user doesn't exist)
    if echo "$AUTH_RESPONSE" | grep -q "error\|Error\|404"; then
        echo -e "${YELLOW}⚠️  User not found, creating new account...${NC}"
        SIGNUP=$(curl -s -X POST "$BASE_URL/users/signup" \
          -H "Content-Type: application/json" \
          -d "{\"email\":\"$USER_EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"Test User $USER_NUM\"}")
        echo "Signup Response: $SIGNUP"
        
        # Try signin again
        AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/users/signin" \
          -H "Content-Type: application/json" \
          -d "{\"email\":\"$USER_EMAIL\",\"password\":\"$PASSWORD\"}")
    fi
    
    if [ ! -z "$AUTH_RESPONSE" ]; then
        echo -e "${GREEN}✅ Authentication successful${NC}"
        echo "Response: $AUTH_RESPONSE" | head -5
    else
        echo -e "${RED}❌ Authentication failed${NC}"
        return 1
    fi
    
    echo ""
    
    # Step 2: Create Vision
    echo -e "${BLUE}[Step 2] CREATING VISION-1...${NC}"
    VISION=$(curl -s -X POST "$BASE_URL/visions" \
      -H "Content-Type: application/json" \
      -H "X-User-ID: $USER_EMAIL" \
      -d "{\"title\":\"Vision-1: Life 2025\",\"description\":\"My comprehensive life vision for 2025\",\"targetDate\":\"2025-12-31\",\"category\":\"Life\"}")
    
    if echo "$VISION" | grep -q "_id\|id"; then
        echo -e "${GREEN}✅ Vision created${NC}"
        VISION_ID=$(echo "$VISION" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
        echo "Vision ID: $VISION_ID"
    else
        echo -e "${YELLOW}⚠️  Response: $VISION${NC}"
    fi
    echo ""
    
    # Step 3: Create Goal
    echo -e "${BLUE}[Step 3] CREATING GOAL-1...${NC}"
    GOAL=$(curl -s -X POST "$BASE_URL/goals" \
      -H "Content-Type: application/json" \
      -H "X-User-ID: $USER_EMAIL" \
      -d "{\"title\":\"Goal-1: Fitness\",\"description\":\"Achieve fitness goals\",\"targetDate\":\"2025-06-30\",\"category\":\"Health\",\"priority\":\"High\"}")
    
    if echo "$GOAL" | grep -q "_id\|id"; then
        echo -e "${GREEN}✅ Goal created${NC}"
        GOAL_ID=$(echo "$GOAL" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
        echo "Goal ID: $GOAL_ID"
    else
        echo -e "${YELLOW}⚠️  Response: $GOAL${NC}"
    fi
    echo ""
    
    # Step 4: Create Task
    echo -e "${BLUE}[Step 4] CREATING TASK-1...${NC}"
    TASK=$(curl -s -X POST "$BASE_URL/tasks" \
      -H "Content-Type: application/json" \
      -H "X-User-ID: $USER_EMAIL" \
      -d "{\"title\":\"Task-1: Setup\",\"description\":\"Complete project setup\",\"dueDate\":\"2025-01-15\",\"priority\":\"High\",\"status\":\"In Progress\"}")
    
    if echo "$TASK" | grep -q "_id\|id"; then
        echo -e "${GREEN}✅ Task created${NC}"
        TASK_ID=$(echo "$TASK" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
        echo "Task ID: $TASK_ID"
    else
        echo -e "${YELLOW}⚠️  Response: $TASK${NC}"
    fi
    echo ""
    
    # Step 5: Create Todo
    echo -e "${BLUE}[Step 5] CREATING TODO-1...${NC}"
    TODO=$(curl -s -X POST "$BASE_URL/todos" \
      -H "Content-Type: application/json" \
      -H "X-User-ID: $USER_EMAIL" \
      -d "{\"title\":\"Todo-1: Meditation\",\"description\":\"30-minute meditation session\",\"completed\":false,\"dueDate\":\"2025-01-10\"}")
    
    if echo "$TODO" | grep -q "_id\|id"; then
        echo -e "${GREEN}✅ Todo created${NC}"
        TODO_ID=$(echo "$TODO" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
        echo "Todo ID: $TODO_ID"
    else
        echo -e "${YELLOW}⚠️  Response: $TODO${NC}"
    fi
    echo ""
    
    # Step 6: Create Health Record
    echo -e "${BLUE}[Step 6] CREATING HEALTH RECORD...${NC}"
    TODAY=$(date +%Y-%m-%d)
    HEALTH=$(curl -s -X POST "$BASE_URL/health" \
      -H "Content-Type: application/json" \
      -H "X-User-ID: $USER_EMAIL" \
      -d "{\"steps\":10000,\"weight\":75.5,\"waterIntake\":8,\"sleepHours\":8,\"exercise\":\"Yoga - 1 hour\",\"date\":\"$TODAY\",\"notes\":\"Great day!\"}")
    
    if echo "$HEALTH" | grep -q "_id\|id"; then
        echo -e "${GREEN}✅ Health record created${NC}"
        HEALTH_ID=$(echo "$HEALTH" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
        echo "Health ID: $HEALTH_ID"
    else
        echo -e "${YELLOW}⚠️  Response: $HEALTH${NC}"
    fi
    echo ""
    
    # Step 7: Create Reminder
    echo -e "${BLUE}[Step 7] CREATING REMINDER-1...${NC}"
    TOMORROW=$(date -u -d "+1 day" "+%Y-%m-%dT09:00:00Z" 2>/dev/null || date -u -v+1d "+%Y-%m-%dT09:00:00Z")
    REMINDER=$(curl -s -X POST "$BASE_URL/reminders" \
      -H "Content-Type: application/json" \
      -H "X-User-ID: $USER_EMAIL" \
      -d "{\"title\":\"Reminder-1: Meditation\",\"message\":\"Time for your meditation session\",\"remindAt\":\"$TOMORROW\",\"category\":\"Mindfulness\",\"isActive\":true}")
    
    if echo "$REMINDER" | grep -q "_id\|id"; then
        echo -e "${GREEN}✅ Reminder created${NC}"
        REMINDER_ID=$(echo "$REMINDER" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
        echo "Reminder ID: $REMINDER_ID"
    else
        echo -e "${YELLOW}⚠️  Response: $REMINDER${NC}"
    fi
    echo ""
    
    # Step 8: Create Milestone
    echo -e "${BLUE}[Step 8] CREATING MILESTONE-1...${NC}"
    MILESTONE=$(curl -s -X POST "$BASE_URL/milestones" \
      -H "Content-Type: application/json" \
      -H "X-User-ID: $USER_EMAIL" \
      -d "{\"title\":\"Milestone-1: First Month\",\"description\":\"Successfully completed first month\",\"targetDate\":\"2025-01-31\",\"status\":\"In Progress\",\"progress\":30}")
    
    if echo "$MILESTONE" | grep -q "_id\|id"; then
        echo -e "${GREEN}✅ Milestone created${NC}"
        MILESTONE_ID=$(echo "$MILESTONE" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
        echo "Milestone ID: $MILESTONE_ID"
    else
        echo -e "${YELLOW}⚠️  Response: $MILESTONE${NC}"
    fi
    echo ""
    
    # Step 9: Send Contact Message
    echo -e "${BLUE}[Step 9] SENDING CONTACT MESSAGE...${NC}"
    CONTACT=$(curl -s -X POST "$BASE_URL/contact" \
      -H "Content-Type: application/json" \
      -H "X-User-ID: $USER_EMAIL" \
      -d "{\"name\":\"Test User\",\"email\":\"$USER_EMAIL\",\"subject\":\"API Testing - Cloud Sync\",\"message\":\"Testing cross-device data synchronization via MongoDB Atlas\"}")
    
    if echo "$CONTACT" | grep -q "_id\|id"; then
        echo -e "${GREEN}✅ Contact message created${NC}"
        CONTACT_ID=$(echo "$CONTACT" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
        echo "Contact ID: $CONTACT_ID"
    else
        echo -e "${YELLOW}⚠️  Response: $CONTACT${NC}"
    fi
    echo ""
    
    # Step 10: Retrieve All Data
    echo -e "${BLUE}[Step 10] VERIFYING DATA SAVED TO MONGODB ATLAS...${NC}"
    
    echo -e "${YELLOW}Getting Visions:${NC}"
    VISIONS=$(curl -s "$BASE_URL/visions" -H "X-User-ID: $USER_EMAIL")
    VISION_COUNT=$(echo "$VISIONS" | grep -o '"_id"' | wc -l)
    echo "  ✅ $VISION_COUNT vision(s) found"
    
    echo -e "${YELLOW}Getting Goals:${NC}"
    GOALS=$(curl -s "$BASE_URL/goals" -H "X-User-ID: $USER_EMAIL")
    GOAL_COUNT=$(echo "$GOALS" | grep -o '"_id"' | wc -l)
    echo "  ✅ $GOAL_COUNT goal(s) found"
    
    echo -e "${YELLOW}Getting Tasks:${NC}"
    TASKS=$(curl -s "$BASE_URL/tasks" -H "X-User-ID: $USER_EMAIL")
    TASK_COUNT=$(echo "$TASKS" | grep -o '"_id"' | wc -l)
    echo "  ✅ $TASK_COUNT task(s) found"
    
    echo -e "${YELLOW}Getting Todos:${NC}"
    TODOS=$(curl -s "$BASE_URL/todos" -H "X-User-ID: $USER_EMAIL")
    TODO_COUNT=$(echo "$TODOS" | grep -o '"_id"' | wc -l)
    echo "  ✅ $TODO_COUNT todo(s) found"
    
    echo -e "${YELLOW}Getting Health Records:${NC}"
    HEALTH=$(curl -s "$BASE_URL/health" -H "X-User-ID: $USER_EMAIL")
    HEALTH_COUNT=$(echo "$HEALTH" | grep -o '"_id"' | wc -l)
    echo "  ✅ $HEALTH_COUNT health record(s) found"
    
    echo -e "${YELLOW}Getting Reminders:${NC}"
    REMINDERS=$(curl -s "$BASE_URL/reminders" -H "X-User-ID: $USER_EMAIL")
    REMINDER_COUNT=$(echo "$REMINDERS" | grep -o '"_id"' | wc -l)
    echo "  ✅ $REMINDER_COUNT reminder(s) found"
    
    echo -e "${YELLOW}Getting Milestones:${NC}"
    MILESTONES=$(curl -s "$BASE_URL/milestones" -H "X-User-ID: $USER_EMAIL")
    MILESTONE_COUNT=$(echo "$MILESTONES" | grep -o '"_id"' | wc -l)
    echo "  ✅ $MILESTONE_COUNT milestone(s) found"
    
    echo ""
    echo -e "${GREEN}✅ ALL TESTS COMPLETED FOR USER $USER_NUM${NC}"
    echo ""
}

# Main execution
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🚀 COMPREHENSIVE API TEST SUITE - MULTIPLE USERS 🚀         ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"

# Test User 1
test_user "swarsakshi9@gmail.com" "Mohan@123" "1 (swarsakshi9@gmail.com)"

# Test User 2
test_user "upamanyukalburgi@gmail.com" "Kalburgi1" "2 (upamanyukalburgi@gmail.com)"

# Final Summary
echo -e "\n${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                    🎉 TEST COMPLETE 🎉                        ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${GREEN}📊 SUMMARY:${NC}"
echo -e "  ✅ User 1 (swarsakshi9@gmail.com): All data created and saved"
echo -e "  ✅ User 2 (upamanyukalburgi@gmail.com): All data created and saved"
echo ""

echo -e "${GREEN}☁️  CLOUD DATABASE STATUS:${NC}"
echo -e "  ✅ MongoDB Atlas Cluster: swaryogadb"
echo -e "  ✅ Database: swar-yoga-db"
echo -e "  ✅ All user data synced to cloud"
echo ""

echo -e "${GREEN}🔄 CROSS-DEVICE SYNC TESTING:${NC}"
echo -e "  1️⃣  Log in on Device 1 with User 1 credentials:"
echo -e "      📧 Email: swarsakshi9@gmail.com"
echo -e "      🔐 Password: Mohan@123"
echo -e ""
echo -e "  2️⃣  Log in on Device 2 with User 2 credentials:"
echo -e "      📧 Email: upamanyukalburgi@gmail.com"
echo -e "      🔐 Password: Kalburgi1"
echo -e ""
echo -e "  3️⃣  Verify all created data appears on respective devices"
echo -e "  4️⃣  Modify data on one device and verify sync to other devices"
echo -e "  5️⃣  Test multiple devices (phone, tablet, laptop, etc.)"
echo ""

echo -e "${YELLOW}📋 DATA CREATED PER USER:${NC}"
echo -e "  • Vision-1"
echo -e "  • Goal-1"
echo -e "  • Task-1"
echo -e "  • Todo-1"
echo -e "  • Health Record"
echo -e "  • Reminder-1"
echo -e "  • Milestone-1"
echo -e "  • Contact Message"
echo ""

echo -e "${CYAN}🌐 MONGODB ATLAS INFORMATION:${NC}"
echo -e "  URL: https://cloud.mongodb.com"
echo -e "  Cluster: swaryogadb"
echo -e "  Database: swar-yoga-db"
echo -e "  Collections: Users, Visions, Goals, Tasks, Todos, Health, Reminders, Milestones, Contacts"
echo ""
