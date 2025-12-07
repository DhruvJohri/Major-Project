# Smart Class Scheduler - Complete Setup & Run Guide

## Overview
This is a full-stack educational scheduling platform with:
- **Frontend**: React + TypeScript + Vite (port 5173)
- **Backend**: Node.js + Express + MongoDB (port 5000)
- **Features**: Timetable generation (Genetic Algorithm), attendance tracking, course/faculty/room management

---

## Prerequisites

1. **Node.js** (v16+): https://nodejs.org/
2. **MongoDB**: 
   - Option A: Local installation https://www.mongodb.com/try/download/community
   - Option B: MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
3. **Git**: https://git-scm.com/ (optional)

---

## Project Structure

```
smart-class-scheduler-main_FINAL/
├── Backend/                 # Express.js backend
│   ├── server.js           # Entry point
│   ├── app.js              # Express app setup
│   ├── package.json        # Backend dependencies
│   ├── .env.example        # Environment variables template
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic (Genetic Algorithm)
│   ├── middleware/        # Custom middleware
│   ├── seed/              # Demo data seeding
│   └── uploads/           # File upload directory
│
└── smart-class-scheduler-main/   # React frontend
    ├── src/
    │   ├── pages/         # Page components
    │   ├── components/    # Reusable UI components
    │   ├── context/       # Auth context (connected to backend)
    │   ├── types/         # TypeScript types
    │   └── data/          # Mock data (fallback)
    ├── package.json       # Frontend dependencies
    ├── .env.local         # Environment variables (API_BASE)
    └── vite.config.ts     # Vite configuration
```

---

## Step-by-Step Setup & Run

### Step 1: Start MongoDB

#### Option A: Local MongoDB Service
```cmd
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
```
Expected output:
```
[initandlisten] waiting for connections on port 27017
```

#### Option B: MongoDB Atlas (Cloud)
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create cluster, get connection string: `mongodb+srv://username:password@cluster.mongodb.net/...`
3. Use this string in Backend `.env` file (Step 3)

---

### Step 2: Backend Setup & Run

#### 2a. Navigate to Backend Directory
```cmd
cd Backend
```

#### 2b. Install Dependencies
```cmd
npm install
```
Expected: Installs express, mongoose, cors, dotenv, multer, nodemon (~10-15 seconds)

#### 2c. Create .env File
Create `Backend/.env` with:
```env
MONGO_URI=mongodb://localhost:27017/smart-class-scheduler
PORT=5000
UPLOAD_DIR=uploads
NODE_ENV=development
```

