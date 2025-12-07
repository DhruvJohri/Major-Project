const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rollNumber: { type: String },
  semester: { type: Number },
  section: { type: String },
  department: { type: String },
  attendancePercentage: { type: Number }
});

module.exports = mongoose.model('Student', StudentSchema);
