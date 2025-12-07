const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET /api/students
router.get('/', async (req, res) => {
  const students = await Student.find().populate('userId');
  res.json(students);
});

// POST /api/students
router.post('/', async (req, res) => {
  const s = new Student(req.body);
  await s.save();
  res.status(201).json(s);
});

module.exports = router;
