const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(__dirname, uploadDir)));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/students', require('./routes/students'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/timetables', require('./routes/timetables'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/materials', require('./routes/materials'));
app.use('/api/activities', require('./routes/activities'));

app.get('/', (req, res) => {
  res.json({ message: 'Smart Class Scheduler Backend' });
});

module.exports = app;
