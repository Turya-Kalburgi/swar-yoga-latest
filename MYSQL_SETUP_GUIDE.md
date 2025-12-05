# MySQL Integration Guide for Sadhaka Planner

## Overview

The Sadhaka Planner now supports both **localStorage** (client-side) and **MySQL** (server-side) for data persistence. You can choose which one to use based on your needs.

## Storage Options

### 1. localStorage (Current Default)
- **Pros**: No backend required, instant sync, offline-ready, easy setup
- **Cons**: Data stored locally only, not shared across devices
- **Use Case**: Development, single-user, offline-first apps

### 2. MySQL Database (New!)
- **Pros**: Persistent cloud storage, multi-device sync, team collaboration, data backups
- **Cons**: Requires backend server, internet required
- **Use Case**: Production, multi-user, always-online apps

## Quick Start: Local Development

### 1. Install and Start MySQL
```bash
# macOS with Homebrew
brew install mysql
brew services start mysql

# or via Docker
docker run --name mysql-sadhaka -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0
```

### 2. Create Database
```bash
mysql -u root -p < server/database.sql
```

### 3. Configure Backend
```bash
cd server
cp .env.example .env

# Edit .env:
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=sadhaka_planner
```

### 4. Start Backend
```bash
cd server
npm run dev
# Should show: ✅ MySQL connection successful
```

### 5. Test API
```bash
curl http://localhost:4000/api/health
```

## API Endpoints

All endpoints require userId for user-scoped queries:

### Visions
- `GET /api/sadhaka/visions/:userId`
- `POST /api/sadhaka/visions`
- `PUT /api/sadhaka/visions/:id`
- `DELETE /api/sadhaka/visions/:id`

### Goals
- `GET /api/sadhaka/goals/:userId`
- `POST /api/sadhaka/goals`
- `PUT /api/sadhaka/goals/:id`
- `DELETE /api/sadhaka/goals/:id`

### Tasks
- `GET /api/sadhaka/tasks/:userId`
- `POST /api/sadhaka/tasks`
- `PUT /api/sadhaka/tasks/:id`
- `DELETE /api/sadhaka/tasks/:id`

### My Words
- `GET /api/sadhaka/mywords/:userId`
- `POST /api/sadhaka/mywords`
- `PUT /api/sadhaka/mywords/:id`
- `DELETE /api/sadhaka/mywords/:id`

### Todos, Reminders, Milestones
Similar patterns as above.

## Production Deployment

### On Render.com

1. Create MySQL database on Render
2. Run: `mysql -h[host] -u[user] -p[password] -D[database] < server/database.sql`
3. Set environment variables in Render dashboard
4. Deploy: `git push origin main`

## Database Tables

- **users** - User information
- **visions** - Life visions
- **goals** - Goals with progress tracking
- **milestones** - Goal milestones
- **tasks** - Daily tasks
- **my_words** - Commitments
- **todos** - Quick todos
- **reminders** - Reminders
- **daily_plans** - Daily routine
- **health_trackers** - Health metrics

## Troubleshooting

### Connection Refused
- MySQL not running: `brew services start mysql`

### Unknown Database
- Database not created: `mysql -u root -p < server/database.sql`

### API Not Responding
- Backend not running: `cd server && npm run dev`

---

For complete guide, see MYSQL_IMPLEMENTATION_COMPLETE.md
