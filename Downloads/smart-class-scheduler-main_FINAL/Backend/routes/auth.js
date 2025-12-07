const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/login  { email, password, role }
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !role) return res.status(400).json({ message: 'Missing fields' });
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  // No password enforcement per request - match role only
  if (user.role !== role) {
    return res.status(403).json({ message: 'Role mismatch' });
  }
  // Return user object only (no JWT per requirement)
  res.json({ user });
});

// POST /api/auth/register { name, email, password, role, department }
router.post('/register', async (req, res) => {
  const { name, email, password, role, department } = req.body;
  if (!name || !email || !role) return res.status(400).json({ message: 'Missing fields' });
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: 'User already exists' });
  const user = new User({ name, email: email.toLowerCase(), password, role, department });
  await user.save();
  res.status(201).json({ user });
});

// GET /api/auth/me?email=...
router.get('/me', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Missing email' });
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

module.exports = router;
