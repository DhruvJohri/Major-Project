# ⚡ IMMEDIATE FIX - FOLLOW THESE 5 STEPS

## 🔴 What's Wrong
Frontend shows blank page = likely vite config or missing npm install

## ✅ FIX NOW

### Step 1: Kill Everything
```
Press Ctrl+C in EVERY terminal window
```

### Step 2: Frontend - Fresh Install
```bash
cd smart-class-scheduler-main
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Step 3: Start MongoDB
```bash
mongod
# Keep this running - you'll see "waiting for connections on port 27017"
```

### Step 4: Start Backend (NEW Terminal)
```bash
cd Backend
npm start
# Should show "Server running on http://localhost:5000"
```

### Step 5: Start Frontend (NEW Terminal)  
```bash
cd smart-class-scheduler-main
npm run dev
# Should show "Local: http://localhost:5173"
```

---

## 🌐 Open Browser
Go to: **http://localhost:5173**

You should now see the home page with features!

---

## 🚨 If Still Blank

### Check #1: Browser Console (Press F12)
Look for RED errors. Take a screenshot and share them.

### Check #2: Backend Running?
```bash
curl http://localhost:5000/api/courses
# Should return: [] or [courses...]
```

### Check #3: Is Frontend on Right Port?
```bash
# In terminal running npm run dev, check the output
# Should say: "Local:   http://localhost:5173"
# NOT port 8080!
```

### Check #4: npm install had errors?
```bash
# Look at terminal output when npm install ran
# Should see "added XXX packages" with no red ERR!
```

---

## 📋 Demo Credentials (After Login Works)

```
Admin:
  Email: admin@school.edu
  Password: password123
  
Teacher:
  Email: teacher@school.edu
  Password: password123
  
Student:
  Email: student@school.edu
  Password: password123
```

---

## ❓ Questions?

If still stuck after these 5 steps, tell me:
1. What you see in browser (blank? error? spinner?)
2. What's in browser console (F12 → Console tab) - any red text?
3. What terminal says for npm run dev
4. Screenshot of browser address bar

I'll fix it! 💪
