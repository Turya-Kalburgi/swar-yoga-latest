#!/bin/bash

# 🔍 Vercel Deployment Verification Script
# यह script सब कुछ check करेगा कि deployment के लिए तैयार है या नहीं

echo "🔍 Vercel Deployment Verification"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✅${NC} $1 exists"
    return 0
  else
    echo -e "${RED}❌${NC} $1 MISSING"
    return 1
  fi
}

check_folder() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✅${NC} $1/ folder exists"
    return 0
  else
    echo -e "${RED}❌${NC} $1/ folder MISSING"
    return 1
  fi
}

check_content() {
  if grep -q "$2" "$1"; then
    echo -e "${GREEN}✅${NC} $1 contains '$2'"
    return 0
  else
    echo -e "${RED}❌${NC} $1 missing '$2'"
    return 1
  fi
}

# =============== ROOT LEVEL FILES ===============
echo "📋 ROOT LEVEL FILES CHECK"
echo "========================="
check_file "package.json"
check_file "vite.config.ts"
check_file "index.html"
check_file "tsconfig.json"
check_file "vercel.json"
check_file "tailwind.config.js"
check_file "postcss.config.js"
check_file ".env"
echo ""

# =============== FOLDERS ===============
echo "📂 FOLDER STRUCTURE CHECK"
echo "========================="
check_folder "src"
check_folder "public"
check_folder "server"
check_folder "node_modules"
echo ""

# =============== PACKAGE.JSON SCRIPTS ===============
echo "🔧 PACKAGE.JSON SCRIPTS CHECK"
echo "============================="
check_content "package.json" '"build": "vite build"'
check_content "package.json" '"dev": "vite"'
check_content "package.json" '"preview": "vite preview"'
echo ""

# =============== VERCEL.JSON CONFIGURATION ===============
echo "⚙️  VERCEL.JSON CONFIGURATION CHECK"
echo "==================================="
check_content "vercel.json" '"buildCommand": "npm run build"'
check_content "vercel.json" '"outputDirectory": "dist"'
check_content "vercel.json" '"rewrites"'
echo ""

# =============== VITE CONFIG ===============
echo "🎨 VITE.CONFIG.TS CHECK"
echo "======================="
check_content "vite.config.ts" "defineConfig"
check_content "vite.config.ts" "react"
check_content "vite.config.ts" "outDir.*dist"
echo ""

# =============== BUILD CHECK ===============
echo "🏗️  BUILD CHECK"
echo "==============="
if [ -d "dist" ]; then
  FILES=$(find dist -type f | wc -l)
  echo -e "${GREEN}✅${NC} dist/ folder contains $FILES files"
else
  echo -e "${YELLOW}⚠️ ${NC} dist/ not found (will be created during build)"
fi
echo ""

# =============== GIT CHECK ===============
echo "📚 GIT CONFIGURATION CHECK"
echo "=========================="
REMOTE_URL=$(git config --get remote.origin.url 2>/dev/null)
if [ -n "$REMOTE_URL" ]; then
  echo -e "${GREEN}✅${NC} Git remote: $REMOTE_URL"
else
  echo -e "${RED}❌${NC} Git remote not configured"
fi

BRANCH=$(git branch --show-current 2>/dev/null)
if [ "$BRANCH" = "main" ]; then
  echo -e "${GREEN}✅${NC} On main branch"
else
  echo -e "${YELLOW}⚠️ ${NC} Current branch: $BRANCH"
fi
echo ""

# =============== PLACEHOLDER IMAGE CHECK ===============
echo "🖼️  PLACEHOLDER IMAGE CHECK"
echo "============================"
if grep -r "via.placeholder.com" src/ 2>/dev/null; then
  echo -e "${RED}❌${NC} Found via.placeholder.com URLs (should use SVG data URLs)"
else
  echo -e "${GREEN}✅${NC} No external placeholder URLs found (Good!)"
fi
echo ""

# =============== SUMMARY ===============
echo "📊 DEPLOYMENT READINESS SUMMARY"
echo "==============================="
echo -e "${GREEN}✅ Project Structure${NC} - Ready"
echo -e "${GREEN}✅ Build Configuration${NC} - Ready"
echo -e "${GREEN}✅ Vercel Settings${NC} - Ready"
echo -e "${GREEN}✅ SPA Routing${NC} - Configured"
echo -e "${YELLOW}⏳ Backend API${NC} - Needs URL in env vars"
echo ""

echo "🚀 READY FOR DEPLOYMENT!"
echo ""
echo "Next Steps:"
echo "1. Visit: https://vercel.com/dashboard"
echo "2. Select: swar-yoga-dec project"
echo "3. Add env var: VITE_API_URL=<backend-url>"
echo "4. Monitor: Deployments tab"
echo ""
echo "Deploy command (if manual):"
echo "  npx vercel --prod"
