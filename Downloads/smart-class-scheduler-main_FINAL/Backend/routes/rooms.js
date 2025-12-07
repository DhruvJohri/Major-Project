const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// GET /api/rooms
router.get('/', async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

// POST /api/rooms
router.post('/', async (req, res) => {
  const r = new Room(req.body);
  await r.save();
  res.status(201).json(r);
});

// PATCH /api/rooms/:id
router.patch('/:id', async (req, res) => {
  const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE /api/rooms/:id
router.delete('/:id', async (req, res) => {
  try{
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  }catch(err){ res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;
