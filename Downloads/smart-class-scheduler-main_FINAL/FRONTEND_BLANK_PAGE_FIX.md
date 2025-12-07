# 🚨 Frontend Blank Page - Quick Fix Guide

## ✅ Issues Fixed

### Issue #1: Wrong Vite Port
**Problem**: vite.config.ts had port `8080` instead of standard `5173`
**Status**: ✅ **FIXED** - Changed to port 5173

---

## 🔧 Step-by-Step Fix (Do This Now)

### Step 1: Kill All Processes
```bash
# Kill backend (if running in Terminal 1)
Ctrl+C

# Kill frontend (if running in Terminal 2)  
Ctrl+C

# Kill MongoDB (if running separately)
Ctrl+C
```

### Step 2: Clear Node Modules & Reinstall (Frontend)
```bash
cd smart-class-scheduler-main

# Clear everything
rmdir /s /q node_modules
del package-lock.json

# Fresh install
npm install
```
*Expected time: 30-60 seconds*

### Step 3: Start Fresh MongoDB Connection
```bash
# Terminal dedicated to MongoDB
mongod
```
*Expected output: `waiting for connections on port 27017`*

### Step 4: Start Backend (New Terminal)
```bash
cd Backend
npm install (skip if already done)
npm start
```
*Expected output:*
```
Server running on http://localhost:5000
MongoDB connected successfully
```

### Step 5: Start Frontend (New Terminal)
```bash
cd smart-class-scheduler-main
npm run dev
```
*Expected output:*
```
VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### Step 6: Open Browser
Navigate to: **http://localhost:5173**

You should now see the HomePage with "Smart Timetable Generation" features!

---

## 🔍 Troubleshooting - Still Blank?

### Check 1: Browser Console
Open **Developer Tools** (F12) → **Console** tab

Look for any red errors. Common ones:

**Error**: `Failed to fetch http://localhost:5000/api/...`
**Fix**: Make sure backend is running on port 5000

**Error**: `Cannot find module @/...`
**Fix**: Run `npm install` again

**Error**: `React is not defined`
**Fix**: This shouldn't happen, but means React didn't load

### Check 2: Network Tab
Open **Developer Tools** (F12) → **Network** tab
- Reload page (Ctrl+R)
- Look for red-crossed requests
- Check if http://localhost:5173 is accessible
- Check if http://localhost:5000 is reachable

### Check 3: Backend Status
```bash
# Test if backend is running
curl http://localhost:5000/api/courses

# Should return: [] (empty array) or list of courses
```

### Check 4: Port Issues
```bash
# Check what's using port 5173
netstat -ano | findstr :5173

# If something is there, kill it:
taskkill /PID <PID> /F

# Try frontend again
npm run dev
```

---

## ✨ What Should Work After Fix

### Home Page
- ✅ See navbar with "Features" section
- ✅ Features: Timetable, QR Attendance, Analytics, etc.
- ✅ "Login Now" button at top right
- ✅ Demo credentials shown at bottom

### Login Page
- ✅ Click "Login Now" from home
- ✅ See login form
- ✅ Select role: Student, Teacher, or Admin
- ✅ Enter credentials

### Admin Dashboard
```
Login with:
Email: admin@school.edu
Password: password123
Role: Admin
```
- ✅ See 4 stat cards (Courses, Teachers, Students, Rooms)
- ✅ Sidebar menu with: Courses, Faculty, Rooms, Timetable, Notifications

### Teacher Dashboard
```
Login with:
Email: teacher@school.edu  
Password: password123
Role: Teacher
```
- ✅ See stat cards
- ✅ Sidebar: Timetable, Attendance, Materials, Students

### Student Dashboard
```
Login with:
Email: student@school.edu
Password: password123
Role: Student
```
- ✅ See stat cards
- ✅ Sidebar: Timetable, Materials, Attendance

---

## 🚨 Still Not Working?

### Nuclear Option: Complete Reset

