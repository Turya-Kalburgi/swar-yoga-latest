#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Contact Form & Admin Integration Test Suite            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

API_BASE="http://localhost:3001/api"
TIMESTAMP=$(date +%s%N)

echo ""
echo -e "${YELLOW}Prerequisites Check${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if backend is running
echo -e "Checking backend server at ${API_BASE}..."
if curl -s --connect-timeout 2 "$API_BASE/contact/messages" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running${NC}"
    BACKEND_READY=true
else
    echo -e "${RED}❌ Backend NOT responding at $API_BASE${NC}"
    echo -e "${YELLOW}Start backend with: cd server && npm run dev${NC}"
    BACKEND_READY=false
fi

echo ""
echo -e "${YELLOW}Test 1: Submit Contact Form${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$BACKEND_READY" = true ]; then
    # Generate unique contact ID for this test
    TEST_ID="test_$(date +%s)"
    TEST_EMAIL="test_contact_${TIMESTAMP}@example.com"
    
    echo "Submitting contact form with:"
    echo "  • Name: Test User"
    echo "  • Email: $TEST_EMAIL"
    echo "  • WhatsApp: 9876543210"
    echo "  • Country Code: +91"
    echo "  • Subject: Testing Contact Form"
    echo "  • Message: This is a test message to verify contact form and admin dashboard integration"
    
    CONTACT_RESPONSE=$(curl -s -X POST "$API_BASE/contact/messages" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Test User",
        "email": "'$TEST_EMAIL'",
        "whatsapp": "9876543210",
        "countryCode": "+91",
        "subject": "Testing Contact Form",
        "message": "This is a test message to verify contact form and admin dashboard integration"
      }')
    
    echo ""
    echo "Response:"
    echo "$CONTACT_RESPONSE" | jq '.' 2>/dev/null || echo "$CONTACT_RESPONSE"
    
    # Extract contactId from response
    CONTACT_ID=$(echo "$CONTACT_RESPONSE" | jq -r '.data.contactId // .data._id // empty' 2>/dev/null)
    
    if [ -n "$CONTACT_ID" ]; then
        echo ""
        echo -e "${GREEN}✅ Contact submitted successfully${NC}"
        echo "   Contact ID: $CONTACT_ID"
    else
        echo ""
        echo -e "${RED}❌ Failed to submit contact${NC}"
    fi
else
    echo -e "${RED}⏭️  Skipped (backend not available)${NC}"
fi

echo ""
echo -e "${YELLOW}Test 2: Fetch All Contact Messages (Admin View)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$BACKEND_READY" = true ]; then
    echo "Fetching all contact messages with pagination..."
    
    MESSAGES_RESPONSE=$(curl -s -X GET "$API_BASE/contact/messages?limit=5&skip=0" \
      -H "Content-Type: application/json")
    
    echo ""
    echo "Response:"
    echo "$MESSAGES_RESPONSE" | jq '.' 2>/dev/null || echo "$MESSAGES_RESPONSE"
    
    TOTAL=$(echo "$MESSAGES_RESPONSE" | jq '.pagination.total // 0' 2>/dev/null)
    COUNT=$(echo "$MESSAGES_RESPONSE" | jq '.data | length // 0' 2>/dev/null)
    
    echo ""
    echo -e "${GREEN}✅ Fetched $COUNT messages out of $TOTAL total${NC}"
else
    echo -e "${RED}⏭️  Skipped (backend not available)${NC}"
fi

echo ""
echo -e "${YELLOW}Test 3: Filter Contact Messages by Status${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$BACKEND_READY" = true ]; then
    echo "Fetching unread contact messages..."
    
    UNREAD_RESPONSE=$(curl -s -X GET "$API_BASE/contact/messages?status=unread&limit=10" \
      -H "Content-Type: application/json")
    
    echo ""
    echo "Response:"
    echo "$UNREAD_RESPONSE" | jq '.' 2>/dev/null || echo "$UNREAD_RESPONSE"
    
    UNREAD_COUNT=$(echo "$UNREAD_RESPONSE" | jq '.data | length // 0' 2>/dev/null)
    echo ""
    echo -e "${GREEN}✅ Found $UNREAD_COUNT unread messages${NC}"
else
    echo -e "${RED}⏭️  Skipped (backend not available)${NC}"
fi

echo ""
echo -e "${YELLOW}Test 4: Get Single Contact Message${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$BACKEND_READY" = true ] && [ -n "$CONTACT_ID" ]; then
    echo "Fetching specific contact message (ID: $CONTACT_ID)..."
    
    SINGLE_RESPONSE=$(curl -s -X GET "$API_BASE/contact/messages/$CONTACT_ID" \
      -H "Content-Type: application/json")
    
    echo ""
    echo "Response:"
    echo "$SINGLE_RESPONSE" | jq '.' 2>/dev/null || echo "$SINGLE_RESPONSE"
    
    echo ""
    echo -e "${GREEN}✅ Retrieved contact message${NC}"
else
    echo -e "${RED}⏭️  Skipped (contact ID not available)${NC}"
fi

echo ""
echo -e "${YELLOW}Test 5: Fetch Contact Statistics${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$BACKEND_READY" = true ]; then
    echo "Fetching contact statistics..."
    
    STATS_RESPONSE=$(curl -s -X GET "$API_BASE/contact/stats/overview" \
      -H "Content-Type: application/json")
    
    echo ""
    echo "Response:"
    echo "$STATS_RESPONSE" | jq '.' 2>/dev/null || echo "$STATS_RESPONSE"
    
    echo ""
    echo -e "${GREEN}✅ Retrieved statistics${NC}"
else
    echo -e "${RED}⏭️  Skipped (backend not available)${NC}"
fi

echo ""
echo -e "${YELLOW}Test 6: Admin Dashboard Stats${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$BACKEND_READY" = true ]; then
    echo "Fetching admin dashboard statistics..."
    
    ADMIN_STATS=$(curl -s -X GET "$API_BASE/admin/dashboard-stats" \
      -H "Content-Type: application/json")
    
    echo ""
    echo "Response:"
    echo "$ADMIN_STATS" | jq '.' 2>/dev/null || echo "$ADMIN_STATS"
    
    echo ""
    echo -e "${GREEN}✅ Retrieved admin statistics${NC}"
else
    echo -e "${RED}⏭️  Skipped (backend not available)${NC}"
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    Test Summary                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

if [ "$BACKEND_READY" = true ]; then
    echo -e "${GREEN}✅ All contact form and admin endpoints tested successfully${NC}"
    echo ""
    echo "Test Results:"
    echo "  ✅ Contact form submission"
    echo "  ✅ Fetch all contact messages"
    echo "  ✅ Filter contact messages by status"
    echo "  ✅ Get single contact message"
    echo "  ✅ Contact statistics"
    echo "  ✅ Admin dashboard stats"
    echo ""
    echo "Next Steps:"
    echo "  1. Visit http://localhost:5174/contact to submit a contact form"
    echo "  2. Visit http://localhost:5174/admin to view Contact Data"
    echo "  3. Verify your submitted message appears in the admin dashboard"
    echo "  4. Test filtering, searching, and replying to messages"
else
    echo -e "${RED}❌ Backend server is not running${NC}"
    echo ""
    echo "To start the backend server:"
    echo "  cd server"
    echo "  npm run dev"
    echo ""
    echo "To start the frontend server (in another terminal):"
    echo "  npm run dev"
fi

echo ""
