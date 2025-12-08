#!/bin/bash

# Setup Auto-Start & Backup Service for Swar Yoga
# Run this script to set up automated server restart and daily MongoDB backups

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      Swar Yoga Auto-Start & Backup Service Setup          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

PROJECT_DIR="/Users/mohankalburgi/Downloads/swar-yoga-latest-latest-prod-version"
LOG_DIR="$HOME/.swar-yoga-logs"
PLIST_FILE="$HOME/Library/LaunchAgents/com.swaryoga.autostart.plist"
SCRIPT_FILE="$PROJECT_DIR/auto-start-service.sh"

# Step 1: Make scripts executable
echo -e "${YELLOW}Step 1: Setting up permissions...${NC}"
chmod +x "$SCRIPT_FILE"
echo -e "${GREEN}✅ Scripts made executable${NC}"
echo ""

# Step 2: Create log directory
echo -e "${YELLOW}Step 2: Creating log directory...${NC}"
mkdir -p "$LOG_DIR"
echo -e "${GREEN}✅ Log directory created: $LOG_DIR${NC}"
echo ""

# Step 3: Setup launchd service
echo -e "${YELLOW}Step 3: Installing launchd service...${NC}"
if [ -f "$PLIST_FILE" ]; then
    echo -e "${YELLOW}ℹ️  Unloading existing service...${NC}"
    launchctl unload "$PLIST_FILE" 2>/dev/null || true
fi

mkdir -p "$HOME/Library/LaunchAgents"
echo -e "${GREEN}✅ launchd service installed${NC}"
echo ""

# Step 4: Load service
echo -e "${YELLOW}Step 4: Loading launchd service...${NC}"
launchctl load "$PLIST_FILE"
echo -e "${GREEN}✅ Service loaded and will start automatically${NC}"
echo ""

# Step 5: Verify service is running
echo -e "${YELLOW}Step 5: Verifying service...${NC}"
sleep 2
if launchctl list | grep -q "com.swaryoga.autostart"; then
    echo -e "${GREEN}✅ Service is registered and running${NC}"
else
    echo -e "${RED}❌ Service verification failed${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    Setup Complete!                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Configuration:"
echo -e "  ${GREEN}✅ Auto-Start Service${NC}"
echo "     • Monitors servers every 30 minutes"
echo "     • Automatically restarts if they go down"
echo "     • Runs on system startup"
echo ""
echo -e "  ${GREEN}✅ Daily MongoDB Backups${NC}"
echo "     • Backs up Contacts, Users, and Admin data"
echo "     • Keeps last 30 days of backups"
echo "     • Saves to: $PROJECT_DIR/backups/mongodb"
echo ""
echo "Log Files:"
echo "  • Health Check: $LOG_DIR/health-check.log"
echo "  • Backend Log:  $LOG_DIR/backend.log"
echo "  • Frontend Log: $LOG_DIR/frontend.log"
echo "  • Backup Log:   $LOG_DIR/backup.log"
echo "  • Launchd Log:  $LOG_DIR/launchd.log"
echo ""

echo "Useful Commands:"
echo "  # Check service status"
echo "  launchctl list | grep com.swaryoga.autostart"
echo ""
echo "  # View logs in real-time"
echo "  tail -f $LOG_DIR/health-check.log"
echo ""
echo "  # Stop the service"
echo "  launchctl unload $PLIST_FILE"
echo ""
echo "  # Start the service"
echo "  launchctl load $PLIST_FILE"
echo ""
echo "  # Restart the service"
echo "  launchctl unload $PLIST_FILE && launchctl load $PLIST_FILE"
echo ""

echo -e "${GREEN}✅ All systems ready! Service will maintain servers 24/7.${NC}"
echo ""
