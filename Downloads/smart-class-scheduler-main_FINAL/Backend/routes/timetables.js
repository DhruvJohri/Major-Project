const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const timetableGenerator = require('../services/timetableGenerator');

// GET /api/timetables?department=&semester=&section=
router.get('/', async (req, res) => {
  const { department, semester, section } = req.query;
  const query = {};
  if (department) query.department = department;
  if (semester) query.semester = Number(semester);
  if (section) query.section = section;
  const tt = await Timetable.findOne(query).sort({ generatedAt: -1 });
  if (!tt) return res.json(null);
  res.json(tt);
});

// POST /api/timetables/generate { department, semester, section, days?, slotsPerDay?, courses?, teachers?, rooms?, timeslots? }
router.post('/generate', async (req, res) => {
  try {
    const params = req.body;
    const result = timetableGenerator.generate(params);
    // Save timetable
    const tt = new Timetable({
      department: params.department || 'CSE',
      semester: params.semester || 1,
      section: params.section || 'A',
      days: params.days || ['Monday','Tuesday','Wednesday','Thursday','Friday'],
      slotsPerDay: params.slotsPerDay || 8,
      slots: result.slots,
      generatedAt: new Date()
    });
    await tt.save();
    res.json(tt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Generation failed', error: err.message });
  }
});

module.exports = router;
