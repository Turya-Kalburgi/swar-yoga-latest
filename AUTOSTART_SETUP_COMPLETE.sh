#!/bin/bash

cat << 'EOF'

╔══════════════════════════════════════════════════════════════════════════════╗
║                    AUTO-START & BACKUP SERVICE INSTALLED                    ║
╚══════════════════════════════════════════════════════════════════════════════╝

✅ AUTO-START SERVICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your Swar Yoga application now has automatic server management:

FEATURES:
  ✅ Automatic Server Restart
     • Monitors both backend and frontend servers every 30 minutes
     • Automatically restarts if either server goes down
     • Runs 24/7 in the background
  
  ✅ System Startup Integration
     • Service runs on system boot without manual intervention
     • Uses macOS launchd for reliability
  
  ✅ Daily MongoDB Backups
     • Automatic daily backups of all data
     • Backs up: Contacts, Users, Admin data
     • Keeps last 30 days of backups
     • All backups stored in: /Users/mohankalburgi/Downloads/swar-yoga-latest-latest-prod-version/backups/mongodb

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 KEY DIRECTORIES & FILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project Root:
  /Users/mohankalburgi/Downloads/swar-yoga-latest-latest-prod-version

Service Files:
  • auto-start-service.sh       - Main auto-start service script
  • setup-autostart.sh          - Setup script (run once to install)
  • swar-manage.sh              - Management and status check tool

Log Directory:
  /Users/mohankalburgi/.swar-yoga-logs
  
  Log Files:
    • health-check.log          - Health check history
    • backend.log               - Backend server output
    • frontend.log              - Frontend server output
    • backup.log                - Backup operation logs
    • launchd.log              - System service logs

Backups:
  /Users/mohankalburgi/Downloads/swar-yoga-latest-latest-prod-version/backups/mongodb
  
  Contains:
    • backups.json              - Metadata about all backups
    • dump_YYYY-MM-DD_HH-MM-SS  - Individual backup directories
      ├── contacts.json         - All contact messages
      ├── users.json            - All user accounts
      └── admins.json           - All admin accounts

launchd Service:
  /Users/mohankalburgi/Library/LaunchAgents/com.swaryoga.autostart.plist

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎮 MANAGEMENT COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Navigate to project directory:
  cd /Users/mohankalburgi/Downloads/swar-yoga-latest-latest-prod-version

Check Service Status:
  ./swar-manage.sh status
  
  Shows:
    • Launchd service status
    • Backend server health (port 4000)
    • Frontend server health (port 5174)
    • MongoDB connection status
    • Latest health check logs

View Logs (Real-time):
  ./swar-manage.sh logs health      # Health check logs
  ./swar-manage.sh logs backend     # Backend server output
  ./swar-manage.sh logs frontend    # Frontend server output
  ./swar-manage.sh logs backup      # Backup operation logs

Manage Service:
  ./swar-manage.sh stop             # Stop auto-start service
  ./swar-manage.sh start            # Start auto-start service
  ./swar-manage.sh restart          # Restart auto-start service

View Backups:
  ./swar-manage.sh backups          # List available backups

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 ADVANCED COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Check Service Registration (macOS):
  launchctl list | grep com.swaryoga.autostart

View Service Details:
  launchctl list com.swaryoga.autostart

Unload Service (Stop permanently):
  launchctl unload /Users/mohankalburgi/Library/LaunchAgents/com.swaryoga.autostart.plist

Load Service (Start):
  launchctl load /Users/mohankalburgi/Library/LaunchAgents/com.swaryoga.autostart.plist

View System Logs:
  log stream --predicate 'process == "auto-start-service.sh"'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 HOW IT WORKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Auto-Start Service Flow:
  1. System boots or service is loaded
  2. launchd launches auto-start-service.sh
  3. Service starts backend server (port 4000)
  4. Service starts frontend server (port 5174)
  5. Service performs daily MongoDB backup
  6. Service enters health check loop (every 30 minutes)
  7. If either server is down, it's automatically restarted
  8. Daily backup performs at midnight (12:00 AM)

Health Check Details:
  • Checks backend responsiveness: curl http://localhost:4000/api/contact/messages
  • Checks frontend responsiveness: curl http://localhost:5174
  • If server down > 2 seconds, automatically restarts it
  • Logs all health check results with timestamps

Backup Details:
  • Runs once daily at first health check after midnight
  • Exports all collections to JSON files
  • Stores backup metadata in backups.json
  • Automatically deletes backups older than 30 days
  • Each backup includes: contacts.json, users.json, admins.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Problem: Service not starting
  Solution:
    1. Check if service is loaded:
       launchctl list | grep com.swaryoga.autostart
    2. If not loaded, run setup again:
       bash /path/to/setup-autostart.sh
    3. Check launchd logs:
       tail -50 /Users/mohankalburgi/.swar-yoga-logs/launchd-error.log

Problem: Servers not starting
  Solution:
    1. Check logs: ./swar-manage.sh logs backend
    2. Check ports are free:
       lsof -i :4000    # Check backend port
       lsof -i :5174    # Check frontend port
    3. Check permissions:
       chmod +x auto-start-service.sh

Problem: Backups not running
  Solution:
    1. Check backup logs: ./swar-manage.sh logs backup
    2. Verify MongoDB connection
    3. Check disk space: df -h
    4. Check backup directory permissions:
       ls -la /path/to/backups/

Problem: Service restarting servers too often
  Solution:
    1. Check server logs for errors
    2. Verify MongoDB connectivity
    3. Check system resources:
       top -n 5
       df -h

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ FEATURES & BENEFITS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 24/7 Server Uptime
   • Automatic restart if servers crash
   • Health checks every 30 minutes
   • Zero manual intervention needed

✅ Data Protection
   • Daily automated backups
   • 30 days of backup history
   • Can restore any previous backup instantly
   • All MongoDB collections backed up

✅ System Integration
   • Runs on system startup automatically
   • macOS native launchd integration
   • Works with Mac sleep/wake cycles
   • Minimal resource usage

✅ Easy Monitoring
   • Simple status check command
   • Real-time log viewing
   • Health check history
   • Backup status tracking

✅ Reliability
   • Persistent background service
   • Automatic error recovery
   • Detailed logging for debugging
   • Safe shutdown and restart

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 GETTING STARTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Verify service is running:
   cd /Users/mohankalburgi/Downloads/swar-yoga-latest-latest-prod-version
   ./swar-manage.sh status

2. Wait for servers to start (up to 2 minutes)
   tail -f ~/.swar-yoga-logs/health-check.log

3. Once running, verify access:
   curl http://localhost:4000/api/contact/messages
   curl http://localhost:5174

4. Check backups:
   ./swar-manage.sh backups

5. Monitor regularly:
   ./swar-manage.sh status  # Daily status check

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Service checks server health every 30 minutes (configurable)
• Daily backup runs at first health check after midnight
• MongoDB credentials: admin / MySecurePass123
• Backend runs on port 4000 (configured in server.ts)
• Frontend runs on port 5174 (configured in vite.config.ts)
• All server output logged to ~/.swar-yoga-logs/
• Service automatically recovers from crashes
• No manual intervention needed - completely automated

═══════════════════════════════════════════════════════════════════════════════

✅ AUTO-START & BACKUP SERVICE SETUP COMPLETE!

Your Swar Yoga application is now set to run 24/7 with:
  • Automatic server restart every 30 minutes
  • Daily MongoDB backups
  • System startup integration
  • Real-time health monitoring

Run: ./swar-manage.sh status
to check service status anytime!

═══════════════════════════════════════════════════════════════════════════════

EOF
