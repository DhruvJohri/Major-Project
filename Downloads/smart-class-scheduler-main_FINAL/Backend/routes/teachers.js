const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const User = require('../models/User');

// GET /api/teachers
router.get('/', async (req, res) => {
  const teachers = await Teacher.find().populate('userId');
  res.json(teachers);
});

// POST /api/teachers
router.post('/', async (req, res) => {
  const { userId, employeeId, subjects, maxLecturesPerDay, maxLecturesPerWeek, isActive, department } = req.body;
  const teacher = new Teacher({ userId, employeeId, subjects, maxLecturesPerDay, maxLecturesPerWeek, isActive, department });
  await teacher.save();
  res.status(201).json(teacher);
});

// PATCH /api/teachers/:id
router.patch('/:id', async (req, res) => {
  const updated = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE /api/teachers/:id
router.delete('/:id', async (req, res) => {
  try{
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  }catch(err){ res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;
