import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, CircularProgress, Chip,
  LinearProgress, Alert, Card, CardContent
} from '@mui/material';
import { analyzeAPI, uploadAPI } from '../services/api';

const ResumeAnalyzer = () => {
  const [jobRole, setJobRole] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [parsedSkills, setParsedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);
    setUploading(true);
    setError('');
    try {
      const res = await uploadAPI.uploadResume(file);
      if (res.data.parsed?.skills) {
        setParsedSkills(res.data.parsed.skills);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!jobRole.trim()) {
      setError('Please enter a target job role');
      return;
    }
    setLoading(true);
    setError('');
    setAnalysis(null);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await analyzeAPI.analyzeResume({
        jobRole,
        resumeData: {
          name: user.name || '',
          email: user.email || '',
          skills: parsedSkills,
          certifications: [],
          profiles: {},
        },
      });
      setAnalysis(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error analyzing resume');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return '#22d3a4';
    if (score >= 50) return '#fbbf24';
    return '#f87171';
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, mb: 0.5 }}>
          Role-Based Resume Analyzer
          <Chip label="AI" size="small" sx={{ ml: 1, bgcolor: 'rgba(124,110,245,0.15)', color: '#a594f9', fontWeight: 600, fontSize: '0.7rem' }} />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Analyze your resume against your target job role and get a detailed score.
        </Typography>
      </Box>

      <Card sx={{ bgcolor: '#16161f', mb: 3 }}>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* Job Role Input */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#888899', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500, mb: 0.5, display: 'block' }}>
              🎯 Target Job Role
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. Data Analyst, Python Developer, UX Designer..."
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              size="small"
            />
          </Box>

          {/* File Upload Zone */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#888899', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500, mb: 0.5, display: 'block' }}>
              📄 Upload Resume PDF
            </Typography>
            <Box
              sx={{
                border: '2px dashed rgba(255,255,255,0.15)',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#7c6ef5',
                  bgcolor: 'rgba(124,110,245,0.04)',
                },
              }}
            >
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileUpload}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              />
              <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>📋</Typography>
              <Typography variant="body2" color="text.secondary">
                <strong style={{ color: '#a594f9' }}>Click or drag</strong> your resume here
              </Typography>
              <Typography variant="caption" color="text.secondary">PDF, DOC, TXT supported</Typography>
            </Box>
            {uploading && <LinearProgress sx={{ mt: 1 }} />}
            {resumeFile && !uploading && (
              <Typography variant="caption" sx={{ color: '#22d3a4', mt: 0.5, display: 'block' }}>
                ✅ {resumeFile.name}
              </Typography>
            )}
            {parsedSkills.length > 0 && (
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ width: '100%', mb: 0.5 }}>Extracted skills:</Typography>
                {parsedSkills.map((skill, i) => (
                  <Chip key={i} label={skill} size="small" sx={{ bgcolor: 'rgba(34,211,164,0.12)', color: '#22d3a4', fontSize: '0.75rem' }} />
                ))}
              </Box>
            )}
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleAnalyze}
            disabled={loading}
            sx={{ mt: 1, py: 1.2, fontSize: '0.95rem' }}
          >
            {loading ? <CircularProgress size={22} /> : '🔍 Analyze Resume with AI'}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card sx={{ bgcolor: '#1e1e2a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, mb: 2 }}>
              📊 Analysis Results for "{analysis.targetRole}"
            </Typography>

            {/* Score Ring */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
              <Box sx={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={getScoreColor(analysis.score)}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - analysis.score / 100)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <Box sx={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Syne', sans-serif", fontSize: '1.6rem', fontWeight: 700,
                  color: getScoreColor(analysis.score),
                }}>
                  {analysis.score}
                </Box>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>
                  Resume Score: {analysis.score}/100
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {analysis.score >= 75 ? 'Strong resume with good alignment to the role.' :
                   analysis.score >= 50 ? 'Decent resume. Some key areas need improvement.' :
                   'Needs significant work to match the role.'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Skill Match: <strong style={{ color: '#f0f0f8' }}>{analysis.skillMatch}%</strong>
                </Typography>
                <Box sx={{ bgcolor: '#1a1a24', borderRadius: 100, height: 8, mt: 0.5, overflow: 'hidden' }}>
                  <Box sx={{
                    height: '100%', borderRadius: 100,
                    background: 'linear-gradient(90deg, #7c6ef5, #22d3a4)',
                    width: `${analysis.skillMatch}%`,
                    transition: 'width 1s ease',
                  }} />
                </Box>
              </Box>
            </Box>

            {/* Matched Skills */}
            {analysis.matchedSkills?.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#888899', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, mb: 0.75, display: 'block' }}>
                  ✅ Matching Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {analysis.matchedSkills.map((skill, i) => (
                    <Chip key={i} label={skill} size="small" sx={{ bgcolor: 'rgba(34,211,164,0.12)', color: '#22d3a4', border: '1px solid rgba(34,211,164,0.25)', fontWeight: 500, fontSize: '0.775rem' }} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Missing Skills */}
            {analysis.missingSkills?.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#888899', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, mb: 0.75, display: 'block' }}>
                  ❌ Missing Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {analysis.missingSkills.map((skill, i) => (
                    <Chip key={i} label={skill} size="small" sx={{ bgcolor: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)', fontWeight: 500, fontSize: '0.775rem' }} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Suggestions */}
            {analysis.suggestions?.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ color: '#888899', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, mb: 1, display: 'block' }}>
                  💡 AI Improvement Suggestions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {analysis.suggestions.map((sug, i) => (
                    <Box key={i} sx={{
                      bgcolor: '#16161f', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 1, p: 1.5, display: 'flex', gap: 1, alignItems: 'flex-start',
                    }}>
                      <Typography sx={{ fontSize: '1.2rem', flexShrink: 0 }}>{sug.icon}</Typography>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#a594f9', display: 'block', mb: 0.25 }}>
                          {sug.label}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#888899' }}>
                          {sug.text}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ResumeAnalyzer;
