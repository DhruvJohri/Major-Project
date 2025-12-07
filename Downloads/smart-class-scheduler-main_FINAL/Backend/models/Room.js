const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Lecture', 'Lab', 'Seminar'], default: 'Lecture' },
  capacity: { type: Number, default: 30 },
  department: { type: String },
  isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model('Room', RoomSchema);
