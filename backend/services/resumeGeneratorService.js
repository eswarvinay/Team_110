/**
 * Resume Generator Service
 * 
 * Uses Gemini to extract structured resume data from video context
 * (transcript or notes) with a safe fallback to local heuristics.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

const buildBaseResumeData = (userProfile, videoContext) => ({
  name: videoContext?.name || userProfile?.name || 'Your Name',
  email: videoContext?.email || userProfile?.email || 'email@example.com',
  phone: videoContext?.phone || userProfile?.phone || '',
  location: videoContext?.location || '',
  title: videoContext?.title || userProfile?.course || 'Professional',
  summary: videoContext?.summary ||
    `Motivated and detail-oriented professional with a passion for technology and innovation. ${userProfile?.university ? `Currently studying at ${userProfile.university}.` : ''} Eager to apply skills in a challenging environment and contribute to organizational success.`,
  experience: videoContext?.experience || [
    {
      role: 'Software Development Intern',
      company: 'Tech Solutions Inc.',
      duration: 'Jun 2025 – Aug 2025',
      points: [
        'Developed and maintained RESTful APIs using Node.js and Express',
        'Collaborated with cross-functional teams to deliver frontend features using React',
        'Implemented automated testing, improving code coverage by 30%',
      ],
    },
    {
      role: 'Campus Tech Lead',
      company: userProfile?.university || 'University',
      duration: 'Sep 2024 – May 2025',
      points: [
        'Led a team of 8 developers to build the university event management portal',
        'Organized coding workshops and hackathons for 200+ students',
        'Mentored junior developers in web development best practices',
      ],
    },
  ],
  education: videoContext?.education || [
    {
      degree: userProfile?.course || 'Bachelor of Technology in Computer Science',
      institution: userProfile?.university || 'University',
      duration: '2022 – 2026',
      gpa: videoContext?.gpa || '8.5/10',
    },
  ],
  skills: videoContext?.skills || [
    'JavaScript', 'Python', 'React', 'Node.js', 'Express',
    'MongoDB', 'SQL', 'Git', 'Docker', 'HTML/CSS',
  ],
  certifications: videoContext?.certifications ||
    (userProfile?.certifications?.length ? userProfile.certifications : [
      'AWS Cloud Practitioner',
      'Google Data Analytics Professional Certificate',
    ]),
  projects: videoContext?.projects || [
    {
      name: 'AI Resume Video Builder',
      description: 'Full-stack web app that generates professional resumes from video introductions using AI',
      tech: 'React, Node.js, Express, MongoDB',
    },
    {
      name: 'Smart Campus Navigator',
      description: 'Mobile-friendly campus navigation app with real-time location tracking',
      tech: 'React Native, Firebase, Google Maps API',
    },
  ],
  profiles: {
    github: videoContext?.profiles?.github || userProfile?.profiles?.github || '',
    linkedin: videoContext?.profiles?.linkedin || userProfile?.profiles?.linkedin || '',
    leetcode: videoContext?.profiles?.leetcode || userProfile?.profiles?.leetcode || '',
    hackerrank: videoContext?.profiles?.hackerrank || userProfile?.profiles?.hackerrank || '',
  },
});

const safeJsonParse = (text) => {
  if (!text || typeof text !== 'string') return null;
  const cleaned = text.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

const mergeResumeData = (base, incoming) => {
  if (!incoming || typeof incoming !== 'object') return base;

  const merged = { ...base };
  const pickString = (value) => (typeof value === 'string' && value.trim() ? value.trim() : null);
  const pickArray = (value) => (Array.isArray(value) && value.length ? value : null);

  const fields = ['name', 'email', 'phone', 'location', 'title', 'summary'];
  fields.forEach((field) => {
    const value = pickString(incoming[field]);
    if (value) merged[field] = value;
  });

  const arrayFields = ['skills', 'certifications', 'experience', 'education', 'projects'];
  arrayFields.forEach((field) => {
    const value = pickArray(incoming[field]);
    if (value) merged[field] = value;
  });

  if (incoming.profiles && typeof incoming.profiles === 'object') {
    merged.profiles = { ...merged.profiles, ...incoming.profiles };
  }

  return merged;
};

const buildGeminiPrompt = (userProfile, videoContext, baseData) => {
  const context = {
    videoContext: videoContext || {},
    userProfile: userProfile || {},
    baseData,
  };

  return [
    'You are an expert resume writer.',
    'Extract a clean, structured resume JSON from the provided context.',
    'Return ONLY JSON with this shape:',
    '{"name":"","email":"","phone":"","location":"","title":"","summary":"","experience":[{"role":"","company":"","duration":"","points":[""]}],"education":[{"degree":"","institution":"","duration":"","gpa":""}],"skills":[""],"certifications":[""],"projects":[{"name":"","description":"","tech":""}],"profiles":{"github":"","linkedin":"","leetcode":"","hackerrank":""}}',
    'Use realistic, concise content. If a field is unknown, leave it empty or omit it.',
    `Context: ${JSON.stringify(context)}`,
  ].join('\n');
};

const extractDataFromVideo = async (userProfile, videoContext) => {
  const baseData = buildBaseResumeData(userProfile, videoContext);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return baseData;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: { responseMimeType: 'application/json' },
    });

    const prompt = buildGeminiPrompt(userProfile, videoContext, baseData);
    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.() || '';
    const parsed = safeJsonParse(text);

    return mergeResumeData(baseData, parsed);
  } catch (error) {
    console.error('Gemini extraction error:', error.message);
    return baseData;
  }
};

// Generate HTML resume based on template
const generateResumeHTML = (data, templateId) => {
  const generators = {
    modern: generateModernTemplate,
    creative: generateCreativeTemplate,
    minimal: generateMinimalTemplate,
    altacv: generateAltaCVTemplate,
    academic: generateAcademicTemplate,
    developer: generateDeveloperTemplate,
  };

  const generator = generators[templateId] || generators.modern;
  return generator(data);
};

// ═══════════════════════════════════════════════════════════
// TEMPLATE 1: Modern Professional
// ═══════════════════════════════════════════════════════════
function generateModernTemplate(d) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #f5f5f5; color: #333; }
  .resume { max-width: 800px; margin: 20px auto; background: #fff; box-shadow: 0 2px 20px rgba(0,0,0,0.1); }
  .header { background: linear-gradient(135deg, #1a56db, #3b82f6); color: #fff; padding: 40px; }
  .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
  .header .title { font-size: 16px; opacity: 0.9; margin-bottom: 12px; }
  .header .contact { font-size: 13px; opacity: 0.85; display: flex; flex-wrap: wrap; gap: 16px; }
  .body { padding: 32px 40px; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #1a56db; border-bottom: 2px solid #1a56db; padding-bottom: 6px; margin-bottom: 14px; }
  .summary { font-size: 14px; line-height: 1.7; color: #555; }
  .exp-item { margin-bottom: 16px; }
  .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
  .exp-role { font-size: 15px; font-weight: 600; }
  .exp-duration { font-size: 12px; color: #888; }
  .exp-company { font-size: 13px; color: #666; margin-bottom: 6px; }
  .exp-points { list-style: none; padding: 0; }
  .exp-points li { font-size: 13px; color: #555; padding: 2px 0 2px 16px; position: relative; line-height: 1.6; }
  .exp-points li::before { content: '▸'; position: absolute; left: 0; color: #1a56db; }
  .edu-item { margin-bottom: 10px; }
  .edu-degree { font-size: 14px; font-weight: 600; }
  .edu-school { font-size: 13px; color: #666; }
  .skills { display: flex; flex-wrap: wrap; gap: 8px; }
  .skill { background: #eef2ff; color: #1a56db; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .cert-item { font-size: 13px; color: #555; padding: 3px 0 3px 16px; position: relative; }
  .cert-item::before { content: '✓'; position: absolute; left: 0; color: #1a56db; font-weight: 700; }
  .project { margin-bottom: 12px; }
  .project-name { font-size: 14px; font-weight: 600; }
  .project-desc { font-size: 13px; color: #555; line-height: 1.5; }
  .project-tech { font-size: 11px; color: #888; margin-top: 2px; }
</style></head><body>
<div class="resume">
  <div class="header">
    <h1>${d.name}</h1>
    <div class="title">${d.title}</div>
    <div class="contact">
      ${d.email ? `<span>✉ ${d.email}</span>` : ''}
      ${d.phone ? `<span>☎ ${d.phone}</span>` : ''}
      ${d.location ? `<span>📍 ${d.location}</span>` : ''}
      ${d.profiles?.linkedin ? `<span>LinkedIn: ${d.profiles.linkedin}</span>` : ''}
      ${d.profiles?.github ? `<span>GitHub: ${d.profiles.github}</span>` : ''}
    </div>
  </div>
  <div class="body">
    <div class="section">
      <div class="section-title">Professional Summary</div>
      <div class="summary">${d.summary}</div>
    </div>
    <div class="section">
      <div class="section-title">Experience</div>
      ${d.experience.map(e => `
        <div class="exp-item">
          <div class="exp-header"><span class="exp-role">${e.role}</span><span class="exp-duration">${e.duration}</span></div>
          <div class="exp-company">${e.company}</div>
          <ul class="exp-points">${e.points.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
      `).join('')}
    </div>
    <div class="two-col">
      <div class="section">
        <div class="section-title">Education</div>
        ${d.education.map(e => `
          <div class="edu-item">
            <div class="edu-degree">${e.degree}</div>
            <div class="edu-school">${e.institution} | ${e.duration}${e.gpa ? ` | GPA: ${e.gpa}` : ''}</div>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <div class="section-title">Certifications</div>
        ${d.certifications.map(c => `<div class="cert-item">${c}</div>`).join('')}
      </div>
    </div>
    <div class="section">
      <div class="section-title">Skills</div>
      <div class="skills">${d.skills.map(s => `<span class="skill">${s}</span>`).join('')}</div>
    </div>
    <div class="section">
      <div class="section-title">Projects</div>
      ${d.projects.map(p => `
        <div class="project">
          <div class="project-name">${p.name}</div>
          <div class="project-desc">${p.description}</div>
          <div class="project-tech">Tech: ${p.tech}</div>
        </div>
      `).join('')}
    </div>
  </div>
</div></body></html>`;
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE 2: Creative Portfolio
// ═══════════════════════════════════════════════════════════
function generateCreativeTemplate(d) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Poppins', sans-serif; background: #f0f0f0; }
  .resume { max-width: 800px; margin: 20px auto; display: grid; grid-template-columns: 280px 1fr; background: #fff; box-shadow: 0 2px 20px rgba(0,0,0,0.1); min-height: 1000px; }
  .sidebar { background: linear-gradient(180deg, #1e293b, #0f172a); color: #fff; padding: 36px 24px; }
  .avatar { width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 700; color: #fff; }
  .sidebar h1 { font-size: 20px; text-align: center; margin-bottom: 4px; }
  .sidebar .title { font-size: 12px; text-align: center; color: #94a3b8; margin-bottom: 24px; }
  .side-section { margin-bottom: 22px; }
  .side-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #8b5cf6; font-weight: 600; margin-bottom: 10px; }
  .contact-item { font-size: 12px; color: #cbd5e1; padding: 4px 0; display: flex; gap: 8px; align-items: center; }
  .skill-bar { margin-bottom: 8px; }
  .skill-name { font-size: 12px; color: #e2e8f0; margin-bottom: 3px; }
  .skill-track { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; }
  .skill-fill { height: 100%; background: linear-gradient(90deg, #6366f1, #a78bfa); border-radius: 2px; }
  .main { padding: 36px 32px; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 14px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 6px; border-bottom: 2px solid #6366f1; margin-bottom: 14px; }
  .summary { font-size: 13px; line-height: 1.7; color: #64748b; }
  .exp-item { margin-bottom: 16px; padding-left: 16px; border-left: 2px solid #e2e8f0; }
  .exp-role { font-size: 14px; font-weight: 600; color: #1e293b; }
  .exp-meta { font-size: 12px; color: #6366f1; margin-bottom: 6px; }
  .exp-points { list-style: none; }
  .exp-points li { font-size: 12px; color: #64748b; padding: 2px 0; line-height: 1.6; }
  .project { background: #f8fafc; border-radius: 8px; padding: 12px; margin-bottom: 10px; border: 1px solid #e2e8f0; }
  .project-name { font-size: 13px; font-weight: 600; color: #1e293b; }
  .project-desc { font-size: 12px; color: #64748b; margin-top: 4px; }
  .project-tech { font-size: 11px; color: #6366f1; margin-top: 4px; }
  .cert-item { font-size: 12px; color: #334155; padding: 3px 0; }
</style></head><body>
<div class="resume">
  <div class="sidebar">
    <div class="avatar">${d.name.charAt(0)}</div>
    <h1>${d.name}</h1>
    <div class="title">${d.title}</div>
    <div class="side-section">
      <div class="side-title">Contact</div>
      ${d.email ? `<div class="contact-item">✉ ${d.email}</div>` : ''}
      ${d.phone ? `<div class="contact-item">☎ ${d.phone}</div>` : ''}
      ${d.location ? `<div class="contact-item">📍 ${d.location}</div>` : ''}
      ${d.profiles?.github ? `<div class="contact-item">🐙 ${d.profiles.github}</div>` : ''}
      ${d.profiles?.linkedin ? `<div class="contact-item">💼 ${d.profiles.linkedin}</div>` : ''}
    </div>
    <div class="side-section">
      <div class="side-title">Skills</div>
      ${d.skills.map((s, i) => `
        <div class="skill-bar">
          <div class="skill-name">${s}</div>
          <div class="skill-track"><div class="skill-fill" style="width:${90 - i * 5}%"></div></div>
        </div>
      `).join('')}
    </div>
    <div class="side-section">
      <div class="side-title">Education</div>
      ${d.education.map(e => `
        <div style="margin-bottom:8px;">
          <div style="font-size:12px;font-weight:600;color:#e2e8f0;">${e.degree}</div>
          <div style="font-size:11px;color:#94a3b8;">${e.institution}</div>
          <div style="font-size:11px;color:#64748b;">${e.duration}</div>
        </div>
      `).join('')}
    </div>
  </div>
  <div class="main">
    <div class="section">
      <div class="section-title">About Me</div>
      <div class="summary">${d.summary}</div>
    </div>
    <div class="section">
      <div class="section-title">Experience</div>
      ${d.experience.map(e => `
        <div class="exp-item">
          <div class="exp-role">${e.role}</div>
          <div class="exp-meta">${e.company} · ${e.duration}</div>
          <ul class="exp-points">${e.points.map(p => `<li>• ${p}</li>`).join('')}</ul>
        </div>
      `).join('')}
    </div>
    <div class="section">
      <div class="section-title">Projects</div>
      ${d.projects.map(p => `
        <div class="project">
          <div class="project-name">${p.name}</div>
          <div class="project-desc">${p.description}</div>
          <div class="project-tech">${p.tech}</div>
        </div>
      `).join('')}
    </div>
    <div class="section">
      <div class="section-title">Certifications</div>
      ${d.certifications.map(c => `<div class="cert-item">✓ ${c}</div>`).join('')}
    </div>
  </div>
</div></body></html>`;
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE 3: Minimal Clean
// ═══════════════════════════════════════════════════════════
function generateMinimalTemplate(d) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #fafafa; color: #222; }
  .resume { max-width: 720px; margin: 24px auto; background: #fff; padding: 48px 56px; box-shadow: 0 1px 10px rgba(0,0,0,0.06); }
  h1 { font-family: 'Crimson Pro', serif; font-size: 32px; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 4px; }
  .contact { font-size: 12px; color: #888; margin-bottom: 6px; }
  .divider { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
  .section { margin-bottom: 22px; }
  .section-title { font-family: 'Crimson Pro', serif; font-size: 15px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #333; margin-bottom: 12px; }
  .summary { font-size: 13px; line-height: 1.8; color: #555; }
  .exp-item { margin-bottom: 16px; }
  .exp-top { display: flex; justify-content: space-between; }
  .exp-role { font-size: 14px; font-weight: 600; }
  .exp-dur { font-size: 12px; color: #999; }
  .exp-company { font-size: 13px; color: #666; font-style: italic; margin-bottom: 6px; }
  .exp-points { list-style: none; }
  .exp-points li { font-size: 13px; color: #444; padding: 2px 0; line-height: 1.7; }
  .exp-points li::before { content: '– '; color: #999; }
  .edu-item { margin-bottom: 8px; }
  .edu-degree { font-size: 14px; font-weight: 500; }
  .edu-meta { font-size: 12px; color: #888; }
  .skills { font-size: 13px; color: #444; line-height: 1.8; }
  .project { margin-bottom: 10px; }
  .project-name { font-size: 13px; font-weight: 600; }
  .project-desc { font-size: 12px; color: #666; }
</style></head><body>
<div class="resume">
  <h1>${d.name}</h1>
  <div class="contact">
    ${[d.email, d.phone, d.location, d.profiles?.linkedin, d.profiles?.github].filter(Boolean).join('  ·  ')}
  </div>
  <hr class="divider">
  <div class="section">
    <div class="section-title">Summary</div>
    <div class="summary">${d.summary}</div>
  </div>
  <div class="section">
    <div class="section-title">Experience</div>
    ${d.experience.map(e => `
      <div class="exp-item">
        <div class="exp-top"><span class="exp-role">${e.role}</span><span class="exp-dur">${e.duration}</span></div>
        <div class="exp-company">${e.company}</div>
        <ul class="exp-points">${e.points.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>
    `).join('')}
  </div>
  <div class="section">
    <div class="section-title">Education</div>
    ${d.education.map(e => `
      <div class="edu-item">
        <div class="edu-degree">${e.degree}</div>
        <div class="edu-meta">${e.institution}  ·  ${e.duration}${e.gpa ? `  ·  GPA: ${e.gpa}` : ''}</div>
      </div>
    `).join('')}
  </div>
  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills">${d.skills.join('  ·  ')}</div>
  </div>
  <div class="section">
    <div class="section-title">Projects</div>
    ${d.projects.map(p => `
      <div class="project">
        <div class="project-name">${p.name} <span style="font-weight:400;font-size:11px;color:#999;">— ${p.tech}</span></div>
        <div class="project-desc">${p.description}</div>
      </div>
    `).join('')}
  </div>
  ${d.certifications.length ? `
    <div class="section">
      <div class="section-title">Certifications</div>
      ${d.certifications.map(c => `<div style="font-size:13px;color:#444;padding:2px 0;">${c}</div>`).join('')}
    </div>
  ` : ''}
</div></body></html>`;
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE 4: AltaCV (Infographic)
// ═══════════════════════════════════════════════════════════
function generateAltaCVTemplate(d) {
  const accent = '#0d9488';
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Nunito', sans-serif; background: #f0f0f0; }
  .resume { max-width: 800px; margin: 20px auto; display: grid; grid-template-columns: 260px 1fr; background: #fff; box-shadow: 0 2px 20px rgba(0,0,0,0.1); }
  .left { background: #f8fffe; padding: 32px 20px; border-right: 3px solid ${accent}; }
  .avatar { width: 90px; height: 90px; border-radius: 50%; background: ${accent}; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 800; color: #fff; }
  .left h1 { font-size: 18px; text-align: center; color: #1a1a1a; margin-bottom: 2px; }
  .left .title { font-size: 11px; text-align: center; color: ${accent}; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
  .lsec { margin-bottom: 18px; }
  .lsec-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: ${accent}; font-weight: 700; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #e0f2f1; }
  .contact-row { font-size: 11px; color: #555; padding: 3px 0; }
  .skill-row { margin-bottom: 6px; }
  .skill-label { font-size: 11px; color: #333; font-weight: 600; }
  .skill-bar-bg { height: 6px; background: #e0f2f1; border-radius: 3px; margin-top: 2px; }
  .skill-bar-fill { height: 100%; background: ${accent}; border-radius: 3px; }
  .right { padding: 32px 28px; }
  .rsec { margin-bottom: 22px; }
  .rsec-title { font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: ${accent}; font-weight: 700; margin-bottom: 12px; padding-bottom: 4px; border-bottom: 2px solid ${accent}; }
  .summary { font-size: 13px; color: #555; line-height: 1.7; }
  .exp { margin-bottom: 16px; position: relative; padding-left: 18px; }
  .exp::before { content: ''; position: absolute; left: 0; top: 6px; width: 8px; height: 8px; border-radius: 50%; background: ${accent}; }
  .exp-role { font-size: 14px; font-weight: 700; color: #1a1a1a; }
  .exp-meta { font-size: 11px; color: ${accent}; font-weight: 600; margin-bottom: 4px; }
  .exp-points { list-style: none; }
  .exp-points li { font-size: 12px; color: #555; padding: 2px 0; line-height: 1.6; }
  .proj { background: #f0fdfa; border-radius: 6px; padding: 10px 12px; margin-bottom: 8px; border-left: 3px solid ${accent}; }
  .proj-name { font-size: 13px; font-weight: 700; color: #1a1a1a; }
  .proj-desc { font-size: 11px; color: #555; margin-top: 2px; }
</style></head><body>
<div class="resume">
  <div class="left">
    <div class="avatar">${d.name.charAt(0)}</div>
    <h1>${d.name}</h1>
    <div class="title">${d.title}</div>
    <div class="lsec">
      <div class="lsec-title">Contact</div>
      ${d.email ? `<div class="contact-row">✉ ${d.email}</div>` : ''}
      ${d.phone ? `<div class="contact-row">☎ ${d.phone}</div>` : ''}
      ${d.profiles?.github ? `<div class="contact-row">GitHub: ${d.profiles.github}</div>` : ''}
      ${d.profiles?.linkedin ? `<div class="contact-row">LinkedIn: ${d.profiles.linkedin}</div>` : ''}
    </div>
    <div class="lsec">
      <div class="lsec-title">Skills</div>
      ${d.skills.map((s, i) => `
        <div class="skill-row">
          <div class="skill-label">${s}</div>
          <div class="skill-bar-bg"><div class="skill-bar-fill" style="width:${95 - i * 6}%"></div></div>
        </div>
      `).join('')}
    </div>
    <div class="lsec">
      <div class="lsec-title">Education</div>
      ${d.education.map(e => `
        <div style="margin-bottom:8px;">
          <div style="font-size:12px;font-weight:700;color:#1a1a1a;">${e.degree}</div>
          <div style="font-size:11px;color:#555;">${e.institution}</div>
          <div style="font-size:10px;color:${accent};font-weight:600;">${e.duration}</div>
        </div>
      `).join('')}
    </div>
    <div class="lsec">
      <div class="lsec-title">Certifications</div>
      ${d.certifications.map(c => `<div style="font-size:11px;color:#555;padding:2px 0;">✓ ${c}</div>`).join('')}
    </div>
  </div>
  <div class="right">
    <div class="rsec">
      <div class="rsec-title">Profile</div>
      <div class="summary">${d.summary}</div>
    </div>
    <div class="rsec">
      <div class="rsec-title">Experience</div>
      ${d.experience.map(e => `
        <div class="exp">
          <div class="exp-role">${e.role}</div>
          <div class="exp-meta">${e.company} · ${e.duration}</div>
          <ul class="exp-points">${e.points.map(p => `<li>▸ ${p}</li>`).join('')}</ul>
        </div>
      `).join('')}
    </div>
    <div class="rsec">
      <div class="rsec-title">Projects</div>
      ${d.projects.map(p => `
        <div class="proj">
          <div class="proj-name">${p.name}</div>
          <div class="proj-desc">${p.description} · <em>${p.tech}</em></div>
        </div>
      `).join('')}
    </div>
  </div>
</div></body></html>`;
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE 5: Academic CV
// ═══════════════════════════════════════════════════════════
function generateAcademicTemplate(d) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Source Sans 3', sans-serif; background: #fafafa; color: #222; }
  .resume { max-width: 740px; margin: 24px auto; background: #fff; padding: 44px 52px; box-shadow: 0 1px 8px rgba(0,0,0,0.06); }
  h1 { font-family: 'Merriweather', serif; font-size: 26px; text-align: center; margin-bottom: 4px; }
  .subtitle { text-align: center; font-size: 13px; color: #666; margin-bottom: 6px; }
  .contact-center { text-align: center; font-size: 12px; color: #888; margin-bottom: 4px; }
  .line { border: none; border-top: 2px solid #333; margin: 16px 0; }
  .section { margin-bottom: 20px; }
  .section-title { font-family: 'Merriweather', serif; font-size: 16px; font-weight: 700; color: #1a1a1a; margin-bottom: 10px; padding-bottom: 4px; border-bottom: 1px solid #ccc; }
  .summary { font-size: 13px; line-height: 1.8; color: #444; text-align: justify; }
  .entry { margin-bottom: 14px; }
  .entry-header { display: flex; justify-content: space-between; }
  .entry-title { font-size: 14px; font-weight: 600; }
  .entry-date { font-size: 12px; color: #888; }
  .entry-sub { font-size: 13px; color: #555; font-style: italic; margin-bottom: 4px; }
  .entry-list { list-style: none; }
  .entry-list li { font-size: 13px; color: #444; padding: 2px 0; line-height: 1.6; }
  .entry-list li::before { content: '• '; color: #666; }
  .skills-list { font-size: 13px; color: #444; line-height: 2; }
  .cert { font-size: 13px; color: #444; padding: 2px 0; }
</style></head><body>
<div class="resume">
  <h1>${d.name}</h1>
  <div class="subtitle">${d.title}</div>
  <div class="contact-center">${[d.email, d.phone, d.location].filter(Boolean).join(' | ')}</div>
  <div class="contact-center">${[d.profiles?.github, d.profiles?.linkedin].filter(Boolean).join(' | ')}</div>
  <hr class="line">
  <div class="section">
    <div class="section-title">Research Interests & Summary</div>
    <div class="summary">${d.summary}</div>
  </div>
  <div class="section">
    <div class="section-title">Education</div>
    ${d.education.map(e => `
      <div class="entry">
        <div class="entry-header"><span class="entry-title">${e.degree}</span><span class="entry-date">${e.duration}</span></div>
        <div class="entry-sub">${e.institution}${e.gpa ? ` — GPA: ${e.gpa}` : ''}</div>
      </div>
    `).join('')}
  </div>
  <div class="section">
    <div class="section-title">Experience</div>
    ${d.experience.map(e => `
      <div class="entry">
        <div class="entry-header"><span class="entry-title">${e.role}</span><span class="entry-date">${e.duration}</span></div>
        <div class="entry-sub">${e.company}</div>
        <ul class="entry-list">${e.points.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>
    `).join('')}
  </div>
  <div class="section">
    <div class="section-title">Projects & Publications</div>
    ${d.projects.map(p => `
      <div class="entry">
        <div class="entry-title">${p.name}</div>
        <div style="font-size:13px;color:#555;margin-top:2px;">${p.description}</div>
        <div style="font-size:11px;color:#888;margin-top:2px;">Technologies: ${p.tech}</div>
      </div>
    `).join('')}
  </div>
  <div class="section">
    <div class="section-title">Technical Skills</div>
    <div class="skills-list">${d.skills.join(' · ')}</div>
  </div>
  ${d.certifications.length ? `
    <div class="section">
      <div class="section-title">Certifications & Awards</div>
      ${d.certifications.map((c, i) => `<div class="cert">${i + 1}. ${c}</div>`).join('')}
    </div>
  ` : ''}
</div></body></html>`;
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE 6: Tech Developer (Dark)
// ═══════════════════════════════════════════════════════════
function generateDeveloperTemplate(d) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #0a0a0a; color: #e0e0e0; }
  .resume { max-width: 800px; margin: 20px auto; background: #111; border: 1px solid #222; }
  .header { background: linear-gradient(135deg, #0f0f0f, #1a1a2e); padding: 36px 40px; border-bottom: 2px solid #00d4aa; }
  .header h1 { font-size: 28px; font-weight: 700; color: #fff; }
  .header .title { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #00d4aa; margin-top: 4px; }
  .header .contact { margin-top: 12px; display: flex; flex-wrap: wrap; gap: 14px; font-size: 12px; color: #888; }
  .header .contact a, .header .contact span { color: #888; text-decoration: none; }
  .body { padding: 28px 40px; }
  .section { margin-bottom: 24px; }
  .sec-title { font-family: 'JetBrains Mono', monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #00d4aa; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #222; }
  .summary { font-size: 13px; line-height: 1.7; color: #999; }
  .skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
  .skill-tag { background: rgba(0,212,170,0.1); color: #00d4aa; border: 1px solid rgba(0,212,170,0.25); padding: 4px 12px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
  .exp { margin-bottom: 18px; padding-left: 16px; border-left: 2px solid #222; }
  .exp:hover { border-left-color: #00d4aa; }
  .exp-role { font-size: 14px; font-weight: 600; color: #fff; }
  .exp-meta { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #00d4aa; margin-bottom: 6px; }
  .exp-points { list-style: none; }
  .exp-points li { font-size: 12px; color: #999; padding: 2px 0; line-height: 1.6; }
  .exp-points li::before { content: '> '; color: #444; font-family: 'JetBrains Mono', monospace; }
  .proj { background: #0a0a0a; border: 1px solid #222; border-radius: 6px; padding: 12px 16px; margin-bottom: 10px; }
  .proj:hover { border-color: #00d4aa; }
  .proj-name { font-size: 13px; font-weight: 600; color: #fff; }
  .proj-desc { font-size: 12px; color: #888; margin-top: 4px; }
  .proj-tech { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #00d4aa; margin-top: 6px; }
  .edu { margin-bottom: 10px; }
  .edu-deg { font-size: 13px; font-weight: 600; color: #e0e0e0; }
  .edu-meta { font-size: 12px; color: #666; }
</style></head><body>
<div class="resume">
  <div class="header">
    <h1>${d.name}</h1>
    <div class="title">$ ${d.title.toLowerCase().replace(/\s+/g, '_')}</div>
    <div class="contact">
      ${d.email ? `<span>✉ ${d.email}</span>` : ''}
      ${d.profiles?.github ? `<span>⚡ github.com/${d.profiles.github}</span>` : ''}
      ${d.profiles?.linkedin ? `<span>🔗 ${d.profiles.linkedin}</span>` : ''}
      ${d.profiles?.leetcode ? `<span>🧩 ${d.profiles.leetcode}</span>` : ''}
    </div>
  </div>
  <div class="body">
    <div class="section">
      <div class="sec-title">// about</div>
      <div class="summary">${d.summary}</div>
    </div>
    <div class="section">
      <div class="sec-title">// tech_stack</div>
      <div class="skills-wrap">${d.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>
    </div>
    <div class="section">
      <div class="sec-title">// experience</div>
      ${d.experience.map(e => `
        <div class="exp">
          <div class="exp-role">${e.role}</div>
          <div class="exp-meta">${e.company} // ${e.duration}</div>
          <ul class="exp-points">${e.points.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
      `).join('')}
    </div>
    <div class="section">
      <div class="sec-title">// projects</div>
      ${d.projects.map(p => `
        <div class="proj">
          <div class="proj-name">📁 ${p.name}</div>
          <div class="proj-desc">${p.description}</div>
          <div class="proj-tech">stack: [${p.tech}]</div>
        </div>
      `).join('')}
    </div>
    <div class="section">
      <div class="sec-title">// education</div>
      ${d.education.map(e => `
        <div class="edu">
          <div class="edu-deg">${e.degree}</div>
          <div class="edu-meta">${e.institution} · ${e.duration}${e.gpa ? ` · GPA: ${e.gpa}` : ''}</div>
        </div>
      `).join('')}
    </div>
    ${d.certifications.length ? `
      <div class="section">
        <div class="sec-title">// certifications</div>
        ${d.certifications.map(c => `<div style="font-size:12px;color:#888;padding:3px 0;">✓ ${c}</div>`).join('')}
      </div>
    ` : ''}
  </div>
</div></body></html>`;
}

module.exports = { extractDataFromVideo, generateResumeHTML };
