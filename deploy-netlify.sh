#!/bin/bash

# 🚀 Netlify Deployment Script for Swar Yoga Life Planner

echo "🚀 Starting Netlify Deployment Process..."
echo "=========================================="
echo ""

# Step 1: Build the frontend
echo "📦 Step 1: Building frontend..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi
echo "✅ Build successful!"
echo ""

# Step 2: Check build output
echo "📊 Step 2: Checking build output..."
if [ -d "dist" ]; then
  SIZE=$(du -sh dist/ | cut -f1)
  echo "✅ Build folder: dist/ ($SIZE)"
else
  echo "❌ Build folder not found!"
  exit 1
fi
echo ""

# Step 3: Check for required files
echo "📋 Step 3: Verifying deployment files..."
files=("netlify.toml" ".env.example" "package.json" "dist/index.html")
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file found"
  else
    echo "⚠️  $file missing (might be needed)"
  fi
done
echo ""

# Step 4: Git status
echo "📝 Step 4: Checking Git status..."
if [ -n "$(git status -s)" ]; then
  echo "⚠️  Uncommitted changes found:"
  git status -s
  echo ""
  read -p "Commit changes? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git add -A
    git commit -m "🚀 Prepare for Netlify deployment"
  fi
fi
echo ""

# Step 5: Show deployment instructions
echo "🎯 Ready for Deployment!"
echo "=========================================="
echo ""
echo "Option 1: Automatic Deployment (Recommended)"
echo "  1. Push to GitHub: git push origin main"
echo "  2. Netlify will auto-deploy"
echo ""
echo "Option 2: Manual Deployment on Netlify"
echo "  1. Go to https://app.netlify.com"
echo "  2. Create new site from Git"
echo "  3. Select repository: swar-yoga-dec"
echo "  4. Set environment variables:"
echo "     - VITE_API_URL = your-backend-url"
echo "     - REACT_APP_API_URL = your-backend-url"
echo "  5. Deploy!"
echo ""
echo "Option 3: Deploy with Netlify CLI"
echo "  1. npm install -g netlify-cli"
echo "  2. netlify deploy"
echo ""
echo "=========================================="
echo ""
echo "✅ Deployment preparation complete!"
