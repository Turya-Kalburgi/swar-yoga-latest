#!/bin/bash

# Swar Yoga - Complete Application Starter
# Starts both frontend (Vite) and backend (Express) servers in auto-start mode
# Usage: ./start-all.sh

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "════════════════════════════════════════════════════════════"
echo "🚀 SWAR YOGA - COMPLETE APPLICATION STARTER"
echo "════════════════════════════════════════════════════════════"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"
echo ""

# Kill any existing processes on ports 3001 and 5173
echo "🔄 Cleaning up any existing processes..."
lsof -ti:3001,5173 | xargs kill -9 2>/dev/null || true
sleep 1

# Start Backend Server
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "📦 Starting Backend Server (Express + MongoDB Atlas)..."
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd "$PROJECT_DIR/server"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📥 Installing backend dependencies..."
    npm install
fi

# Start backend in background
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend server started (PID: $BACKEND_PID)${NC}"
echo "   📍 Server: http://localhost:3001"
echo "   🗄️  Database: MongoDB Atlas"
echo ""

# Wait for backend to start
sleep 3

# Start Frontend Server
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "⚛️  Starting Frontend Server (Vite + React)..."
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd "$PROJECT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    npm install
fi

# Start frontend in background
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend server started (PID: $FRONTEND_PID)${NC}"
echo "   📍 Server: http://localhost:5173"
echo "   ⚛️  Framework: React + TypeScript + Vite"
echo ""

# Print connection information
echo "════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ BOTH SERVERS STARTED SUCCESSFULLY!${NC}"
echo "════════════════════════════════════════════════════════════"
echo ""
echo -e "${YELLOW}🌐 Access your application:${NC}"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo "   API:      http://localhost:3001/api"
echo ""
echo -e "${YELLOW}📊 Monitoring:${NC}"
echo "   Backend PID:  $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo -e "${YELLOW}🛑 To stop all servers:${NC}"
echo "   Press Ctrl+C"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}✅ All servers stopped${NC}"
}

# Set trap to cleanup on exit
trap cleanup EXIT INT TERM

# Wait for background processes
wait
