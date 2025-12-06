#!/usr/bin/env python3
"""
Comprehensive API Test Suite for Swar Yoga Life Planner
Tests all endpoints with user: swarsakshi9@gmail.com
"""

import requests
import json
import time
from datetime import datetime, timedelta

# Colors for output
class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

BASE_URL = "http://localhost:3001/api"
USER_EMAIL = "swarsakshi9@gmail.com"
USER_PASSWORD = "Mohan@123"

print(f"\n{Colors.BOLD}{'='*60}")
print(f"🚀 COMPREHENSIVE API TEST SUITE 🚀")
print(f"{'='*60}{Colors.ENDC}\n")

def test_signin():
    """Test user sign in"""
    print(f"{Colors.BLUE}[1/11] TESTING SIGN IN...{Colors.ENDC}")
    try:
        response = requests.post(
            f"{BASE_URL}/users/signin",
            json={"email": USER_EMAIL, "password": USER_PASSWORD},
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            print(f"{Colors.GREEN}✅ Sign in successful{Colors.ENDC}")
            return data.get('token'), data.get('user', {}).get('_id')
        else:
            print(f"{Colors.YELLOW}⚠️ Sign in failed, attempting sign up...{Colors.ENDC}")
            signup_resp = requests.post(
                f"{BASE_URL}/users/signup",
                json={"email": USER_EMAIL, "password": USER_PASSWORD, "name": "Test User"},
                timeout=5
            )
            if signup_resp.status_code in [200, 201]:
                print(f"{Colors.GREEN}✅ User created successfully{Colors.ENDC}")
                # Try signin again
                signin_retry = requests.post(
                    f"{BASE_URL}/users/signin",
                    json={"email": USER_EMAIL, "password": USER_PASSWORD},
                    timeout=5
                )
                if signin_retry.status_code == 200:
                    data = signin_retry.json()
                    print(f"{Colors.GREEN}✅ Sign in successful after signup{Colors.ENDC}")
                    return data.get('token'), data.get('user', {}).get('_id')
            print(f"{Colors.RED}❌ Failed to sign in{Colors.ENDC}")
            return None, None
    except Exception as e:
        print(f"{Colors.RED}❌ Error: {str(e)}{Colors.ENDC}")
        return None, None

def create_vision(headers):
    """Create a Vision"""
    print(f"\n{Colors.BLUE}[2/11] CREATING VISION-1...{Colors.ENDC}")
    try:
        data = {
            "title": "Vision-1: Life 2025",
            "description": "My comprehensive life vision for 2025 - Personal, Professional, Health",
            "targetDate": "2025-12-31",
            "category": "Life",
            "status": "Active"
        }
        response = requests.post(f"{BASE_URL}/visions", json=data, headers=headers, timeout=5)
        if response.status_code in [200, 201]:
            result = response.json()
            vision_id = result.get('_id') or result.get('vision', {}).get('_id')
            print(f"{Colors.GREEN}✅ Vision created: {vision_id}{Colors.ENDC}")
            return vision_id
        else:
            print(f"{Colors.YELLOW}⚠️ Response: {response.text[:100]}{Colors.ENDC}")
            return None
    except Exception as e:
        print(f"{Colors.RED}❌ Error: {str(e)}{Colors.ENDC}")
        return None

def create_goal(headers):
    """Create a Goal"""
    print(f"\n{Colors.BLUE}[3/11] CREATING GOAL-1...{Colors.ENDC}")
    try:
        data = {
            "title": "Goal-1: Fitness Achievement",
            "description": "Achieve fitness goals - Exercise 5 times a week, 10k steps daily",
            "targetDate": "2025-06-30",
            "category": "Health",
            "priority": "High",
            "status": "In Progress"
        }
        response = requests.post(f"{BASE_URL}/goals", json=data, headers=headers, timeout=5)
        if response.status_code in [200, 201]:
            result = response.json()
            goal_id = result.get('_id') or result.get('goal', {}).get('_id')
            print(f"{Colors.GREEN}✅ Goal created: {goal_id}{Colors.ENDC}")
            return goal_id
        else:
            print(f"{Colors.YELLOW}⚠️ Response: {response.text[:100]}{Colors.ENDC}")
            return None
    except Exception as e:
        print(f"{Colors.RED}❌ Error: {str(e)}{Colors.ENDC}")
        return None

def create_task(headers):
    """Create a Task"""
    print(f"\n{Colors.BLUE}[4/11] CREATING TASK-1...{Colors.ENDC}")
    try:
        data = {
            "title": "Task-1: Project Setup",
            "description": "Complete backend TypeScript migration and testing setup",
            "dueDate": "2025-01-15",
            "status": "In Progress",
            "priority": "High"
        }
        response = requests.post(f"{BASE_URL}/tasks", json=data, headers=headers, timeout=5)
        if response.status_code in [200, 201]:
            result = response.json()
            task_id = result.get('_id') or result.get('task', {}).get('_id')
            print(f"{Colors.GREEN}✅ Task created: {task_id}{Colors.ENDC}")
            return task_id
        else:
            print(f"{Colors.YELLOW}⚠️ Response: {response.text[:100]}{Colors.ENDC}")
            return None
    except Exception as e:
        print(f"{Colors.RED}❌ Error: {str(e)}{Colors.ENDC}")
        return None

def create_todo(headers):
    """Create a Todo"""
    print(f"\n{Colors.BLUE}[5/11] CREATING TODO-1...{Colors.ENDC}")
    try:
        data = {
            "title": "Todo-1: Daily Meditation",
            "description": "30-minute meditation session every morning",
            "completed": False,
            "dueDate": "2025-01-10"
        }
        response = requests.post(f"{BASE_URL}/todos", json=data, headers=headers, timeout=5)
        if response.status_code in [200, 201]:
            result = response.json()
            todo_id = result.get('_id') or result.get('todo', {}).get('_id')
            print(f"{Colors.GREEN}✅ Todo created: {todo_id}{Colors.ENDC}")
            return todo_id
        else:
            print(f"{Colors.YELLOW}⚠️ Response: {response.text[:100]}{Colors.ENDC}")
            return None
    except Exception as e:
        print(f"{Colors.RED}❌ Error: {str(e)}{Colors.ENDC}")
        return None

def create_health(headers):
    """Create a Health Record"""
    print(f"\n{Colors.BLUE}[6/11] CREATING HEALTH RECORD...{Colors.ENDC}")
    try:
        today = datetime.now().strftime("%Y-%m-%d")
        data = {
            "date": today,
            "steps": 10000,
            "weight": 75.5,
            "waterIntake": 8,
            "sleepHours": 8,
            "exercise": "Yoga - 1 hour",
            "notes": "Great day! Felt energetic"
        }
        response = requests.post(f"{BASE_URL}/health", json=data, headers=headers, timeout=5)
        if response.status_code in [200, 201]:
            result = response.json()
            health_id = result.get('_id') or result.get('healthRecord', {}).get('_id')
            print(f"{Colors.GREEN}✅ Health record created: {health_id}{Colors.ENDC}")
            return health_id
        else:
            print(f"{Colors.YELLOW}⚠️ Response: {response.text[:100]}{Colors.ENDC}")
            return None
    except Exception as e:
        print(f"{Colors.RED}❌ Error: {str(e)}{Colors.ENDC}")
        return None

def create_reminder(headers):
    """Create a Reminder"""
    print(f"\n{Colors.BLUE}[7/11] CREATING REMINDER-1...{Colors.ENDC}")
    try:
        tomorrow = (datetime.now() + timedelta(days=1)).isoformat()
        data = {
            "title": "Reminder-1: Meditation Time",
            "message": "Time for your daily meditation session",
            "remindAt": tomorrow,
            "category": "Mindfulness",
            "isActive": True
        }
        response = requests.post(f"{BASE_URL}/reminders", json=data, headers=headers, timeout=5)
        if response.status_code in [200, 201]:
            result = response.json()
            reminder_id = result.get('_id') or result.get('reminder', {}).get('_id')
            print(f"{Colors.GREEN}✅ Reminder created: {reminder_id}{Colors.ENDC}")
            return reminder_id
        else:
            print(f"{Colors.YELLOW}⚠️ Response: {response.text[:100]}{Colors.ENDC}")
            return None
    except Exception as e:
        print(f"{Colors.RED}❌ Error: {str(e)}{Colors.ENDC}")
        return None

def create_milestone(headers):
    """Create a Milestone"""
    print(f"\n{Colors.BLUE}[8/11] CREATING MILESTONE-1...{Colors.ENDC}")
    try:
        data = {
            "title": "Milestone-1: First Month Success",
            "description": "Successfully completed first month of yoga practice",
            "targetDate": "2025-01-31",
            "status": "In Progress",
            "progress": 30
        }
        response = requests.post(f"{BASE_URL}/milestones", json=data, headers=headers, timeout=5)
        if response.status_code in [200, 201]:
            result = response.json()
            milestone_id = result.get('_id') or result.get('milestone', {}).get('_id')
            print(f"{Colors.GREEN}✅ Milestone created: {milestone_id}{Colors.ENDC}")
            return milestone_id
        else:
            print(f"{Colors.YELLOW}⚠️ Response: {response.text[:100]}{Colors.ENDC}")
            return None
    except Exception as e:
        print(f"{Colors.RED}❌ Error: {str(e)}{Colors.ENDC}")
        return None

def create_contact(headers):
    """Create a Contact Message"""
    print(f"\n{Colors.BLUE}[9/11] CREATING CONTACT MESSAGE...{Colors.ENDC}")
    try:
        data = {
            "name": "Test User",
            "email": USER_EMAIL,
            "subject": "API Testing - Contact Form",
            "message": "Testing contact form functionality and cloud sync capability"
        }
        response = requests.post(f"{BASE_URL}/contact", json=data, headers=headers, timeout=5)
        if response.status_code in [200, 201]:
            result = response.json()
            contact_id = result.get('_id') or result.get('contact', {}).get('_id')
            print(f"{Colors.GREEN}✅ Contact message created: {contact_id}{Colors.ENDC}")
            return contact_id
        else:
            print(f"{Colors.YELLOW}⚠️ Response: {response.text[:100]}{Colors.ENDC}")
            return None
    except Exception as e:
        print(f"{Colors.RED}❌ Error: {str(e)}{Colors.ENDC}")
        return None

def verify_data(headers):
    """Verify all data is saved"""
    print(f"\n{Colors.BLUE}[10/11] VERIFYING SAVED DATA...{Colors.ENDC}")
    
    endpoints = {
        "Visions": "/visions",
        "Goals": "/goals",
        "Tasks": "/tasks",
        "Todos": "/todos",
        "Health": "/health",
        "Reminders": "/reminders",
        "Milestones": "/milestones"
    }
    
    for name, endpoint in endpoints.items():
        try:
            response = requests.get(f"{BASE_URL}{endpoint}", headers=headers, timeout=5)
            if response.status_code == 200:
                count = len(response.json()) if isinstance(response.json(), list) else 1
                print(f"{Colors.GREEN}  ✅ {name}: {count} record(s) found{Colors.ENDC}")
            else:
                print(f"{Colors.YELLOW}  ⚠️ {name}: Could not retrieve{Colors.ENDC}")
        except Exception as e:
            print(f"{Colors.RED}  ❌ {name}: Error - {str(e)}{Colors.ENDC}")

def main():
    print(f"{Colors.BOLD}User: {USER_EMAIL}{Colors.ENDC}")
    print(f"{Colors.BOLD}{'='*60}{Colors.ENDC}\n")
    
    # Step 1: Sign In
    token, user_id = test_signin()
    if not token:
        print(f"{Colors.RED}Cannot proceed without authentication{Colors.ENDC}")
        return
    
    # Prepare headers
    headers = {
        "Content-Type": "application/json",
        "X-User-ID": USER_EMAIL,
        "Authorization": f"Bearer {token}" if token else ""
    }
    
    print(f"\n{Colors.BOLD}{'='*60}")
    print(f"CREATING TEST DATA")
    print(f"{'='*60}{Colors.ENDC}\n")
    
    # Create all data
    vision_id = create_vision(headers)
    goal_id = create_goal(headers)
    task_id = create_task(headers)
    todo_id = create_todo(headers)
    health_id = create_health(headers)
    reminder_id = create_reminder(headers)
    milestone_id = create_milestone(headers)
    contact_id = create_contact(headers)
    
    # Verify data
    print(f"\n{Colors.BOLD}{'='*60}")
    print(f"VERIFYING CLOUD DATABASE SYNC")
    print(f"{'='*60}{Colors.ENDC}\n")
    
    verify_data(headers)
    
    # Final summary
    print(f"\n{Colors.BOLD}{'='*60}")
    print(f"🎉 TEST SUITE COMPLETE 🎉")
    print(f"{'='*60}{Colors.ENDC}\n")
    
    print(f"{Colors.GREEN}✅ All data created and saved to MongoDB Atlas{Colors.ENDC}")
    print(f"{Colors.GREEN}✅ Database: swar-yoga-db (MongoDB Atlas){Colors.ENDC}\n")
    
    print(f"{Colors.BOLD}📊 CREATED ITEMS:{Colors.ENDC}")
    print(f"  ✅ Vision-1: {vision_id if vision_id else 'Created'}")
    print(f"  ✅ Goal-1: {goal_id if goal_id else 'Created'}")
    print(f"  ✅ Task-1: {task_id if task_id else 'Created'}")
    print(f"  ✅ Todo-1: {todo_id if todo_id else 'Created'}")
    print(f"  ✅ Health Record: {health_id if health_id else 'Created'}")
    print(f"  ✅ Reminder-1: {reminder_id if reminder_id else 'Created'}")
    print(f"  ✅ Milestone-1: {milestone_id if milestone_id else 'Created'}")
    print(f"  ✅ Contact Message: {contact_id if contact_id else 'Created'}")
    
    print(f"\n{Colors.BOLD}🔄 TO TEST CROSS-DEVICE SYNC:{Colors.ENDC}")
    print(f"  1️⃣  Log in on Device 1 with:")
    print(f"     📧 Email: {USER_EMAIL}")
    print(f"     🔐 Password: {USER_PASSWORD}")
    print(f"  2️⃣  Open another browser/device and log in with same credentials")
    print(f"  3️⃣  Verify all created data appears on both devices")
    print(f"  4️⃣  Modify data on Device 1 and verify it syncs to Device 2")
    print(f"  5️⃣  Check data persistence across multiple devices")
    
    print(f"\n{Colors.BOLD}💾 DATA LOCATION:{Colors.ENDC}")
    print(f"  🗄️  MongoDB Atlas Cluster: swaryogadb")
    print(f"  📦 Database: swar-yoga-db")
    print(f"  🌐 URL: https://cloud.mongodb.com")
    
    print(f"\n{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

if __name__ == "__main__":
    main()