**For MongoDB Atlas**, use:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-class-scheduler?retryWrites=true&w=majority
PORT=5000
```

#### 2d. Seed Demo Data (Optional but Recommended)
```cmd
node seed/seed.js
```
Expected output:
```
✓ Admin user created: admin@school.edu / password123
✓ Teacher user created: teacher@school.edu / password123
✓ Student user created: student@school.edu / password123
Demo data seeded successfully!
```

#### 2e. Start Backend Server
```cmd
npm start
```
Expected output:
```
Server running on http://localhost:5000
MongoDB connected successfully
```

---

### Step 3: Frontend Setup & Run (New Terminal/CMD)

#### 3a. Navigate to Frontend Directory
```cmd
cd smart-class-scheduler-main
```

#### 3b. Install Dependencies
```cmd
npm install
```
Expected: Installs React, Vite, TypeScript, shadcn/ui (~20-30 seconds)

#### 3c. Verify .env.local
File should already exist at `smart-class-scheduler-main/.env.local`:
```
VITE_API_BASE=http://localhost:5000
```

If missing, create it manually with the above content.

#### 3d. Start Frontend Dev Server
```cmd
npm run dev
```
Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## Testing the Integration

### 1. Open Frontend in Browser
Navigate to: **http://localhost:5173**

### 2. Login with Demo Credentials
Three demo accounts available:

**Admin Account**
- Email: `admin@school.edu`
- Password: `password123`
- Access: Admin Dashboard, Course/Faculty/Room/Timetable Management

**Teacher Account**
- Email: `teacher@school.edu`
- Password: `password123`
- Access: Teacher Dashboard, Timetable, Attendance, Materials, Students

**Student Account**
- Email: `student@school.edu`
- Password: `password123`
- Access: Student Dashboard, Timetable, Materials, Attendance

### 3. Test Key Features

#### Admin Features
1. **Course Management** → Create, edit, delete courses
   - Expected: Data persists to MongoDB
   - Backend endpoint: `POST/GET/PATCH/DELETE /api/courses`

2. **Faculty Management** → Create, edit, delete teachers
   - Backend endpoint: `POST/GET/PATCH/DELETE /api/teachers`

3. **Room Management** → Create, edit, delete rooms
   - Backend endpoint: `POST/GET/PATCH/DELETE /api/rooms`

4. **Timetable Generation**
   - Click "Generate Timetable"
   - Input: department, semester, section, days, slots/day, timeslots
   - Backend executes Genetic Algorithm (40 pop, 60 gen)
   - Expected time: ~6 seconds
   - Result: Optimized timetable with no conflicts
   - Backend endpoint: `POST /api/timetables/generate`

#### Teacher Features
1. **View Timetable** → Fetches from backend
   - Backend endpoint: `GET /api/timetables?dept=...`

2. **Create Attendance Session** → Generates QR code
   - Backend endpoint: `POST /api/attendance/sessions`

3. **Upload Materials** → Save PDF/DOC/PPT files
   - Backend endpoint: `POST /api/materials` (multipart)
   - Files stored in `Backend/uploads/`

#### Student Features
1. **View Dashboard** → Stats from backend counts
   - Backend endpoints: `GET /api/courses`, `/api/timetables`, `/api/materials`

2. **View Timetable & Materials** → Real data from backend
   - Backend endpoints: `GET /api/timetables`, `GET /api/materials`

3. **Check Attendance** → Via QR code or manual code
   - Backend endpoint: `POST /api/attendance/sessions/:id/checkin`

---

## API Reference

### Authentication
- **POST** `/api/auth/login` → Login (no JWT required)
  - Body: `{ email, password }`
  - Response: `{ user: { id, name, email, role } }`

- **POST** `/api/auth/register` → Register
  - Body: `{ name, email, password, role }`
  - Response: `{ user }`

### Courses
- **GET** `/api/courses` → List all courses
- **POST** `/api/courses` → Create course
  - Body: `{ code, name, credit, department, semester }`
- **PATCH** `/api/courses/:id` → Update course
- **DELETE** `/api/courses/:id` → Delete course

### Teachers
- **GET** `/api/teachers` → List all teachers
- **POST** `/api/teachers` → Create teacher
  - Body: `{ name, email, specialization, department }`
- **PATCH** `/api/teachers/:id` → Update teacher
- **DELETE** `/api/teachers/:id` → Delete teacher

### Students
- **GET** `/api/students` → List all students
- **POST** `/api/students` → Create student
  - Body: `{ name, email, rollNumber, semester, section, department }`

### Rooms
- **GET** `/api/rooms` → List all rooms
- **POST** `/api/rooms` → Create room
  - Body: `{ number, capacity, type, floor }`
- **PATCH** `/api/rooms/:id` → Update room
- **DELETE** `/api/rooms/:id` → Delete room

### Timetables
- **GET** `/api/timetables?dept=CSE&sem=5&section=A` → Get timetable for filter
- **POST** `/api/timetables/generate` → Generate timetable using GA
  - Body: `{ department, semester, section, days, slotsPerDay, timeslots, courses[], teachers[], rooms[] }`
  - Response: `{ _id, slots[], createdAt }`

### Attendance
- **POST** `/api/attendance/sessions` → Create attendance session
  - Body: `{ courseId, duration }`
  - Response: `{ _id, code, qrUrl, expiresAt, attendees[] }`

- **POST** `/api/attendance/sessions/:id/checkin` → Check in student
  - Body: `{ studentId }`

- **POST** `/api/attendance/sessions/:id/close` → Close session
  - Response: `{ isClosed: true }`

### Materials
- **GET** `/api/materials?courseId=...` → List materials
- **POST** `/api/materials` → Upload material (multipart/form-data)
  - Fields: `title`, `description`, `courseId`, `file`
  - Files stored in: `Backend/uploads/`

### Users
- **GET** `/api/users` → List all users
- **GET** `/api/users/:id` → Get user by ID
- **GET** `/api/users/me` → Get current user (requires auth context)
- **PATCH** `/api/users/:id` → Update user

---

## Troubleshooting

### Issue: Backend fails to start
**Symptoms**: `Error connecting to MongoDB` or `ECONNREFUSED`

**Solutions**:
1. Ensure MongoDB is running:
   ```cmd
   mongosh  # Test connection
   ```
2. Check `.env` file `MONGO_URI` is correct
3. If using MongoDB Atlas, verify IP whitelist allows your connection

### Issue: Frontend shows "API request failed" (fallback to mock data)
**Symptoms**: Components load with mock data instead of backend data

**Solutions**:
1. Verify backend is running on port 5000
2. Check `.env.local` has `VITE_API_BASE=http://localhost:5000`
3. Open browser DevTools Console (F12) → check for fetch errors
4. Verify CORS is enabled (should be in `app.js`)

