const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mockDB = require('../mockDB');

const JWT_SECRET = process.env.JWT_SECRET || 'ai-resume-video-builder-jwt-secret-2024';

// Helper: check if MongoDB is available
const isMongoConnected = () => {
  try {
    const mongoose = require('mongoose');
    return mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2;
  } catch {
    return false;
  }
};

exports.signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    let existingUser = null;
    if (isMongoConnected()) {
      try {
        existingUser = await User.findOne({ email });
      } catch { /* fallback below */ }
    }
    if (!existingUser) {
      existingUser = await mockDB.findUserByEmail(email);
    }
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      certifications: [],
      profiles: {},
      videos: [],
      resumes: [],
    };

    let savedUser;
    if (isMongoConnected()) {
      try {
        const user = new User(userData);
        savedUser = await user.save();
      } catch {
        savedUser = await mockDB.saveUser(email, userData);
      }
    } else {
      savedUser = await mockDB.saveUser(email, userData);
    }

    const token = jwt.sign({ id: savedUser._id, email: savedUser.email, name: savedUser.name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name || '',
      },
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    let user = null;
    if (isMongoConnected()) {
      try {
        user = await User.findOne({ email });
      } catch { /* fallback below */ }
    }
    if (!user) {
      user = await mockDB.findUserByEmail(email);
    }
    if (!user) {
      return res.status(401).json({ error: 'No account found with this email. Please sign up first.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name || '',
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};