```bash
# Stop everything
Ctrl+C everywhere

# Clear everything
cd smart-class-scheduler-main
rmdir /s /q node_modules
del package-lock.json

cd ..\Backend
rmdir /s /q node_modules
del package-lock.json

# Fresh install both
cd ..\smart-class-scheduler-main
npm install

cd ..\Backend
npm install

# Start fresh
mongod  # Terminal 1

npm start  # Terminal 2 (Backend folder)

npm run dev  # Terminal 3 (Frontend folder)
```

### Check Browser Compatibility
- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Edge
- ❌ Internet Explorer (not supported)

Try a different browser to isolate the issue.

### Check Internet Connection
Some imports might need to download. Ensure you have:
- ✅ Internet connection
- ✅ npm registry access (https://registry.npmjs.org/)
- ✅ No proxy/firewall blocking npm

---

## 📊 Expected Ports

| Service | Port | Status |
|---------|------|--------|
| Frontend (Vite) | 5173 | ✅ http://localhost:5173 |
| Backend (Express) | 5000 | ✅ http://localhost:5000 |
| MongoDB | 27017 | ✅ Internal only |

---

## 🎯 If You See These, It's Working

### Console (F12 → Console)
```
✅ No red errors
✅ Only yellow warnings (normal)
✅ App rendering messages
```

### Network (F12 → Network)
```
✅ index.html: 200
✅ main.tsx: 200
✅ CSS files: 200
✅ JS chunks: 200
```

### Browser URL
```
✅ http://localhost:5173 in address bar
✅ Page title: "EduSchedule - Smart Timetable..."
✅ Logo/navbar visible at top
```

---

## 📞 Quick Command Reference

```bash
# Frontend folder (smart-class-scheduler-main)
npm install          # Install dependencies
npm run dev          # Start dev server (port 5173)
npm run build        # Build for production
npm run lint         # Check for errors

# Backend folder (Backend)
npm install          # Install dependencies
npm start            # Start server (port 5000)
node seed/seed.js    # Seed demo users

# Database
mongod               # Start MongoDB
mongosh              # Connect to MongoDB
```

---

## ✅ Verification Checklist

After starting everything:

- [ ] Terminal 1: MongoDB running with "waiting for connections"
- [ ] Terminal 2: Backend showing "Server running on http://localhost:5000"
- [ ] Terminal 3: Frontend showing "Local: http://localhost:5173"
- [ ] Browser: Navigate to http://localhost:5173
- [ ] Browser: See home page with features and login button
- [ ] Browser Console (F12): No red errors
- [ ] Browser Network (F12): All files loading with status 200

---

## 🎉 Success Indicators

**You'll know it's working when:**

1. **Home Page loads** - See "Smart Timetable Generation" features
2. **Click "Login Now"** - Lands on login form
3. **Select Admin role** - See role dropdown
4. **Enter admin@school.edu / password123** - Can log in
5. **See dashboard** - Admin panel with course/teacher/room/student counts
6. **Click menu items** - Can navigate to Courses, Faculty, Rooms, Timetable
7. **All data loads** - Stat cards show numbers (not loading spinners)

---

## 💡 Pro Tips

1. **Use a fresh browser tab** - Don't use browser cache
   - Press `Ctrl+Shift+Delete` to clear cache before trying again

2. **Check .env files**
   - Backend: `Backend/.env` should have `MONGO_URI=mongodb://localhost:27017/smart-class-scheduler`
   - Frontend: `smart-class-scheduler-main/.env.local` should have `VITE_API_BASE=http://localhost:5000`

3. **Monitor terminal output**
   - Backend should log: `GET /api/courses` when you navigate
   - Frontend should log: `[vite] hmr client connected` after startup

4. **Use Incognito/Private mode**
   - Helps isolate browser cache and extension issues

---

## 🎯 Next Steps Once It Works

1. ✅ Test login with all 3 roles (Admin, Teacher, Student)
2. ✅ Create a new course (Admin → Courses)
3. ✅ Generate a timetable (Admin → Timetable)
4. ✅ Upload a material file (Teacher → Materials)
5. ✅ Create an attendance session (Teacher → Attendance)

---

**If still stuck, provide:**
1. The exact error message from console (F12)
2. Output from each terminal
3. Results of `curl http://localhost:5000/api/courses`
4. Browser name and version

I'm here to help! 🚀
