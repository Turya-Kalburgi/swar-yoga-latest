#!/bin/bash

# Server Health Check Script
# Tests both backend and frontend servers
# Usage: ./check-servers.sh

echo "════════════════════════════════════════════════════════════"
echo "🔍 SWAR YOGA - SERVER HEALTH CHECK"
echo "════════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Initialize counters
SERVERS_RUNNING=0
SERVERS_TOTAL=2

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "📦 BACKEND SERVER STATUS"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check backend on port 3001
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend Server is RUNNING${NC}"
    echo "   Port: 3001"
    echo "   PID: $(lsof -i :3001 -t | head -1)"
    SERVERS_RUNNING=$((SERVERS_RUNNING + 1))
    
    # Test health endpoint
    echo ""
    echo "   Testing health endpoint..."
    HEALTH=$(curl -s http://localhost:3001/api/health 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "   ${GREEN}✅ API is responsive${NC}"
        echo "   Response: $HEALTH"
    else
        echo -e "   ${YELLOW}⚠️  API not responding${NC}"
    fi
else
    echo -e "${RED}❌ Backend Server is NOT RUNNING${NC}"
    echo "   Port: 3001"
    echo ""
    echo -e "   ${YELLOW}To start backend:${NC}"
    echo "   ./start-backend.sh"
    echo "   or"
    echo "   ./start-all.sh"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "⚛️  FRONTEND SERVER STATUS"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check frontend on port 5173
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend Server is RUNNING${NC}"
    echo "   Port: 5173"
    echo "   PID: $(lsof -i :5173 -t | head -1)"
    SERVERS_RUNNING=$((SERVERS_RUNNING + 1))
    
    # Test frontend
    echo ""
    echo "   Testing frontend availability..."
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)
    if [ "$STATUS" = "200" ]; then
        echo -e "   ${GREEN}✅ Frontend is responsive (HTTP $STATUS)${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Frontend returned HTTP $STATUS${NC}"
    fi
else
    echo -e "${RED}❌ Frontend Server is NOT RUNNING${NC}"
    echo "   Port: 5173"
    echo ""
    echo -e "   ${YELLOW}To start frontend:${NC}"
    echo "   ./start-frontend.sh"
    echo "   or"
    echo "   ./start-all.sh"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "📊 SUMMARY"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Servers Running: $SERVERS_RUNNING / $SERVERS_TOTAL"
echo ""

if [ $SERVERS_RUNNING -eq 2 ]; then
    echo -e "${GREEN}✅ ALL SERVERS ARE RUNNING!${NC}"
    echo ""
    echo -e "${YELLOW}🌐 Access your application:${NC}"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend:  http://localhost:3001"
    echo "   API:      http://localhost:3001/api"
elif [ $SERVERS_RUNNING -eq 1 ]; then
    echo -e "${YELLOW}⚠️  PARTIAL SERVER OPERATION${NC}"
    echo "   One server is running, one is down"
    echo ""
    echo -e "   ${YELLOW}To start all servers:${NC}"
    echo "   ./start-all.sh"
else
    echo -e "${RED}❌ NO SERVERS RUNNING${NC}"
    echo ""
    echo -e "   ${YELLOW}To start servers:${NC}"
    echo "   ./start-all.sh"
    echo ""
    echo -e "   Or start individually:"
    echo "   ./start-backend.sh  # Terminal 1"
    echo "   ./start-frontend.sh # Terminal 2"
fi

echo ""
echo "════════════════════════════════════════════════════════════"

# Exit with status
if [ $SERVERS_RUNNING -eq 2 ]; then
    exit 0
else
    exit 1
fi
