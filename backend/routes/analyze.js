const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const analyzeController = require('../controllers/analyzeController');

// POST /api/analyze/resume
router.post('/resume', auth, analyzeController.analyzeResume);

// Legacy alias
router.post('/analyze', auth, analyzeController.analyzeResume);

module.exports = router;