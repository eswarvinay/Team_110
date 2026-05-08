// Predefined role-skill mappings for resume analysis
const roleSkillsMap = {
  'frontend developer': ['html', 'css', 'javascript', 'react', 'angular', 'vue', 'typescript', 'sass', 'webpack', 'tailwind', 'next.js', 'figma', 'responsive design', 'rest api', 'git'],
  'backend developer': ['node', 'express', 'python', 'java', 'sql', 'mongodb', 'postgresql', 'redis', 'docker', 'rest api', 'microservices', 'git', 'linux', 'ci/cd', 'graphql'],
  'full stack developer': ['html', 'css', 'javascript', 'react', 'node', 'express', 'mongodb', 'sql', 'typescript', 'docker', 'git', 'rest api', 'graphql', 'aws', 'ci/cd'],
  'data scientist': ['python', 'r', 'sql', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn', 'tableau', 'statistics', 'data visualization', 'jupyter', 'spark'],
  'data analyst': ['sql', 'python', 'excel', 'tableau', 'power bi', 'r', 'statistics', 'data visualization', 'pandas', 'numpy', 'google analytics', 'a/b testing', 'etl', 'data cleaning'],
  'machine learning engineer': ['python', 'tensorflow', 'pytorch', 'scikit-learn', 'deep learning', 'machine learning', 'docker', 'kubernetes', 'aws', 'mlops', 'pandas', 'numpy', 'computer vision', 'nlp'],
  'devops engineer': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'ci/cd', 'linux', 'terraform', 'ansible', 'git', 'monitoring', 'python', 'bash', 'networking'],
  'mobile developer': ['react native', 'flutter', 'swift', 'kotlin', 'java', 'typescript', 'firebase', 'rest api', 'git', 'ui/ux', 'app store', 'agile'],
  'python developer': ['python', 'django', 'flask', 'fastapi', 'sql', 'postgresql', 'docker', 'rest api', 'git', 'linux', 'redis', 'celery', 'unit testing', 'ci/cd', 'aws'],
  'java developer': ['java', 'spring', 'hibernate', 'sql', 'postgresql', 'mysql', 'docker', 'microservices', 'rest api', 'git', 'maven', 'junit', 'ci/cd', 'aws', 'kafka'],
  'ux designer': ['figma', 'sketch', 'photoshop', 'wireframing', 'prototyping', 'user research', 'usability testing', 'html', 'css', 'design systems', 'accessibility'],
  'product manager': ['agile', 'scrum', 'jira', 'analytics', 'roadmap', 'stakeholder management', 'user stories', 'a/b testing', 'sql', 'communication'],
  'cloud engineer': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'linux', 'networking', 'security', 'ci/cd', 'python', 'serverless', 'monitoring'],
  'cybersecurity analyst': ['networking', 'linux', 'python', 'firewalls', 'siem', 'incident response', 'vulnerability assessment', 'penetration testing', 'encryption', 'compliance'],
};

// Find the best matching role from the map
const findClosestRole = (jobRole) => {
  const roleLower = jobRole.toLowerCase();
  // Direct match
  if (roleSkillsMap[roleLower]) return roleLower;
  // Partial match
  for (const key of Object.keys(roleSkillsMap)) {
    if (roleLower.includes(key) || key.includes(roleLower)) return key;
  }
  // Word-level match
  const words = roleLower.split(/\s+/);
  for (const key of Object.keys(roleSkillsMap)) {
    for (const word of words) {
      if (word.length > 3 && key.includes(word)) return key;
    }
  }
  return 'full stack developer'; // default fallback
};

