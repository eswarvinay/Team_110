const User = require('../models/User');
const mockDB = require('../mockDB');
const { extractDataFromVideo, generateResumeHTML } = require('../services/resumeGeneratorService');
const { resumeHistory } = require('../resumeStorage');

const isMongoConnected = () => {
  try {
    const mongoose = require('mongoose');
    return mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2;
  } catch {
    return false;
  }
};

// Auto-recreate mock user from JWT if missing after restart
const ensureMockUser = async (req) => {
  if (!req.user) return null;
  let user = await mockDB.getUserById(req.user.id);
  if (!user) {
    user = await mockDB.saveUser(req.user.email || `user-${req.user.id}@mock.local`, {
      _id: req.user.id,
      name: req.user.name || 'User',
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

/**
 * POST /api/resume/generate
 * 
 * Takes video context (student info from form) + template ID
 * and generates a full HTML resume.
 * 
 * Body: { templateId: string, videoContext?: object }
 */
exports.generateResume = async (req, res) => {
  try {
    const { templateId, videoContext } = req.body;

    if (!templateId) {
      return res.status(400).json({ error: 'Template ID is required' });
    }

    const templateNames = {
      modern: 'Modern Professional',
      creative: 'Creative Portfolio',
      minimal: 'Minimal Clean',
      altacv: 'AltaCV Infographic',
      academic: 'Academic CV',
      developer: 'Tech Developer',
    };
    const validTemplates = Object.keys(templateNames);
    if (!validTemplates.includes(templateId)) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }

    // Get user profile data
    let userProfile = null;
    if (isMongoConnected()) {
      try {
        userProfile = await User.findById(req.user.id).lean();
      } catch { /* fall through to mock */ }
    }
    if (!userProfile) {
      userProfile = await ensureMockUser(req);
    }

    // Extract structured resume data using profile + video context
    const resumeData = await extractDataFromVideo(userProfile, videoContext);

    // Generate HTML resume
    const html = generateResumeHTML(resumeData, templateId);

    // Save to history
    resumeHistory.addToHistory(req.user.id, {
      templateId,
      templateName: templateNames[templateId] || templateId,
      data: {
        name: resumeData.name,
        email: resumeData.email,
        skills: resumeData.skills?.slice(0, 6),
        certifications: resumeData.certifications?.slice(0, 4),
      },
    });

    res.json({
      html,
      data: resumeData,
      templateId,
      message: 'Resume generated successfully',
    });
  } catch (error) {
    console.error('Resume generation error:', error);
    res.status(500).json({ error: 'Error generating resume' });
  }
};

/**
 * POST /api/resume/extract
 * 
 * Extracts resume data from video context + user profile.
 * 
 * Body: { videoContext?: object }
 */
exports.extractFromVideo = async (req, res) => {
  try {
    const { videoContext } = req.body;

    // Get user profile
    let userProfile = null;
    if (isMongoConnected()) {
      try {
        userProfile = await User.findById(req.user.id).lean();
      } catch { /* fall through */ }
    }
    if (!userProfile) {
      userProfile = await ensureMockUser(req);
    }

    const resumeData = await extractDataFromVideo(userProfile, videoContext);

    res.json({
      data: resumeData,
      message: 'Data extracted successfully',
    });
  } catch (error) {
    console.error('Extraction error:', error);
    res.status(500).json({ error: 'Error extracting data' });
  }
};

/**
 * GET /api/resume/history
 * Returns the user's resume generation history + stats.
 */
exports.getResumeHistory = async (req, res) => {
  try {
    const history = resumeHistory.getHistory(req.user.id);
    const stats = resumeHistory.getStats(req.user.id);

    // Also pull user profile for dashboard display
    let userProfile = null;
    if (isMongoConnected()) {
      try {
        userProfile = await User.findById(req.user.id).select('-password').lean();
      } catch { /* fall through */ }
    }
    if (!userProfile) {
      userProfile = await ensureMockUser(req);
      if (userProfile) {
        const { password, ...safeUser } = userProfile;
        userProfile = safeUser;
      }
    }

    res.json({
      history,
      stats,
      profile: userProfile || {},
    });
  } catch (error) {
    console.error('Resume history error:', error);
    res.status(500).json({ error: 'Error fetching resume history' });
  }
};
