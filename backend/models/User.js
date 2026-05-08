const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  course: { type: String, default: '' },
  university: { type: String, default: '' },
  certifications: [{ type: String }],
  profiles: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    leetcode: { type: String, default: '' },
    hackerrank: { type: String, default: '' },
  },
  resumeData: {
    skills: [{ type: String }],
    experience: { type: String, default: '' },
    parsedName: { type: String, default: '' },
  },
  videos: [{ type: String }],
  resumes: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);