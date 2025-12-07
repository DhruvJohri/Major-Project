const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// GET /api/courses
router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// POST /api/courses
router.post('/', async (req, res) => {
  const c = new Course(req.body);
  await c.save();
  res.status(201).json(c);
});

// PATCH /api/courses/:id
router.patch('/:id', async (req, res) => {
  const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE /api/courses/:id
router.delete('/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
