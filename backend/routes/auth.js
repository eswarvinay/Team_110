const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/signup
router.post('/signup', authController.signup);

// POST /api/auth/login
router.post('/login', authController.login);

// Legacy route aliases for backward compatibility
router.post('/register', authController.signup);

module.exports = router;