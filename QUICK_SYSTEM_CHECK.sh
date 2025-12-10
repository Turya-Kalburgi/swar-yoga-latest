#!/bin/bash

echo "========================================="
echo "  SWAR YOGA - QUICK SYSTEM CHECK"
echo "========================================="
echo ""

echo "1️⃣  PM2 Status:"
pm2 status | tail -5
echo ""

echo "2️⃣  Backend Health Check (localhost:4000):"
curl -s http://localhost:4000/health | jq .status
echo ""

echo "3️⃣  Frontend Status (localhost:5173):"
if curl -s http://localhost:5173 | grep -q "doctype"; then
  echo "✅ Frontend is running"
else
  echo "❌ Frontend is not responding"
fi
echo ""

echo "4️⃣  PM2 Auto-Restart Schedule:"
pm2 show swar-backend | grep "cron restart" | awk '{print "Schedule: " $3 " " $4 " " $5}'
echo ""

echo "5️⃣  Vercel Production URL:"
echo "�� https://swaryoga.com"
echo ""

echo "6️⃣  MongoDB Connection:"
if curl -s http://localhost:4000/health | grep -q "Database are live"; then
  echo "✅ MongoDB is connected"
else
  echo "❌ MongoDB connection status unknown"
fi
echo ""

echo "========================================="
echo "✅ System Check Complete!"
echo "========================================="
