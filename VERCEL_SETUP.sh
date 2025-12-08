#!/bin/bash

# Swar Yoga Life Planner - Vercel Deployment Setup
# This script will set up git and prepare your project for Vercel deployment

echo "🚀 Swar Yoga Life Planner - Vercel Setup"
echo "========================================"
echo ""

# Step 1: Initialize git (if not already)
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✓ Git initialized"
else
    echo "✓ Git repository already exists"
fi

# Step 2: Add all files
echo ""
echo "📝 Adding files to git..."
git add .
echo "✓ Files added"

# Step 3: Create initial commit
echo ""
echo "�� Creating initial commit..."
git commit -m "Initial commit - Swar Yoga Life Planner Ready for Deployment" || true
echo "✓ Initial commit created"

# Step 4: Instructions for GitHub
echo ""
echo "================================"
echo "✅ Next Steps for Vercel:"
echo "================================"
echo ""
echo "1️⃣  Create a GitHub Repository:"
echo "   • Go to: https://github.com/new"
echo "   • Create new repository (e.g., 'swar-yoga-life-planner')"
echo "   • Copy the repository URL"
echo ""
echo "2️⃣  Connect your local repository:"
echo "   git remote add origin <PASTE_YOUR_GITHUB_URL_HERE>"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3️⃣  Deploy to Vercel:"
echo "   • Go to: https://vercel.com/dashboard"
echo "   • Click 'Add New' → 'Project'"
echo "   • Click 'Import Git Repository'"
echo "   • Select your GitHub repository"
echo ""
echo "4️⃣  Configure Environment Variables in Vercel:"
echo "   MONGODB_URI=mongodb://admin:MySecurePass123@157.173.221.234:27017/?authSource=admin"
echo "   PORT=4000"
echo ""
echo "5️⃣  Deploy!"
echo ""
echo "================================"
echo "🎉 Ready for Deployment!"
echo "================================"
