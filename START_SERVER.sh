#!/bin/bash

echo "╔═════════════════════════════════════════════════════════════════════════════╗"
echo "║                    STARTING SWAR YOGA BACKEND SERVER                        ║"
echo "║                        December 9, 2025                                     ║"
echo "╚═════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Change to server directory
cd "$(dirname "$0")/server"

echo "📦 Installing dependencies if needed..."
npm install 2>&1 | grep -E "(added|up to date)" || echo "Dependencies ready"

echo ""
echo "🚀 Starting server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the server with tsx (TypeScript support)
npx tsx server.ts

