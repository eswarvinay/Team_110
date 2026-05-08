const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const resumeController = require('../controllers/resumeController');

// POST /api/resume/extract — Extract data from video context
router.post('/extract', auth, resumeController.extractFromVideo);

// POST /api/resume/generate — Generate HTML resume
router.post('/generate', auth, resumeController.generateResume);

// GET /api/resume/history — Get user's resume history
router.get('/history', auth, resumeController.getResumeHistory);

module.exports = router;
