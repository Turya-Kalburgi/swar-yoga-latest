#!/bin/bash

# Vercel Deployment Setup & Guide
# ================================

echo "🚀 Vercel Deployment Setup"
echo "============================"
echo ""

# Step 1: Check if Vercel CLI is installed
echo "1️⃣ Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI globally..."
    npm install -g vercel
else
    echo "✅ Vercel CLI already installed"
fi

# Step 2: Verify build works locally
echo ""
echo "2️⃣ Building project locally (this may take a moment)..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Fix errors before deploying."
    exit 1
fi

# Step 3: Git commit and push
echo ""
echo "3️⃣ Committing changes to Git..."
git add -A
git commit -m "chore: Enable PM2 auto-restart and prepare Vercel deployment"
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Changes pushed to GitHub"
else
    echo "⚠️ Git push completed with warnings"
fi

# Step 4: Deploy to Vercel
echo ""
echo "4️⃣ Deploying to Vercel..."
echo ""
echo "ℹ️ Follow these steps:"
echo "  - Select 'swar-yoga-dec1' project (or create new)"
echo "  - Framework: Vite"
echo "  - Root Directory: ./ (or let Vercel auto-detect)"
echo "  - Build Command: npm run build"
echo "  - Output Directory: dist"
echo "  - Environment Variables:"
echo "    • MONGODB_URI: <your-mongodb-connection-string>"
echo "    • NODE_ENV: production"
echo ""

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment to Vercel successful!"
    echo ""
    echo "🌍 Your app is now live at: https://swar-yoga-dec1.vercel.app"
else
    echo "❌ Vercel deployment failed. Check errors above."
    exit 1
fi

echo ""
echo "📋 Next Steps:"
echo "  1. Verify deployment at https://swar-yoga-dec1.vercel.app"
echo "  2. Check frontend logs in Vercel Dashboard"
echo "  3. Verify API endpoints are working"
echo "  4. Test user login and data persistence"
echo ""
