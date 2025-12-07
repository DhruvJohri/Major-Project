const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  department: { type: String },
  semester: { type: Number },
  weeklyHours: { type: Number, default: 3 },
  assignedTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
});

module.exports = mongoose.model('Course', CourseSchema);
