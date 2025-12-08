#!/bin/bash

# Swar Yoga Auto-Start & Backup Service Management Script
# Use this script to check status, view logs, and manage the service

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_DIR="/Users/mohankalburgi/Downloads/swar-yoga-latest-latest-prod-version"
LOG_DIR="$HOME/.swar-yoga-logs"
PLIST_FILE="$HOME/Library/LaunchAgents/com.swaryoga.autostart.plist"

# Function: Check service status
check_status() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║              Service Status Check                          ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Check launchd service
    echo -e "${YELLOW}Launchd Service:${NC}"
    if launchctl list | grep -q "com.swaryoga.autostart"; then
        echo -e "  ${GREEN}✅ Service is loaded and running${NC}"
    else
        echo -e "  ${RED}❌ Service is not loaded${NC}"
    fi
    echo ""
    
    # Check backend server
    echo -e "${YELLOW}Backend Server (port 4000):${NC}"
    if curl -s --connect-timeout 2 http://localhost:4000/api/contact/messages > /dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Running and responding${NC}"
    else
        echo -e "  ${RED}❌ Not responding${NC}"
    fi
    echo ""
    
    # Check frontend server
    echo -e "${YELLOW}Frontend Server (port 5174):${NC}"
    if curl -s --connect-timeout 2 http://localhost:5174 > /dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Running and responding${NC}"
    else
        echo -e "  ${RED}❌ Not responding${NC}"
    fi
    echo ""
    
    # Check MongoDB connection
    echo -e "${YELLOW}MongoDB Connection:${NC}"
    if timeout 3 curl -s "mongodb://admin:MySecurePass123@157.173.221.234:27017/?authSource=admin" > /dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Connected${NC}"
    else
        echo -e "  ${YELLOW}⚠️  Check network connection${NC}"
    fi
    echo ""
    
    # Show last few health checks
    echo -e "${YELLOW}Latest Health Checks:${NC}"
    if [ -f "$LOG_DIR/health-check.log" ]; then
        tail -5 "$LOG_DIR/health-check.log" | sed 's/^/  /'
    else
        echo "  No health check log found"
    fi
    echo ""
}

# Function: View logs
view_logs() {
    case "$1" in
        "health")
            tail -f "$LOG_DIR/health-check.log"
            ;;
        "backend")
            tail -f "$LOG_DIR/backend.log"
            ;;
        "frontend")
            tail -f "$LOG_DIR/frontend.log"
            ;;
        "backup")
            tail -f "$LOG_DIR/backup.log"
            ;;
        "all")
            tail -f "$LOG_DIR/health-check.log"
            ;;
        *)
            echo "Available logs:"
            echo "  ./swar-manage.sh logs health   - Health check logs"
            echo "  ./swar-manage.sh logs backend  - Backend server logs"
            echo "  ./swar-manage.sh logs frontend - Frontend server logs"
            echo "  ./swar-manage.sh logs backup   - Backup logs"
            ;;
    esac
}

# Function: Stop service
stop_service() {
    echo -e "${YELLOW}Stopping auto-start service...${NC}"
    launchctl unload "$PLIST_FILE"
    echo -e "${GREEN}✅ Service stopped${NC}"
}

# Function: Start service
start_service() {
    echo -e "${YELLOW}Starting auto-start service...${NC}"
    launchctl load "$PLIST_FILE"
    echo -e "${GREEN}✅ Service started${NC}"
}

# Function: Restart service
restart_service() {
    echo -e "${YELLOW}Restarting auto-start service...${NC}"
    launchctl unload "$PLIST_FILE"
    sleep 1
    launchctl load "$PLIST_FILE"
    echo -e "${GREEN}✅ Service restarted${NC}"
}

# Function: Show backups
show_backups() {
    BACKUP_DIR="$PROJECT_DIR/backups/mongodb"
    
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                  MongoDB Backups                           ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    if [ ! -d "$BACKUP_DIR" ]; then
        echo "No backups directory found"
        return
    fi
    
    echo "Backup Location: $BACKUP_DIR"
    echo ""
    
    # List backups
    echo -e "${YELLOW}Available Backups:${NC}"
    if [ -f "$BACKUP_DIR/backups.json" ]; then
        cat "$BACKUP_DIR/backups.json" | jq -r '.backups[] | "\(.date) - \(.id) (\(.size))"' 2>/dev/null || cat "$BACKUP_DIR/backups.json"
    else
        echo "  No backup metadata found"
    fi
    
    echo ""
    echo "Backup Directories:"
    ls -lh "$BACKUP_DIR" | grep "^d" | awk '{print "  " $9 " (" $5 ")"}'
    echo ""
}

# Function: Show help
show_help() {
    echo -e "${BLUE}Swar Yoga Auto-Start & Backup Service Manager${NC}"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  status          - Check service and server status"
    echo "  logs [type]     - View logs (health, backend, frontend, backup)"
    echo "  stop            - Stop the auto-start service"
    echo "  start           - Start the auto-start service"
    echo "  restart         - Restart the auto-start service"
    echo "  backups         - Show available MongoDB backups"
    echo "  help            - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 status"
    echo "  $0 logs health"
    echo "  $0 backups"
    echo "  $0 restart"
    echo ""
}

# Main script logic
case "${1:-status}" in
    status)
        check_status
        ;;
    logs)
        view_logs "$2"
        ;;
    stop)
        stop_service
        ;;
    start)
        start_service
        ;;
    restart)
        restart_service
        ;;
    backups)
        show_backups
        ;;
    help)
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        echo "Run: $0 help"
        ;;
esac
