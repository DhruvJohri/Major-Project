const express = require('express');
const router = express.Router();
const AttendanceSession = require('../models/AttendanceSession');

// POST /api/attendance/sessions -> create session
router.post('/sessions', async (req, res) => {
  const body = req.body;
  const session = new AttendanceSession(body);
  await session.save();
  res.status(201).json(session);
});

// POST /api/attendance/sessions/:id/checkin { studentId }
router.post('/sessions/:id/checkin', async (req, res) => {
  const { id } = req.params;
  const { studentId } = req.body;
  const session = await AttendanceSession.findById(id);
  if (!session) return res.status(404).json({ message: 'Session not found' });
  if (session.isClosed) return res.status(400).json({ message: 'Session closed' });
  session.attendees.push({ studentId, checkedInAt: new Date() });
  await session.save();
  res.json({ success: true });
});

// POST /api/attendance/sessions/:id/close
router.post('/sessions/:id/close', async (req, res) => {
  const { id } = req.params;
  const session = await AttendanceSession.findById(id);
  if (!session) return res.status(404).json({ message: 'Session not found' });
  session.isClosed = true;
  await session.save();
  res.json({ success: true });
});

module.exports = router;
