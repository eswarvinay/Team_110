import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, TextField, Container, Tabs, Tab,
  CircularProgress, Alert, Chip, Card, CardContent, LinearProgress
} from '@mui/material';
import Webcam from 'react-webcam';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { userAPI, uploadAPI } from '../services/api';

const VideoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const template = location.state?.template || { name: 'Recording', emoji: '📹' };

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

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
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Student Info state
  const [info, setInfo] = useState({
    name: '', email: '', course: '', university: '',
    certifications: '',
    github: '', linkedin: '', leetcode: '', hackerrank: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Resume generator state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeParsed, setResumeParsed] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);

  // Auth check & load profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }

    userAPI.getProfile()
      .then(res => {
        const u = res.data;
        setInfo({
          name: u.name || '',
          email: u.email || '',
          course: u.course || '',
          university: u.university || '',
          certifications: (u.certifications || []).join(', '),
          github: u.profiles?.github || '',
          linkedin: u.profiles?.linkedin || '',
          leetcode: u.profiles?.leetcode || '',
          hackerrank: u.profiles?.hackerrank || '',
        });
      })
      .catch(() => navigate('/'));
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

  // ── Video Recording ──────────────────────────────────

  const startRecording = useCallback(() => {
    if (!webcamRef.current?.stream) {
      setCameraError('Camera not ready. Please wait and try again.');
      return;
    }
    chunksRef.current = [];
    setVideoBlob(null);
    setVideoUrl(null);
    setSaveSuccess(false);
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

  const saveVideo = async () => {
    if (!videoBlob) return;
    setSaving(true);
    try {
      await uploadAPI.uploadVideo(videoBlob);
      setSaveSuccess(true);
    } catch (err) {
      setCameraError('Error saving video: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  // ── Student Info ─────────────────────────────────────

  const handleInfoChange = (field) => (e) => {
    setInfo(prev => ({ ...prev, [field]: e.target.value }));
  };

  const saveProfile = async () => {
    setProfileLoading(true);
    setProfileMsg('');
    try {
      await userAPI.updateProfile({
        name: info.name,
        phone: '',
        course: info.course,
        university: info.university,
        certifications: info.certifications.split(',').map(s => s.trim()).filter(Boolean),
        profiles: {
          github: info.github,
          linkedin: info.linkedin,
          leetcode: info.leetcode,
          hackerrank: info.hackerrank,
        },
      });
      setProfileMsg('✅ Profile saved successfully!');
      // Update local storage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.name = info.name;
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      setProfileMsg('❌ Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Resume Generator ─────────────────────────────────

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);
    setResumeUploading(true);
    setResumeParsed(null);
    try {
      const res = await uploadAPI.uploadResume(file);
      setResumeParsed(res.data.parsed);
    } catch (err) {
      console.error('Resume upload error:', err);
    } finally {
      setResumeUploading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0f' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Back button */}
        <Button
          onClick={() => navigate('/dashboard')}
          sx={{ color: '#888899', mb: 2, fontSize: '0.875rem', '&:hover': { color: '#f0f0f8' } }}
        >
          ← Back to Dashboard
        </Button>

        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
            {template.emoji} {template.name} Studio
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Record your video introduction and build your profile.
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            mb: 3,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            '& .MuiTabs-indicator': { bgcolor: '#7c6ef5' },
            '& .MuiTab-root': {
              color: '#888899', textTransform: 'none', fontWeight: 500,
              '&.Mui-selected': { color: '#a594f9' },
            },
          }}
        >
          <Tab label="📹 Record Video" />
          <Tab label="👤 My Info" />
          <Tab label="📄 Resume Generator" />
        </Tabs>

        {/* ════════════════ RECORD TAB ════════════════ */}
        {activeTab === 0 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {/* Camera Panel */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontFamily: "'Syne', sans-serif", mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  📹 Camera
                </Typography>

                {cameraError && <Alert severity="error" sx={{ mb: 1.5, fontSize: '0.85rem' }}>{cameraError}</Alert>}

                {/* Camera Feed */}
                <Box
                  sx={{
                    bgcolor: '#000', borderRadius: 1, overflow: 'hidden',
                    aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', mb: 1.5,
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
                          position: 'absolute', top: 12, left: 12,
                          display: 'flex', alignItems: 'center', gap: 0.5,
                          bgcolor: 'rgba(0,0,0,0.6)', borderRadius: 1, px: 1, py: 0.5,
                        }}>
                          <Box sx={{
                            width: 8, height: 8, bgcolor: '#f87171', borderRadius: '50%',
                            animation: 'pulse 1s infinite',
                            '@keyframes pulse': {
                              '0%,100%': { opacity: 1 },
                              '50%': { opacity: 0.3 },
                            },
                          }} />
                          <Typography variant="caption" sx={{ color: '#f87171', fontWeight: 600 }}>
                            REC {formatTime(recordingTime)}
                          </Typography>
                        </Box>
                      )}
                    </>
                  ) : (
                    <video src={videoUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </Box>

                {/* Controls */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {!recording ? (
                    <Button
                      variant="outlined"
                      onClick={startRecording}
                      disabled={!cameraReady || !!videoUrl}
                      sx={{
                        flex: 1, minWidth: 120, color: '#f0f0f8',
                        borderColor: 'rgba(255,255,255,0.15)',
                        '&:hover': { borderColor: '#7c6ef5', color: '#7c6ef5' },
                      }}
                    >
                      ⏺ Record
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={stopRecording}
                      sx={{
                        flex: 1, minWidth: 120,
                        bgcolor: 'rgba(248,113,113,0.15)',
                        borderColor: '#f87171', color: '#f87171',
                        '&:hover': { bgcolor: 'rgba(248,113,113,0.25)' },
                      }}
                    >
                      ⏹ Stop
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    onClick={() => { setVideoUrl(null); setVideoBlob(null); setSaveSuccess(false); }}
                    disabled={!videoUrl}
                    sx={{
                      flex: 1, minWidth: 120, color: '#f0f0f8',
                      borderColor: 'rgba(255,255,255,0.15)',
                      '&:hover': { borderColor: '#60a5fa', color: '#60a5fa' },
                    }}
                  >
                    🔄 Retake
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={saveVideo}
                    disabled={!videoBlob || saving || saveSuccess}
                    sx={{
                      flex: 1, minWidth: 120,
                      ...(saveSuccess
                        ? { bgcolor: 'rgba(34,211,164,0.15)', borderColor: '#22d3a4', color: '#22d3a4' }
                        : { color: '#f0f0f8', borderColor: 'rgba(255,255,255,0.15)', '&:hover': { borderColor: '#22d3a4', color: '#22d3a4' } }),
                    }}
                  >
                    {saving ? <CircularProgress size={18} /> : saveSuccess ? '✅ Saved' : '💾 Save'}
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Tips Panel */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontFamily: "'Syne', sans-serif", mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  💡 Recording Tips
                </Typography>
                {[
                  { icon: '☀️', title: 'Good Lighting', text: 'Face a window or light source for the best look.' },
                  { icon: '🎤', title: 'Clear Audio', text: 'Minimize background noise. Speak clearly.' },
                  { icon: '👔', title: 'Dress Professionally', text: 'First impressions matter even in video.' },
                  { icon: '⏱️', title: 'Keep it Concise', text: 'Aim for 60–90 seconds. Cover name, skills, goals.' },
                  { icon: '👁️', title: 'Eye Contact', text: 'Look into the camera, not at your screen.' },
                ].map((tip, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1.5, alignItems: 'flex-start' }}>
                    <Typography sx={{ fontSize: '1.2rem' }}>{tip.icon}</Typography>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>{tip.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{tip.text}</Typography>
                    </Box>
                  </Box>
                ))}
                {saveSuccess && (
                  <Alert severity="success" sx={{ mt: 2, fontSize: '0.85rem' }}>
                    ✅ Video saved successfully!
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Box>
        )}

        {/* ════════════════ INFO TAB ════════════════ */}
        {activeTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: "'Syne', sans-serif", mb: 2 }}>👤 Student Information</Typography>

              {profileMsg && (
                <Alert severity={profileMsg.startsWith('✅') ? 'success' : 'error'} sx={{ mb: 2, fontSize: '0.85rem' }}>
                  {profileMsg}
                </Alert>
              )}

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                <TextField label="Full Name" value={info.name} onChange={handleInfoChange('name')} fullWidth size="small" />
                <TextField label="Email" value={info.email} onChange={handleInfoChange('email')} fullWidth size="small" type="email" />
                <TextField label="Course / Major" value={info.course} onChange={handleInfoChange('course')} fullWidth size="small" placeholder="e.g. Computer Science" />
                <TextField label="University" value={info.university} onChange={handleInfoChange('university')} fullWidth size="small" />
              </Box>

              {/* Certifications */}
              <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.08)', pt: 2, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontFamily: "'Syne', sans-serif", mb: 1 }}>
                  🎓 Certification Links
                </Typography>
                <TextField
                  fullWidth size="small" multiline rows={3}
                  placeholder={'Paste your certification links here (one per line)\ne.g. https://coursera.org/verify/...'}
                  value={info.certifications}
                  onChange={handleInfoChange('certifications')}
                />
              </Box>

              {/* Profile Links */}
              <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.08)', pt: 2, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontFamily: "'Syne', sans-serif", mb: 1 }}>
                  🔗 Coding Profiles
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                  {[
                    { key: 'github', icon: '🐙', label: 'GitHub URL' },
                    { key: 'linkedin', icon: '💼', label: 'LinkedIn URL' },
                    { key: 'leetcode', icon: '🧩', label: 'LeetCode URL' },
                    { key: 'hackerrank', icon: '🏅', label: 'HackerRank URL' },
                  ].map(({ key, icon, label }) => (
                    <Box key={key} sx={{
                      display: 'flex', alignItems: 'center', gap: 1,
                      bgcolor: '#1a1a24', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 1, px: 1.5, py: 0.75,
                    }}>
                      <Typography sx={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</Typography>
                      <TextField
                        variant="standard"
                        placeholder={label}
                        value={info[key]}
                        onChange={handleInfoChange(key)}
                        fullWidth
                        InputProps={{ disableUnderline: true, sx: { fontSize: '0.85rem', color: '#f0f0f8' } }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>

              <Button
                variant="contained"
                onClick={saveProfile}
                disabled={profileLoading}
                fullWidth
                sx={{ mt: 1, py: 1.1 }}
              >
                {profileLoading ? <CircularProgress size={22} /> : '💾 Save Information'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ════════════════ RESUME GENERATOR TAB ════════════════ */}
        {activeTab === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: "'Syne', sans-serif", mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                📄 Resume Generator
                <Chip label="AI" size="small" sx={{ bgcolor: 'rgba(124,110,245,0.15)', color: '#a594f9', fontWeight: 600, fontSize: '0.7rem' }} />
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                Upload your existing resume — our AI will extract key details including name, skills, and experience.
              </Typography>

              {/* Upload Zone */}
              <Box
                sx={{
                  border: '2px dashed rgba(255,255,255,0.15)', borderRadius: 2,
                  p: 3, textAlign: 'center', cursor: 'pointer', position: 'relative',
                  mb: 2, transition: 'all 0.2s',
                  '&:hover': { borderColor: '#7c6ef5', bgcolor: 'rgba(124,110,245,0.04)' },
                }}
              >
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleResumeUpload}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                />
                <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>📄</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong style={{ color: '#a594f9' }}>Click or drag</strong> your resume here
                </Typography>
                <Typography variant="caption" color="text.secondary">PDF, DOC, TXT supported</Typography>
              </Box>

              {resumeUploading && <LinearProgress sx={{ mb: 2 }} />}

              {resumeFile && !resumeUploading && (
                <Typography variant="caption" sx={{ color: '#22d3a4', mb: 2, display: 'block' }}>
                  ✅ {resumeFile.name} uploaded
                </Typography>
              )}

              {/* Parsed Resume Data */}
              {resumeParsed && (
                <Card sx={{ bgcolor: '#1e1e2a', border: '1px solid rgba(255,255,255,0.08)', mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontFamily: "'Syne', sans-serif", mb: 1.5 }}>
                      📋 Extracted Resume Data
                    </Typography>

                    {resumeParsed.name && (
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" sx={{ color: '#888899', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                          Name
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#f0f0f8' }}>
                          {resumeParsed.name}
                        </Typography>
                      </Box>
                    )}

                    {resumeParsed.skills?.length > 0 && (
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" sx={{ color: '#888899', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', mb: 0.75, display: 'block' }}>
                          Skills Found
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {resumeParsed.skills.map((skill, i) => (
                            <Chip
                              key={i}
                              label={skill}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(34,211,164,0.12)',
                                color: '#22d3a4',
                                border: '1px solid rgba(34,211,164,0.25)',
                                fontWeight: 500,
                                fontSize: '0.775rem',
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {resumeParsed.experience && (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#888899', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', mb: 0.5, display: 'block' }}>
                          Experience
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888899', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                          {resumeParsed.experience.substring(0, 500)}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default VideoPage;
