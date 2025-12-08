#!/bin/bash

# Auto-start servers with health check every 30 minutes and daily MongoDB backup
# This script runs as a background process and keeps servers running

LOG_DIR="$HOME/.swar-yoga-logs"
mkdir -p "$LOG_DIR"

BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"
HEALTH_LOG="$LOG_DIR/health-check.log"
BACKUP_LOG="$LOG_DIR/backup.log"

PROJECT_ROOT="/Users/mohankalburgi/Downloads/swar-yoga-latest-latest-prod-version"
BACKEND_PID_FILE="/tmp/swar-backend.pid"
FRONTEND_PID_FILE="/tmp/swar-frontend.pid"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$HEALTH_LOG"
    echo -e "$2$1$NC"
}

# Function to start backend
start_backend() {
    if [ ! -f "$BACKEND_PID_FILE" ] || ! kill -0 "$(cat $BACKEND_PID_FILE)" 2>/dev/null; then
        log_message "Starting backend server..." "$BLUE"
        cd "$PROJECT_ROOT/server"
        nohup npm run dev > "$BACKEND_LOG" 2>&1 &
        echo $! > "$BACKEND_PID_FILE"
        sleep 3
        log_message "Backend started with PID: $(cat $BACKEND_PID_FILE)" "$GREEN"
    else
        log_message "Backend already running (PID: $(cat $BACKEND_PID_FILE))" "$GREEN"
    fi
}

# Function to start frontend
start_frontend() {
    if [ ! -f "$FRONTEND_PID_FILE" ] || ! kill -0 "$(cat $FRONTEND_PID_FILE)" 2>/dev/null; then
        log_message "Starting frontend server..." "$BLUE"
        cd "$PROJECT_ROOT"
        nohup npm run dev > "$FRONTEND_LOG" 2>&1 &
        echo $! > "$FRONTEND_PID_FILE"
        sleep 3
        log_message "Frontend started with PID: $(cat $FRONTEND_PID_FILE)" "$GREEN"
    else
        log_message "Frontend already running (PID: $(cat $FRONTEND_PID_FILE))" "$GREEN"
    fi
}

# Function to check server health
check_health() {
    log_message "Checking server health..." "$YELLOW"
    
    # Check backend
    if curl -s --connect-timeout 2 http://localhost:4000/api/contact/messages > /dev/null 2>&1; then
        log_message "✅ Backend (port 4000) is healthy" "$GREEN"
    else
        log_message "❌ Backend (port 4000) is DOWN - restarting..." "$RED"
        kill "$(cat $BACKEND_PID_FILE)" 2>/dev/null || true
        sleep 1
        start_backend
    fi
    
    # Check frontend
    if curl -s --connect-timeout 2 http://localhost:5174 > /dev/null 2>&1; then
        log_message "✅ Frontend (port 5174) is healthy" "$GREEN"
    else
        log_message "❌ Frontend (port 5174) is DOWN - restarting..." "$RED"
        kill "$(cat $FRONTEND_PID_FILE)" 2>/dev/null || true
        sleep 1
        start_frontend
    fi
}

# Function to perform MongoDB backup
backup_mongodb() {
    BACKUP_TIME=$(date '+%Y-%m-%d_%H-%M-%S')
    log_message "Starting MongoDB backup at $BACKUP_TIME..." "$BLUE"
    
    # Create backup directory
    BACKUP_DIR="$PROJECT_ROOT/backups/mongodb"
    mkdir -p "$BACKUP_DIR"
    
    # Get the latest backup (if exists)
    LATEST_BACKUP="$BACKUP_DIR/backup_latest.json"
    
    # Export all collections from MongoDB
    mongodump \
        --uri "mongodb://admin:MySecurePass123@157.173.221.234:27017/swar_yoga?authSource=admin" \
        --out "$BACKUP_DIR/dump_$BACKUP_TIME" \
        >> "$BACKUP_LOG" 2>&1
    
    if [ $? -eq 0 ]; then
        log_message "✅ MongoDB backup completed successfully: dump_$BACKUP_TIME" "$GREEN"
        
        # Create a summary file with backup metadata
        echo "Backup Time: $BACKUP_TIME" > "$BACKUP_DIR/BACKUP_INFO.txt"
        echo "Database: swar_yoga" >> "$BACKUP_DIR/BACKUP_INFO.txt"
        echo "Location: $BACKUP_DIR/dump_$BACKUP_TIME" >> "$BACKUP_DIR/BACKUP_INFO.txt"
        echo "Size: $(du -sh $BACKUP_DIR/dump_$BACKUP_TIME | cut -f1)" >> "$BACKUP_DIR/BACKUP_INFO.txt"
    else
        log_message "❌ MongoDB backup failed - check $BACKUP_LOG for details" "$RED"
    fi
}

# Function to clean old backups (keep only last 7 days)
cleanup_old_backups() {
    BACKUP_DIR="$PROJECT_ROOT/backups/mongodb"
    if [ -d "$BACKUP_DIR" ]; then
        find "$BACKUP_DIR" -maxdepth 1 -type d -name "dump_*" -mtime +7 -exec rm -rf {} \; 2>/dev/null || true
        log_message "Cleaned backups older than 7 days" "$YELLOW"
    fi
}

# Main health check loop
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    Swar Yoga Auto-Start & Health Check Service             ${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Configuration:"
echo "  • Health check interval: 30 minutes"
echo "  • Daily backup: Every 24 hours at startup"
echo "  • Backend port: 4000"
echo "  • Frontend port: 5174"
echo "  • Logs: $LOG_DIR"
echo ""
log_message "Service started" "$GREEN"

# Initial startup
start_backend
start_frontend

# Variables for backup scheduling
LAST_BACKUP_DATE=$(date '+%Y-%m-%d')
HEALTH_CHECK_COUNTER=0

# Main loop
while true; do
    # Wait 30 minutes (1800 seconds)
    sleep 1800
    
    # Increment health check counter
    ((HEALTH_CHECK_COUNTER++))
    
    # Check health every 30 minutes
    check_health
    
    # Perform daily backup at first health check of the day
    CURRENT_DATE=$(date '+%Y-%m-%d')
    if [ "$CURRENT_DATE" != "$LAST_BACKUP_DATE" ]; then
        log_message "Daily backup time reached" "$YELLOW"
        backup_mongodb
        cleanup_old_backups
        LAST_BACKUP_DATE="$CURRENT_DATE"
    fi
    
    # Log status
    log_message "Health check #$HEALTH_CHECK_COUNTER completed" "$BLUE"
done
