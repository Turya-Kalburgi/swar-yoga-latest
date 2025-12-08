#!/bin/bash

# Workshop Display Verification Script
# Run this script to verify all components are working correctly

echo "🔍 === WORKSHOP SYSTEM VERIFICATION SCRIPT ==="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}[1/5]${NC} Testing Backend API..."
RESPONSE=$(curl -s https://swar-yoga-dec.onrender.com/api/admin/workshops/public)
COUNT=$(echo "$RESPONSE" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')

if [ ! -z "$COUNT" ] && [ "$COUNT" -gt 0 ]; then
  echo -e "${GREEN}✓${NC} Backend responding with $COUNT public workshops"
else
  echo -e "${RED}✗${NC} Backend not responding correctly"
  echo "Response: $RESPONSE"
  exit 1
fi

echo ""
echo -e "${BLUE}[2/5]${NC} Checking backend health..."
HEALTH=$(curl -s https://swar-yoga-dec.onrender.com/api/health)
if echo "$HEALTH" | grep -q '"ok":true'; then
  echo -e "${GREEN}✓${NC} Backend health check passed"
else
  echo -e "${RED}✗${NC} Backend health check failed"
  exit 1
fi

echo ""
echo -e "${BLUE}[3/5]${NC} Verifying frontend deployment..."
if curl -s https://swaryoga.com | grep -q "<!DOCTYPE html>"; then
  echo -e "${GREEN}✓${NC} Frontend deployed and accessible at https://swaryoga.com"
else
  echo -e "${RED}✗${NC} Frontend not accessible"
  exit 1
fi

echo ""
echo -e "${BLUE}[4/5]${NC} Checking API CORS configuration..."
CORS=$(curl -s -I https://swar-yoga-dec.onrender.com/api/admin/workshops/public | grep -i "access-control-allow-origin")
if echo "$CORS" | grep -q "access-control-allow-origin"; then
  echo -e "${GREEN}✓${NC} CORS properly configured"
else
  echo -e "${YELLOW}⚠${NC}  CORS header not found (may still be working)"
fi

echo ""
echo -e "${BLUE}[5/5]${NC} Workshop data details..."
TITLES=$(echo "$RESPONSE" | grep -o '"title":"[^"]*"' | cut -d'"' -f4 | head -5)
echo -e "${GREEN}✓${NC} Sample workshop titles:"
echo "$TITLES" | sed 's/^/  • /'

echo ""
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ All systems operational!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo ""
echo "📋 What you should do now:"
echo "  1. Go to https://swaryoga.com"
echo "  2. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)"
echo "  3. Navigate to Workshops page"
echo "  4. Should see $COUNT workshops displayed"
echo ""
echo "❓ If workshops don't show:"
echo "  • Try Private/Incognito window"
echo "  • Clear browser cache manually"
echo "  • Try a different browser"
echo "  • Wait 2-3 minutes (Render cold start)"
echo ""
