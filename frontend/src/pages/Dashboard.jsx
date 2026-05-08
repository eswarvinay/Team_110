import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Container, CircularProgress, Alert,
  Card, CardContent, Chip, Fade, TextField,
} from '@mui/material';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { uploadAPI, resumeAPI, userAPI } from '../services/api';

const promptSuggestions = [
  "Introduce yourself — name, background, and what drives you",
  "Describe your educational journey and key achievements",
  "Talk about your technical skills and projects you've built",
  "Share your work experience and internships",
  "What are your career goals and dream role?",
];

const Dashboard = () => {
  const navigate = useNavigate();

  // Video recording state
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  // Processing state
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [extractedData, setExtractedData] = useState(null);

  // Student information state
  const [info, setInfo] = useState({
    name: '',
    certifications: '',
    github: '',
    linkedin: '',
    leetcode: '',
    hackerrank: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Auth check & load profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }

    // Pre-populate from localStorage as fallback
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.name) {
      setInfo(prev => ({ ...prev, name: storedUser.name }));
    }

    userAPI.getProfile()
      .then(res => {
        const u = res.data;
        setInfo({
          name: u.name || storedUser.name || '',
          certifications: (u.certifications || []).join(', '),
          github: u.profiles?.github || '',
          linkedin: u.profiles?.linkedin || '',
          leetcode: u.profiles?.leetcode || '',
          hackerrank: u.profiles?.hackerrank || '',
        });
      })
      .catch((err) => {
        // If user not found (server restarted), force re-login
        if (err.response?.status === 404) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
        }
      });
  }, [navigate]);

  // Recording timer
  useEffect(() => {
    if (!recording) return;
    const interval = setInterval(() => setRecordingTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [recording]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // ── Video Recording ────────────────────────────────────

  const startRecording = useCallback(() => {
    if (!webcamRef.current?.stream) {
      setCameraError('Camera not ready. Please wait and try again.');
      return;
    }
    chunksRef.current = [];
    setVideoBlob(null);
    setVideoUrl(null);
    setExtractedData(null);
    setRecordingTime(0);

    const mr = new MediaRecorder(webcamRef.current.stream, { mimeType: 'video/webm' });
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setVideoBlob(blob);
      setVideoUrl(URL.createObjectURL(blob));
    };
    mr.start();
    mediaRecorderRef.current = mr;
    setRecording(true);
    setCameraError('');
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
    }
    setRecording(false);
  }, []);

  const retakeVideo = () => {
    setVideoUrl(null);
    setVideoBlob(null);
    setExtractedData(null);
  };

  // ── Student Info ─────────────────────────────────────
  const handleInfoChange = (field) => (e) => {
    setInfo(prev => ({ ...prev, [field]: e.target.value }));
  };

  const saveProfile = async () => {
    setProfileSaving(true);
    setProfileMsg('');
    try {
      await userAPI.updateProfile({
        name: info.name,
        certifications: info.certifications.split(',').map(s => s.trim()).filter(Boolean),
        profiles: {
          github: info.github,
          linkedin: info.linkedin,
          leetcode: info.leetcode,
          hackerrank: info.hackerrank,
        },
      });
      setProfileMsg('✅ Profile updated successfully!');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.name = info.name;
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      setProfileMsg('❌ Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Process Video (simulate LLM extraction) ───────────

  const processVideo = async () => {
    if (!videoBlob) return;
    setProcessing(true);
    setCameraError('');

    try {
      // Step 1: Save profile first
      setProcessingStep('Saving your profile...');
      await userAPI.updateProfile({
        name: info.name,
        certifications: info.certifications.split(',').map(s => s.trim()).filter(Boolean),
        profiles: {
          github: info.github,
          linkedin: info.linkedin,
          leetcode: info.leetcode,
          hackerrank: info.hackerrank,
        },
      });

      // Step 2: Upload video
      setProcessingStep('Uploading your video...');
      await uploadAPI.uploadVideo(videoBlob);

      // Step 3: Simulate transcription delay
      setProcessingStep('🎙️ Transcribing audio with AI...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 4: Extract structured data via LLM (simulated)
      setProcessingStep('🧠 AI is analyzing your introduction...');
      // Pass student form data as videoContext so it appears in the resume
      const videoContext = {
        name: info.name,
        certifications: info.certifications.split(',').map(s => s.trim()).filter(Boolean),
        profiles: {
          github: info.github,
          linkedin: info.linkedin,
          leetcode: info.leetcode,
          hackerrank: info.hackerrank,
        },
      };
      const res = await resumeAPI.extractFromVideo(videoContext);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProcessingStep('✅ Data extracted successfully!');
      setExtractedData(res.data.data);

      // Wait a moment, then navigate to templates
      await new Promise(resolve => setTimeout(resolve, 800));
      navigate('/templates', { state: { extractedData: res.data.data } });

    } catch (err) {
      setCameraError('Error processing video: ' + (err.response?.data?.error || err.message));
    } finally {
      setProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0f' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Header */}
        <Fade in timeout={600}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Chip
              label="AI-Powered"
              size="small"
              sx={{
                bgcolor: 'rgba(124,110,245,0.12)', color: '#a594f9',
                fontWeight: 600, fontSize: '0.75rem', mb: 1.5,
                border: '1px solid rgba(124,110,245,0.2)',
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                background: 'linear-gradient(135deg, #f0f0f8, #a594f9)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Record Your Introduction
            </Typography>
            <Typography variant="body1" sx={{ color: '#888899', maxWidth: 540, mx: 'auto' }}>
              Tell us about yourself on camera. Our AI will extract your details
              and create a professional resume for you.
            </Typography>
          </Box>
        </Fade>

        {/* Main Content - Two Column Layout */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' }, gap: 3 }}>

          {/* ═══ LEFT COLUMN: Camera + Student Info ═══ */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Camera Panel */}
            <Card sx={{
              overflow: 'hidden',
              border: recording ? '1px solid rgba(248,113,113,0.4)' : '1px solid rgba(255,255,255,0.08)',
              transition: 'border-color 0.3s',
            }}>
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                {/* Camera Feed */}
                <Box
                  sx={{
                    bgcolor: '#000', overflow: 'hidden',
                    aspectRatio: '16/9', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {!videoUrl ? (
                    <>
                      <Webcam
                        ref={webcamRef}
                        audio
                        muted
                        onUserMedia={() => { setCameraReady(true); setCameraError(''); }}
                        onUserMediaError={() => setCameraError('Camera access denied. Please allow camera permissions.')}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {recording && (
                        <Box sx={{
                          position: 'absolute', top: 16, left: 16,
                          display: 'flex', alignItems: 'center', gap: 0.75,
                          bgcolor: 'rgba(0,0,0,0.7)', borderRadius: 1, px: 1.5, py: 0.5,
                          backdropFilter: 'blur(8px)',
                        }}>
                          <Box sx={{
                            width: 10, height: 10, bgcolor: '#f87171', borderRadius: '50%',
                            animation: 'pulse 1s infinite',
                            '@keyframes pulse': {
                              '0%,100%': { opacity: 1 },
                              '50%': { opacity: 0.3 },
                            },
                          }} />
                          <Typography variant="body2" sx={{ color: '#f87171', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                            REC {formatTime(recordingTime)}
                          </Typography>
                        </Box>
                      )}
                      {!cameraReady && !cameraError && (
                        <Box sx={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={32} sx={{ color: '#7c6ef5' }} />
                          <Typography variant="caption" sx={{ color: '#888' }}>Starting camera...</Typography>
                        </Box>
                      )}
                    </>
                  ) : (
                    <video src={videoUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </Box>

                {/* Controls */}
                <Box sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {cameraError && <Alert severity="error" sx={{ mb: 1.5, fontSize: '0.85rem' }}>{cameraError}</Alert>}

                  {/* Processing state */}
                  {processing && (
                    <Box sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5,
                      bgcolor: 'rgba(124,110,245,0.08)', borderRadius: 1,
                      p: 1.5, mb: 1.5,
                      border: '1px solid rgba(124,110,245,0.2)',
                    }}>
                      <CircularProgress size={20} sx={{ color: '#a594f9' }} />
                      <Typography variant="body2" sx={{ color: '#a594f9', fontWeight: 500 }}>
                        {processingStep}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {!recording && !videoUrl && (
                      <Button
                        variant="contained"
                        onClick={startRecording}
                        disabled={!cameraReady || processing}
                        fullWidth
                        sx={{
                          py: 1.3, fontSize: '1rem',
                          bgcolor: '#f87171',
                          '&:hover': { bgcolor: '#ef4444' },
                          boxShadow: '0 4px 20px rgba(248,113,113,0.3)',
                        }}
                      >
                        ⏺ Start Recording
                      </Button>
                    )}
                    {recording && (
                      <Button
                        variant="contained"
                        onClick={stopRecording}
                        fullWidth
                        sx={{
                          py: 1.3, fontSize: '1rem',
                          bgcolor: '#f87171',
                          animation: 'pulse-btn 2s infinite',
                          '@keyframes pulse-btn': {
                            '0%,100%': { boxShadow: '0 0 0 0 rgba(248,113,113,0.4)' },
                            '50%': { boxShadow: '0 0 0 12px rgba(248,113,113,0)' },
                          },
                          '&:hover': { bgcolor: '#dc2626' },
                        }}
                      >
                        ⏹ Stop Recording — {formatTime(recordingTime)}
                      </Button>
                    )}
                    {videoUrl && !processing && (
                      <>
                        <Button
                          variant="outlined"
                          onClick={retakeVideo}
                          sx={{
                            flex: 1, py: 1.1, color: '#888899',
                            borderColor: 'rgba(255,255,255,0.15)',
                            '&:hover': { borderColor: '#60a5fa', color: '#60a5fa' },
                          }}
                        >
                          🔄 Retake
                        </Button>
                        <Button
                          variant="contained"
                          onClick={processVideo}
                          sx={{
                            flex: 2, py: 1.1, fontSize: '1rem',
                            background: 'linear-gradient(135deg, #7c6ef5, #a594f9)',
                            boxShadow: '0 4px 20px rgba(124,110,245,0.3)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #6c5ee5, #9584e9)',
                              boxShadow: '0 6px 24px rgba(124,110,245,0.4)',
                            },
                          }}
                        >
                          🚀 Analyze & Choose Template
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* ═══ STUDENT INFORMATION FORM ═══ */}
            <Card sx={{
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'border-color 0.3s',
              '&:hover': { borderColor: 'rgba(124,110,245,0.2)' },
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 700, mb: 0.5,
                    display: 'flex', alignItems: 'center', gap: 1,
                  }}
                >
                  👤 Student Information
                </Typography>
                <Typography variant="caption" sx={{ color: '#666', mb: 2.5, display: 'block' }}>
                  Fill in your details — these will be used to generate your resume.
                </Typography>

                {/* Profile Messages */}
                {profileMsg && (
                  <Alert
                    severity={profileMsg.startsWith('✅') ? 'success' : 'error'}
                    sx={{ mb: 2, fontSize: '0.85rem' }}
                  >
                    {profileMsg}
                  </Alert>
                )}

                {/* Full Name */}
                <TextField
                  label="Full Name"
                  value={info.name}
                  onChange={handleInfoChange('name')}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                  placeholder="e.g. John Doe"
                />

                {/* Certifications */}
                <TextField
                  label="Certifications (comma separated)"
                  value={info.certifications}
                  onChange={handleInfoChange('certifications')}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                  placeholder="e.g. AWS Cloud, Google Analytics, Power BI"
                />

                {/* Coding Profile Links */}
                <Typography variant="caption" sx={{
                  color: '#888899', textTransform: 'uppercase', fontWeight: 600,
                  letterSpacing: '0.05em', mb: 1.5, display: 'block',
                  borderTop: '1px solid rgba(255,255,255,0.06)', pt: 2,
                }}>
                  🔗 Coding Profiles
                </Typography>

                {[
                  { key: 'github', icon: '🐙', label: 'GitHub', placeholder: 'https://github.com/username' },
                  { key: 'linkedin', icon: '💼', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
                  { key: 'leetcode', icon: '🧩', label: 'LeetCode', placeholder: 'https://leetcode.com/username' },
                  { key: 'hackerrank', icon: '🏅', label: 'HackerRank', placeholder: 'https://hackerrank.com/username' },
                ].map(({ key, icon, label, placeholder }) => (
                  <Box key={key} sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    bgcolor: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 1, px: 1.5, py: 0.75, mb: 1,
                    transition: 'border-color 0.2s',
                    '&:hover': { borderColor: 'rgba(124,110,245,0.3)' },
                    '&:focus-within': { borderColor: '#7c6ef5' },
                  }}>
                    <Typography sx={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</Typography>
                    <TextField
                      variant="standard"
                      placeholder={placeholder}
                      label={label}
                      value={info[key]}
                      onChange={handleInfoChange(key)}
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                        sx: { fontSize: '0.85rem', color: '#f0f0f8' },
                      }}
                      InputLabelProps={{
                        sx: { fontSize: '0.8rem', color: '#666' },
                      }}
                    />
                  </Box>
                ))}

                {/* Update Profile Button */}
                <Button
                  variant="contained"
                  onClick={saveProfile}
                  disabled={profileSaving}
                  fullWidth
                  sx={{
                    mt: 2, py: 1.1,
                    bgcolor: '#7c6ef5',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    '&:hover': { bgcolor: '#6c5ee5' },
                  }}
                >
                  {profileSaving ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : '💾 Update Profile'}
                </Button>
              </CardContent>
            </Card>
          </Box>

          {/* ═══ RIGHT COLUMN: Steps + Tips ═══ */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Step Indicator */}
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(124,110,245,0.08), rgba(124,110,245,0.02))',
              border: '1px solid rgba(124,110,245,0.15)',
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle2" sx={{ fontFamily: "'Syne', sans-serif", color: '#a594f9', mb: 1.5, fontWeight: 700 }}>
                  How it works
                </Typography>
                {[
                  { step: '1', label: 'Record a video introduction', active: true },
                  { step: '2', label: 'AI extracts your resume data', active: false },
                  { step: '3', label: 'Pick a professional template', active: false },
                  { step: '4', label: 'Download your resume', active: false },
                ].map((s, i) => (
                  <Box key={i} sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5, mb: 1,
                    opacity: s.active ? 1 : 0.5,
                  }}>
                    <Box sx={{
                      width: 28, height: 28, borderRadius: '50%',
                      bgcolor: s.active ? '#7c6ef5' : 'rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: s.active ? '#fff' : '#666',
                      border: s.active ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    }}>
                      {s.step}
                    </Box>
                    <Typography variant="body2" sx={{ color: s.active ? '#f0f0f8' : '#666', fontWeight: s.active ? 600 : 400 }}>
                      {s.label}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Talking Points */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle2" sx={{ fontFamily: "'Syne', sans-serif", mb: 1.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  💬 What to talk about
                </Typography>
                {promptSuggestions.map((prompt, i) => (
                  <Box key={i} sx={{
                    display: 'flex', gap: 1, mb: 1, alignItems: 'flex-start',
                    bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 1, p: 1,
                    border: '1px solid rgba(255,255,255,0.04)',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(124,110,245,0.06)', borderColor: 'rgba(124,110,245,0.15)' },
                  }}>
                    <Typography sx={{ color: '#7c6ef5', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0, mt: 0.1 }}>
                      {i + 1}.
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#aaa', fontSize: '0.825rem', lineHeight: 1.5 }}>
                      {prompt}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle2" sx={{ fontFamily: "'Syne', sans-serif", mb: 1.5, fontWeight: 700 }}>
                  💡 Recording Tips
                </Typography>
                {[
                  { icon: '☀️', text: 'Good lighting — face a window or light source' },
                  { icon: '🎤', text: 'Clear audio — quiet room, speak clearly' },
                  { icon: '👁️', text: 'Eye contact — look into the camera' },
                  { icon: '⏱️', text: 'Keep it under 2 minutes' },
                ].map((tip, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.75, alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '1rem' }}>{tip.icon}</Typography>
                    <Typography variant="caption" sx={{ color: '#888899' }}>{tip.text}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
