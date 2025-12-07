const mongoose = require('mongoose');

const AttendanceSessionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  department: { type: String },
  semester: { type: Number },
  section: { type: String },
  code: { type: String },
  qrUrl: { type: String },
  expiresAt: { type: Date },
  isClosed: { type: Boolean, default: false },
  attendees: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
      checkedInAt: { type: Date }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AttendanceSession', AttendanceSessionSchema);
