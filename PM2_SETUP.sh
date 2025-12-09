#!/bin/bash

# PM2 Auto-Restart Setup & Deployment Guide
# ============================================

echo "🚀 PM2 Auto-Restart Mode Setup"
echo "================================"

# Step 1: Install PM2 globally (if not already installed)
echo "📦 Installing PM2 globally..."
npm install -g pm2

# Step 2: Start services with PM2 using the ecosystem config
echo "🔄 Starting services with PM2 (auto-restart enabled)..."
pm2 start ecosystem.config.cjs

# Step 3: Enable PM2 startup on system reboot
echo "⚙️ Configuring PM2 to start on system reboot..."
pm2 startup launchd -u $(whoami) --hp /Users/$(whoami)
pm2 save

# Step 4: Display status
echo ""
echo "✅ PM2 Setup Complete!"
echo ""
pm2 status
echo ""
echo "📊 Monitoring Apps:"
pm2 logs --lines 20
echo ""
echo "📝 Useful PM2 Commands:"
echo "  pm2 start ecosystem.config.cjs      - Start all apps"
echo "  pm2 stop all                         - Stop all apps"
echo "  pm2 restart all                      - Restart all apps"
echo "  pm2 logs                             - View live logs"
echo "  pm2 logs swar-backend                - View backend logs only"
echo "  pm2 logs swar-frontend               - View frontend logs only"
echo "  pm2 monit                            - Monitor CPU/Memory usage"
echo "  pm2 delete all                       - Remove all apps from PM2"
echo "  pm2 unstartup                        - Disable auto-start on reboot"
echo ""