### Issue: Login fails
**Symptoms**: "Invalid credentials" toast notification

**Solutions**:
1. Verify seed script was run: `node seed/seed.js`
2. Check MongoDB contains users:
   ```cmd
   mongosh
   > use smart-class-scheduler
   > db.users.find()
   ```
3. Use exact credentials:
   - `admin@school.edu / password123`
   - `teacher@school.edu / password123`
   - `student@school.edu / password123`

### Issue: File uploads not working
**Symptoms**: Material upload fails or file not found

**Solutions**:
1. Ensure `Backend/uploads/` directory exists (created on first upload)
2. Check file size < 10MB
3. Check file type is supported (PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX)
4. Verify backend has write permissions to `uploads/`

### Issue: Timetable generation takes too long
**Symptoms**: "Generate Timetable" button hangs for >10 seconds

**Solutions**:
1. This is normal! GA with 40 population × 60 generations takes ~6-8 seconds
2. Wait for progress bar to reach 100%
3. If hangs indefinitely, check backend logs for errors

### Issue: CORS errors in console
**Symptoms**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:
1. Backend should have CORS enabled in `app.js`
2. Verify frontend `.env.local` uses exact same origin as backend
3. Restart backend server after checking CORS settings

---

## Development Commands

### Backend
```cmd
cd Backend

npm install              # Install dependencies
npm start               # Start server (nodemon watch mode)
npm run seed            # Seed demo data
npm run lint            # Check for errors (if ESLint configured)
```

### Frontend
```cmd
cd smart-class-scheduler-main

npm install             # Install dependencies
npm run dev             # Start dev server (Vite)
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Check for errors (if ESLint configured)
```

---

## MongoDB Data Models

The backend automatically creates these collections:

1. **users** → Stores admin, teacher, student accounts
2. **courses** → Course metadata (code, name, credit, dept)
3. **teachers** → Faculty information
4. **students** → Student records with roll numbers
5. **rooms** → Class room/lab information
6. **timetables** → Generated timetables with slots
7. **attendancesessions** → Attendance tracking
8. **studymaterials** → Uploaded course materials
9. **activities** → User activity logs

Query example:
```cmd
mongosh
> use smart-class-scheduler
> db.courses.find()
> db.timetables.findOne({ department: "CSE" })
```

---

## Next Steps / Enhancements

1. **Authentication Upgrade**
   - Add JWT tokens instead of simple user object
   - Implement refresh tokens
   - Add password hashing (bcrypt)

2. **Dashboard Enhancements**
   - Real-time stats endpoint
   - Activity feed
   - Notification system

3. **Attendance Features**
   - Export attendance reports (CSV/PDF)
   - Attendance statistics per student
   - Bulk attendance upload

4. **Timetable Optimizations**
   - Save multiple GA solutions
   - Export timetable as PDF
   - Conflict detection warnings

5. **UI/UX Improvements**
   - Dark mode theme
   - Mobile-responsive design
   - Animated transitions

6. **Deployment**
   - Backend: Deploy to Heroku, Render, or AWS
   - Frontend: Deploy to Vercel, Netlify
   - Database: Use MongoDB Atlas (cloud)

---

## Support & Debugging

### Check Logs
**Backend logs** (terminal running `npm start`):
- Connection messages
- Route hits
- Error stack traces

**Frontend logs** (browser console F12):
- API fetch calls
- Component render states
- Error messages

### Reset Everything
```cmd
# Stop servers (Ctrl+C in both terminals)

# Clear MongoDB
mongosh
> use smart-class-scheduler
> db.dropDatabase()

# Restart
cd Backend && npm start          # Terminal 1
cd smart-class-scheduler-main && npm run dev  # Terminal 2
```

---

## Project Complete! 🎉

All frontend pages are now wired to real backend APIs:
- ✅ Authentication (login/register)
- ✅ Course/Teacher/Room/Student management
- ✅ Timetable generation (Genetic Algorithm)
- ✅ Attendance tracking
- ✅ Material upload & retrieval
- ✅ Real-time data fetching from MongoDB

**Time to first working integration: ~15-20 minutes**

Enjoy your Smart Class Scheduler! 📚
