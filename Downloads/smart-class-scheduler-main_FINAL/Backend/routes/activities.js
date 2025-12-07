const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// GET /api/activities
router.get('/', async (req, res) => {
  const acts = await Activity.find().sort({ timestamp: -1 }).limit(100);
  res.json(acts);
});

// POST /api/activities
router.post('/', async (req, res) => {
  const a = new Activity(req.body);
  await a.save();
  res.status(201).json(a);
});

module.exports = router;
