const mongoose = require('mongoose');

const TimetableSlotSchema = new mongoose.Schema({
  day: { type: String, required: true },
  slotIndex: { type: Number, required: true },
  time: { type: String },
  course: { type: Object },
  teacher: { type: Object },
  room: { type: Object }
});

const TimetableSchema = new mongoose.Schema({
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  section: { type: String, required: true },
  days: { type: [String], default: ['Monday','Tuesday','Wednesday','Thursday','Friday'] },
  slotsPerDay: { type: Number, default: 8 },
  slots: { type: [TimetableSlotSchema], default: [] },
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Timetable', TimetableSchema);
