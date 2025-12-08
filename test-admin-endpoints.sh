#!/bin/bash

# Test script to verify new admin endpoints
API_BASE="http://localhost:3001/api"

echo "================================"
echo "Testing Admin API Endpoints"
echo "================================"

echo ""
echo "1. Testing GET /api/admin/signup-data"
curl -X GET "$API_BASE/admin/signup-data?limit=10" \
  -H "Content-Type: application/json" \
  -s | jq '.' || echo "Error fetching signup data"

echo ""
echo "2. Testing GET /api/admin/signin-data"
curl -X GET "$API_BASE/admin/signin-data?limit=10" \
  -H "Content-Type: application/json" \
  -s | jq '.' || echo "Error fetching signin data"

echo ""
echo "3. Testing GET /api/admin/dashboard-stats"
curl -X GET "$API_BASE/admin/dashboard-stats" \
  -H "Content-Type: application/json" \
  -s | jq '.' || echo "Error fetching dashboard stats"

echo ""
echo "4. Testing GET /api/contact/messages"
curl -X GET "$API_BASE/contact/messages?limit=5" \
  -H "Content-Type: application/json" \
  -s | jq '.' || echo "Error fetching contact messages"

echo ""
echo "================================"
echo "Test Complete"
echo "================================"