const analyzeResume = (userData, jobRole) => {
  const matchedRole = findClosestRole(jobRole);
  const requiredSkills = roleSkillsMap[matchedRole] || roleSkillsMap['full stack developer'];

  // Gather user skills from all sources
  const userSkillsRaw = [
    ...(userData.skills || []),
    ...(userData.certifications || []),
  ]
    .map(s => s.toLowerCase().trim())
    .filter(Boolean);

  // Also check profiles text and name for indirect skill signals
  const allText = [
    ...userSkillsRaw,
    userData.experience || '',
    userData.name || '',
  ].join(' ').toLowerCase();

  // Calculate skill matches
  const matchedSkills = requiredSkills.filter(skill => allText.includes(skill));
  const missingSkills = requiredSkills.filter(skill => !allText.includes(skill));

  const skillMatchPercent = requiredSkills.length > 0
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : 0;

  // Calculate composite score
  let score = 0;

  // Skill match (40 points)
  score += Math.round((matchedSkills.length / requiredSkills.length) * 40);

  // Profile completeness (20 points)
  let profilePoints = 0;
  if (userData.name) profilePoints += 4;
  if (userData.profiles?.github) profilePoints += 5;
  if (userData.profiles?.linkedin) profilePoints += 5;
  if (userData.profiles?.leetcode) profilePoints += 3;
  if (userData.profiles?.hackerrank) profilePoints += 3;
  score += Math.min(20, profilePoints);

  // Certifications (15 points)
  const certCount = (userData.certifications || []).filter(Boolean).length;
  score += Math.min(15, certCount * 4);

  // Experience content (15 points)
  if (userData.experience && userData.experience.length > 50) score += 15;
  else if (userData.experience && userData.experience.length > 10) score += 8;
  else score += 2;

  // Bonus for strong profiles (10 points)
  if (matchedSkills.length >= 8) score += 5;
  if (certCount >= 3 && userData.profiles?.github) score += 5;

  score = Math.min(100, Math.max(5, score));

  return {
    score,
    skillMatch: skillMatchPercent,
    matchedSkills: matchedSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    missingSkills: missingSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    targetRole: jobRole,
    matchedRole,
    totalRequired: requiredSkills.length,
  };
};

const generateSuggestions = (userData, jobRole, analysis) => {
  const suggestions = [];

  // Missing skills suggestions
  if (analysis.missingSkills.length > 0) {
    const top3 = analysis.missingSkills.slice(0, 3).join(', ');
    suggestions.push({
      icon: '🎯',
      label: 'Add Missing Skills',
      text: `Your resume is missing key skills for this role: ${top3}. Add projects or certifications demonstrating these skills.`,
      priority: 'high',
    });
  }

  // ATS optimization
  suggestions.push({
    icon: '🔑',
    label: 'ATS Keywords',
    text: `Include role-specific keywords like "${analysis.missingSkills.slice(0, 4).join('", "')}" to pass Applicant Tracking Systems.`,
    priority: 'high',
  });

  // Quantify achievements
  suggestions.push({
    icon: '📊',
    label: 'Quantify Impact',
    text: 'Replace vague descriptions with numbers: "Improved API response time by 40%" beats "Improved API performance".',
    priority: 'medium',
  });

  // Profile completeness
  if (!userData.profiles?.github) {
    suggestions.push({
      icon: '🐙',
      label: 'Add GitHub Profile',
      text: 'A GitHub profile with active projects significantly strengthens technical credibility. Add 2-3 relevant repositories.',
      priority: 'high',
    });
  }

  if (!userData.profiles?.linkedin) {
    suggestions.push({
      icon: '💼',
      label: 'Add LinkedIn Profile',
      text: 'LinkedIn is crucial for professional networking. Ensure your profile matches your resume content.',
      priority: 'medium',
    });
  }

  // Project suggestions
  suggestions.push({
    icon: '🏆',
    label: 'Relevant Projects',
    text: `Add 2-3 portfolio projects directly relevant to "${jobRole}" with live demos or GitHub links.`,
    priority: 'medium',
  });

  // Summary improvement
  suggestions.push({
    icon: '📝',
    label: 'Professional Summary',
    text: `Start with a 2-line professional summary tailored to "${jobRole}" highlighting your strongest matching skills.`,
    priority: 'low',
  });

  return suggestions.slice(0, 6);
};

module.exports = { analyzeResume, generateSuggestions, roleSkillsMap };
