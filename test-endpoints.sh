#!/bin/bash

echo "╔═════════════════════════════════════════════════════════════╗"
echo "║         LOCAL SERVER & MONGODB ENDPOINT TEST                ║"
echo "║                  December 9, 2025                           ║"
echo "╚═════════════════════════════════════════════════════════════╝"
echo ""

BASE_URL="http://localhost:4000/api"

echo "🔍 Testing Basic Connectivity..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1: Health endpoint
echo "✓ Health Check:"
curl -s "$BASE_URL/health" | jq '.' 2>/dev/null || echo "  Error checking health"
echo ""

# Test 2: Users endpoint
echo "✓ Users Endpoint:"
curl -s "$BASE_URL/users?page=1&limit=5" | jq '.pagination' 2>/dev/null || echo "  Error fetching users"
echo ""

# Test 3: Visions endpoint
echo "✓ Visions Endpoint:"
curl -s "$BASE_URL/visions?page=1&limit=5" | jq '.pagination' 2>/dev/null || echo "  Error fetching visions"
echo ""

# Test 4: Goals endpoint
echo "✓ Goals Endpoint:"
curl -s "$BASE_URL/goals?page=1&limit=5" | jq '.pagination' 2>/dev/null || echo "  Error fetching goals"
echo ""

# Test 5: Tasks endpoint
echo "✓ Tasks Endpoint:"
curl -s "$BASE_URL/tasks?page=1&limit=5" | jq '.pagination' 2>/dev/null || echo "  Error fetching tasks"
echo ""

# Test 6: Workshops endpoint
echo "✓ Workshops Endpoint:"
curl -s "$BASE_URL/workshops?page=1&limit=5" | jq '.pagination' 2>/dev/null || echo "  Error fetching workshops"
echo ""

# Test 7: Contact records
echo "✓ Contact Records:"
curl -s "$BASE_URL/contact" | jq '.data | length' 2>/dev/null || echo "  Error fetching contacts"
echo ""

echo "🔍 Testing Admin Endpoints..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 8: Admin dashboard stats
echo "✓ Admin Dashboard Stats:"
curl -s "$BASE_URL/admin/dashboard-stats" 2>&1 | head -50 | jq '.' 2>/dev/null || echo "  Checking dashboard endpoint..."
echo ""

echo "✅ All endpoint tests complete!"
