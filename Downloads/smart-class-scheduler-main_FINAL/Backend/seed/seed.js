/**
 * Simple seed script to create demo users similar to frontend mockUsers
 */
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function seed(){
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-class';
  await mongoose.connect(uri);
  const demo = [
    { name: 'Dr. Admin', email: 'admin@school.edu', password: 'admin123', role: 'Admin', department: 'Administration' },
    { name: 'Prof. Johnson', email: 'teacher@school.edu', password: 'teacher123', role: 'Teacher', department: 'CSE' },
    { name: 'John Doe', email: 'student@school.edu', password: 'student123', role: 'Student', department: 'CSE' }
  ];
  for(const d of demo){
    const exists = await User.findOne({ email: d.email });
    if(!exists){
      const u = new User(d);
      await u.save();
      console.log('Seeded', d.email);
    }
  }
  process.exit(0);
}

seed().catch(err=>{ console.error(err); process.exit(1); });
