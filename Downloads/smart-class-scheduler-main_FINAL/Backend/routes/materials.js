const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const StudyMaterial = require('../models/StudyMaterial');

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// POST /api/materials (multipart) -> upload file
router.post('/', upload.single('file'), async (req, res) => {
  const { title, description, courseId, teacherId } = req.body;
  const file = req.file;
  const mat = new StudyMaterial({
    title,
    description,
    filePath: file ? `/uploads/${path.basename(file.path)}` : undefined,
    fileOriginalName: file ? file.originalname : undefined,
    courseId,
    teacherId
  });
  await mat.save();
  res.status(201).json(mat);
});

// GET /api/materials?courseId=
router.get('/', async (req, res) => {
  const { courseId } = req.query;
  const query = {};
  if (courseId) query.courseId = courseId;
  const list = await StudyMaterial.find(query);
  res.json(list);
});

module.exports = router;
