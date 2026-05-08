const User = require('../models/User');
const mockDB = require('../mockDB');

const isMongoConnected = () => {
  try {
    const mongoose = require('mongoose');
    return mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2;
  } catch {
    return false;
  }
};

// Helper: Auto-recreate user in mock DB if JWT is valid but user is missing
// This handles the case where the server restarts and mock DB loses data
const ensureMockUser = async (req) => {
  if (!req.user) return null;
  let user = await mockDB.getUserById(req.user.id);
  if (!user) {
    // Auto-create user from JWT payload so session survives server restart
    user = await mockDB.saveUser(req.user.email || `user-${req.user.id}@mock.local`, {
      _id: req.user.id,
      name: req.user.name || req.user.email || 'User',
      email: req.user.email || `user-${req.user.id}@mock.local`,
      password: 'mock-password-hash',
      profiles: {},
      certifications: [],
      videos: [],
      resumes: [],
    });
  }
  return user;
};

exports.getProfile = async (req, res) => {
  try {
    let user = null;
    if (isMongoConnected()) {
      try {
        user = await User.findById(req.user.id).select('-password');
      } catch { /* fallback */ }
    }
    if (!user) {
      user = await ensureMockUser(req);
      if (user) {
        const { password, ...safeUser } = user;
        user = safeUser;
      }
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, course, university, certifications, profiles } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (course !== undefined) updates.course = course;
    if (university !== undefined) updates.university = university;
    if (certifications !== undefined) updates.certifications = certifications;
    if (profiles !== undefined) updates.profiles = profiles;

    let user = null;
    if (isMongoConnected()) {
      try {
        user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
      } catch { /* fallback */ }
    }
    if (!user) {
      // Ensure the user exists in mock DB first
      await ensureMockUser(req);
      user = await mockDB.updateUserById(req.user.id, updates);
      if (user) {
        const { password, ...safeUser } = user;
        user = safeUser;
      }
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ ...user, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
};
