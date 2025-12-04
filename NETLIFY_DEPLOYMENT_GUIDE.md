# 🚀 SwarYoga Netlify Deployment Guide

## Deploy to swaryoga.com

Complete step-by-step guide to deploy your SwarYoga application to Netlify with your custom domain.

---

## 📋 STEP 1: Prerequisites

### ✅ What You Need:
- [x] GitHub account (already have: github.com/Turya-Kalburgi/swar-yoga-dec)
- [x] Netlify account (create at netlify.com if you don't have one)
- [x] Domain: swaryoga.com (you already own this)
- [x] Code pushed to GitHub (✅ Done - commit b684dcac)

### ✅ What's Already Done:
- [x] netlify.toml file created (build configuration)
- [x] React Router redirects configured (SPA support)
- [x] Environment variables ready
- [x] Build process tested (npm run build works)

---

## 🔧 STEP 2: Deploy to Netlify

### Option A: Connect GitHub (Recommended - Automatic Deploys)

#### **2.1 Go to Netlify**
```
https://app.netlify.com
```

#### **2.2 Click "Add new site" → "Import an existing project"**

#### **2.3 Select GitHub as the git provider**
- Click "GitHub"
- Authorize Netlify to access your GitHub account
- Select your repository: `Turya-Kalburgi/swar-yoga-dec`

#### **2.4 Configure Build Settings**

| Setting | Value |
|---------|-------|
| **Build Command** | `npm run build` |
| **Publish Directory** | `dist` |
| **Node Version** | 20 |

✅ These are already configured in netlify.toml, so Netlify will auto-detect them.

#### **2.5 Click "Deploy site"**

Wait for deployment (usually 1-2 minutes)

---

## 🌐 STEP 3: Connect Custom Domain

### **3.1 After Deployment, Go to Site Settings**

1. Your site URL will be something like: xxx-xxx-xxx.netlify.app
2. Go to Site settings → Domain management

### **3.2 Add Custom Domain**

1. Click "Add domain"
2. Enter your domain: swaryoga.com
3. Click "Verify"

### **3.3 Update DNS Records**

Netlify will provide DNS configuration. Update at your domain registrar.

### **3.4 Enable HTTPS**

Netlify will auto-provision SSL certificate (free)

---

## ⚙️ STEP 4: Environment Variables (If Needed)

No environment variables currently required for frontend deployment.

---

## 🔄 STEP 5: Set Up Automatic Deployments

✅ Already configured! When you push to GitHub:

```bash
git push origin main
```

Netlify automatically deploys within 1-2 minutes!

---

## 🎉 Summary

Your SwarYoga app is ready for production!

✅ Code: Committed and pushed to GitHub
✅ Configuration: netlify.toml created
✅ Build Process: npm run build working
✅ Domain: swaryoga.com ready to connect

Next Steps:
1. Go to https://app.netlify.com
2. Import GitHub repository: Turya-Kalburgi/swar-yoga-dec
3. Configure build settings (auto-detected from netlify.toml)
4. Deploy!
5. Add custom domain: swaryoga.com
6. Update DNS at your domain registrar
7. Wait 24-48 hours for DNS propagation
8. Your site will be live at swaryoga.com

---

Last Updated: December 4, 2025
Repository: github.com/Turya-Kalburgi/swar-yoga-dec
Commit: b684dcac (netlify.toml added)

🚀 Ready to Deploy!
