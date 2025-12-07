const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: String },
  subjects: { type: [String], default: [] },
  maxLecturesPerDay: { type: Number, default: 4 },
  maxLecturesPerWeek: { type: Number, default: 20 },
  isActive: { type: Boolean, default: true },
  department: { type: String }
});

module.exports = mongoose.model('Teacher', TeacherSchema);
