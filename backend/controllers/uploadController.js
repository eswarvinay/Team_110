const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const mockDB = require('../mockDB');
const resumeStorage = require('../resumeStorage');

const isMongoConnected = () => {
  try {
    const mongoose = require('mongoose');
    return mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2;
  } catch {
    return false;
  }
};

// Parse resume PDF using pdf-parse
const parseResumePDF = async (buffer) => {
  try {
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer);
    const text = data.text || '';
    return extractResumeInfo(text);
  } catch (err) {
    console.error('PDF parse error:', err.message);
    return { name: '', skills: [], experience: '', raw: '' };
  }
};

// Extract structured info from resume text
const extractResumeInfo = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Extract name (usually first significant line)
  let name = '';
  for (const line of lines) {
    if (line.length > 2 && line.length < 60 && !/[0-9@.]/.test(line)) {
      name = line;
      break;
    }
  }

  // Extract skills
  const skillKeywords = [
    'javascript', 'python', 'java', 'react', 'node', 'express', 'mongodb',
    'sql', 'html', 'css', 'typescript', 'angular', 'vue', 'docker',
    'kubernetes', 'aws', 'azure', 'gcp', 'git', 'linux', 'c++', 'c#',
    'php', 'ruby', 'swift', 'kotlin', 'rust', 'go', 'r', 'matlab',
    'tableau', 'power bi', 'excel', 'figma', 'sketch', 'photoshop',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch',
    'scikit-learn', 'pandas', 'numpy', 'flask', 'django', 'spring',
    'graphql', 'redis', 'postgresql', 'mysql', 'firebase', 'next.js',
    'tailwind', 'sass', 'webpack', 'jenkins', 'ci/cd', 'agile', 'scrum',
    'rest api', 'microservices', 'data structures', 'algorithms',
  ];
  const textLower = text.toLowerCase();
  const skills = skillKeywords.filter(skill => textLower.includes(skill));

  // Extract experience section
  let experience = '';
  const expStart = textLower.indexOf('experience');
  if (expStart !== -1) {
    const expEnd = textLower.indexOf('education', expStart);
    experience = text.substring(expStart, expEnd !== -1 ? expEnd : expStart + 500).trim();
  }

  return { name, skills: [...new Set(skills)], experience, raw: text };
};

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file provided' });
    }

    // Parse the PDF
    const parsed = await parseResumePDF(req.file.buffer);

    // Save file to disk
    const filename = `resume_${req.user.id}_${Date.now()}${path.extname(req.file.originalname) || '.pdf'}`;
    const filepath = path.join(__dirname, '..', 'uploads', 'resumes', filename);
    fs.writeFileSync(filepath, req.file.buffer);

    const resumeUrl = `/uploads/resumes/${filename}`;

    // Store parsed data in resume storage
    const resumeId = `resume_${req.user.id}_${Date.now()}`;
    resumeStorage.set(resumeId, {
      url: resumeUrl,
      parsed,
      filename: req.file.originalname,
      createdAt: new Date(),
      userId: req.user.id,
    });

    // Update user record
    if (isMongoConnected()) {
      try {
        await User.findByIdAndUpdate(req.user.id, {
          $push: { resumes: resumeUrl },
          $set: {
            'resumeData.skills': parsed.skills,
            'resumeData.experience': parsed.experience,
            'resumeData.parsedName': parsed.name,
          },
        });
      } catch { /* use mock */ }
    } else {
      const user = await mockDB.getUserById(req.user.id);
      if (user) {
        user.resumes = user.resumes || [];
        user.resumes.push(resumeUrl);
        user.resumeData = { skills: parsed.skills, experience: parsed.experience, parsedName: parsed.name };
        await mockDB.updateUserById(req.user.id, user);
      }
    }

    res.json({
      url: resumeUrl,
      parsed: {
        name: parsed.name,
        skills: parsed.skills,
        experience: parsed.experience ? parsed.experience.substring(0, 500) : '',
      },
      message: 'Resume uploaded and parsed successfully',
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ error: 'Error uploading resume' });
  }
};

exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    // Save file to disk
    const filename = `video_${req.user.id}_${Date.now()}.webm`;
    const filepath = path.join(__dirname, '..', 'uploads', 'videos', filename);
    fs.writeFileSync(filepath, req.file.buffer);

    const videoUrl = `/uploads/videos/${filename}`;

    // Update user record
    if (isMongoConnected()) {
      try {
        await User.findByIdAndUpdate(req.user.id, { $push: { videos: videoUrl } });
      } catch { /* use mock */ }
    } else {
      let user = await mockDB.getUserById(req.user.id);
      if (!user) {
        // Auto-create mock user from JWT if missing after server restart
        user = await mockDB.saveUser(req.user.email || `user-${req.user.id}@mock.local`, {
          _id: req.user.id,
          name: req.user.name || 'User',
          email: req.user.email || '',
          password: 'mock-password-hash',
          profiles: {}, certifications: [], videos: [], resumes: [],
        });
      }
      user.videos = user.videos || [];
      user.videos.push(videoUrl);
      await mockDB.updateUserById(req.user.id, user);
    }

    res.json({ url: videoUrl, message: 'Video saved successfully' });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Error uploading video' });
  }
};
