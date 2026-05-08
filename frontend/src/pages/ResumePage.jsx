import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Container, Button, CircularProgress, Chip, Card, CardContent, Fade, Alert,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { resumeAPI } from '../services/api';

const templateNames = {
  modern: 'Modern Professional',
  creative: 'Creative Portfolio',
  minimal: 'Minimal Clean',
  altacv: 'AltaCV Infographic',
  academic: 'Academic CV',
  developer: 'Tech Developer',
};

const ResumePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { templateId, extractedData } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resumeHTML, setResumeHTML] = useState('');
  const [resumeData, setResumeData] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    if (!templateId) { navigate('/templates'); return; }

    generateResume();
    // eslint-disable-next-line
  }, []);

  const generateResume = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await resumeAPI.generateResume(templateId, extractedData);
      setResumeHTML(res.data.html);
      setResumeData(res.data.data);
    } catch (err) {
      setError('Failed to generate resume: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = () => {
    if (!resumeHTML) return;
    const blob = new Blob([resumeHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_${templateId}_${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printResume = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.print();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0f' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Button
          onClick={() => navigate('/templates', { state: { extractedData } })}
          sx={{ color: '#888899', mb: 1, fontSize: '0.875rem', '&:hover': { color: '#f0f0f8' } }}
        >
          ← Back to Templates
        </Button>

        <Fade in timeout={600}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  background: 'linear-gradient(135deg, #f0f0f8, #22d3a4)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}
              >
                Your Resume is Ready!
              </Typography>
              <Chip
                label={templateNames[templateId] || templateId}
                size="small"
                sx={{
                  bgcolor: 'rgba(34,211,164,0.12)', color: '#22d3a4',
                  fontWeight: 600, fontSize: '0.75rem',
                  border: '1px solid rgba(34,211,164,0.25)',
                }}
              />
            </Box>
            <Typography variant="body1" sx={{ color: '#888899' }}>
              Preview your AI-generated resume below. Download as HTML or print to PDF.
            </Typography>
          </Box>
        </Fade>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', py: 12, gap: 2,
          }}>
            <CircularProgress size={48} sx={{ color: '#7c6ef5' }} />
            <Typography variant="body1" sx={{ color: '#a594f9', fontWeight: 500 }}>
              Generating your resume...
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Applying {templateNames[templateId] || templateId} template to your data
            </Typography>
          </Box>
        )}

        {/* Resume Preview + Actions */}
        {!loading && resumeHTML && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 300px' }, gap: 3 }}>
            {/* Resume Preview */}
            <Card sx={{
              overflow: 'hidden',
              border: '1px solid rgba(34,211,164,0.15)',
            }}>
              <Box sx={{
                bgcolor: '#f5f5f5', p: 0,
                minHeight: 700,
              }}>
                <iframe
                  ref={iframeRef}
                  srcDoc={resumeHTML}
                  title="Resume Preview"
                  style={{
                    width: '100%',
                    minHeight: 900,
                    border: 'none',
                    display: 'block',
                  }}
                />
              </Box>
            </Card>

            {/* Actions Panel */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Download Card */}
              <Card sx={{
                background: 'linear-gradient(135deg, rgba(34,211,164,0.08), rgba(34,211,164,0.02))',
                border: '1px solid rgba(34,211,164,0.15)',
              }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontFamily: "'Syne', sans-serif", color: '#22d3a4', mb: 2, fontWeight: 700 }}>
                    📥 Download & Share
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={downloadResume}
                    fullWidth
                    sx={{
                      mb: 1.5, py: 1.2,
                      background: 'linear-gradient(135deg, #22d3a4, #18a87f)',
                      boxShadow: '0 4px 16px rgba(34,211,164,0.3)',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #18a87f, #15946e)',
                        boxShadow: '0 6px 20px rgba(34,211,164,0.4)',
                      },
                    }}
                  >
                    📄 Download HTML
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={printResume}
                    fullWidth
                    sx={{
                      py: 1.2, color: '#22d3a4',
                      borderColor: 'rgba(34,211,164,0.3)',
                      '&:hover': {
                        borderColor: '#22d3a4',
                        bgcolor: 'rgba(34,211,164,0.06)',
                      },
                    }}
                  >
                    🖨️ Print / Save as PDF
                  </Button>

                  <Typography variant="caption" sx={{ color: '#666', mt: 1.5, display: 'block', lineHeight: 1.5 }}>
                    💡 Tip: Use "Print → Save as PDF" for the best PDF output.
                  </Typography>
                </CardContent>
              </Card>

              {/* Edit Options */}
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontFamily: "'Syne', sans-serif", mb: 2, fontWeight: 700 }}>
                    🔄 Want changes?
                  </Typography>

                  <Button
                    variant="outlined"
                    onClick={() => navigate('/templates', { state: { extractedData } })}
                    fullWidth
                    sx={{
                      mb: 1, py: 1, color: '#a594f9',
                      borderColor: 'rgba(124,110,245,0.3)',
                      fontSize: '0.875rem',
                      '&:hover': {
                        borderColor: '#7c6ef5',
                        bgcolor: 'rgba(124,110,245,0.06)',
                      },
                    }}
                  >
                    🎨 Try Different Template
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => navigate('/dashboard')}
                    fullWidth
                    sx={{
                      py: 1, color: '#888899',
                      borderColor: 'rgba(255,255,255,0.1)',
                      fontSize: '0.875rem',
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: '#f0f0f8',
                      },
                    }}
                  >
                    📹 Re-record Video
                  </Button>
                </CardContent>
              </Card>

              {/* Resume Data Summary */}
              {resumeData && (
                <Card>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ fontFamily: "'Syne', sans-serif", mb: 1.5, fontWeight: 700 }}>
                      📋 Extracted Data
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" sx={{ color: '#666', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                        Name
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#f0f0f8', fontWeight: 500 }}>
                        {resumeData.name}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" sx={{ color: '#666', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                        Skills ({resumeData.skills?.length || 0})
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {resumeData.skills?.slice(0, 8).map((skill, i) => (
                          <Chip
                            key={i} label={skill} size="small"
                            sx={{
                              bgcolor: 'rgba(124,110,245,0.1)', color: '#a594f9',
                              fontSize: '0.7rem', height: 22,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                        Experience ({resumeData.experience?.length || 0} entries)
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ResumePage;
