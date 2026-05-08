const { analyzeResume, generateSuggestions } = require('../services/analyzerService');

exports.analyzeResume = async (req, res) => {
  try {
    const { jobRole, resumeData } = req.body;

    if (!jobRole) {
      return res.status(400).json({ error: 'Target job role is required' });
    }

    const userData = resumeData || {
      name: '',
      email: '',
      skills: [],
      certifications: [],
      profiles: {},
    };

    const analysis = analyzeResume(userData, jobRole);
    const suggestions = generateSuggestions(userData, jobRole, analysis);

    res.json({
      ...analysis,
      suggestions,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Error analyzing resume' });
  }
};
