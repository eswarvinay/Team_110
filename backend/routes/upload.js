const express = require('express');
const multer = require('multer');
const router = express.Router();
const auth = require('../middleware/auth');
const uploadController = require('../controllers/uploadController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// POST /api/upload/resume
router.post('/resume', auth, upload.single('resume'), uploadController.uploadResume);

// POST /api/upload/video
router.post('/video', auth, upload.single('video'), uploadController.uploadVideo);

module.exports = router;