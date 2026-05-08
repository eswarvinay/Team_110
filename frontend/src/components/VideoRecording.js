import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button, TextField, Card, CardContent, Typography, Grid, Container, CircularProgress, Alert, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ModernTemplate } from './ResumeTemplates';
import TemplateGallery from './TemplateGallery';

const VideoRecording = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioChunksRef = useRef([]);
  const audioStreamRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordAudio, setRecordAudio] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [userName, setUserName] = useState('');
  const [certifications, setCertifications] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [leetcode, setLeetcode] = useState('');
  const [hackerrank, setHackerrank] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedTemplateComponent, setSelectedTemplateComponent] = useState(null);
  const navigate = useNavigate();

  // Add CSS for animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { opacity: 0.3; transform: scaleY(0.8); }
        50% { opacity: 1; transform: scaleY(1.2); }
        100% { opacity: 0.3; transform: scaleY(0.8); }
      }
      @keyframes blink {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0.3; }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // Memoized input handlers
  const handleUserNameChange = useCallback((e) => {
    setUserName(e.target.value);
  }, []);

  const handleCertificationsChange = useCallback((e) => {
    setCertifications(e.target.value);
  }, []);

  const handleGithubChange = useCallback((e) => {
    setGithub(e.target.value);
  }, []);

  const handleLinkedinChange = useCallback((e) => {
    setLinkedin(e.target.value);
  }, []);

  const handleLeetcodeChange = useCallback((e) => {
    setLeetcode(e.target.value);
  }, []);

  const handleHackerrankChange = useCallback((e) => {
    setHackerrank(e.target.value);
  }, []);

  const handleJobRoleChange = useCallback((e) => {
    setJobRole(e.target.value);
  }, []);

  const handleTemplateSelect = useCallback((template) => {
    setSelectedTemplate(template.id);
    setSelectedTemplateComponent(template.component);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
    else {
      axios.get('http://localhost:5000/api/user/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setUserName(res.data.name || '');
          setCertifications(Array.isArray(res.data.certifications) ? res.data.certifications.join(', ') : '');
          setGithub(res.data.profiles?.github || '');
          setLinkedin(res.data.profiles?.linkedin || '');
          setLeetcode(res.data.profiles?.leetcode || '');
          setHackerrank(res.data.profiles?.hackerrank || '');
        })
        .catch(() => navigate('/'));
    }
  }, [navigate]);

  // Recording timer effect
  useEffect(() => {
    if (!recording) {
      setRecordingTime(0);
      return;
    }

    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [recording]);

  // Format time to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoMetadata = (e) => {
    setVideoDuration(e.target.duration);
  };

  const handleAudioMetadata = (e) => {
    setAudioDuration(e.target.duration);
  };

  const startRecording = () => {
    try {
      if (!webcamRef.current || !webcamRef.current.stream) {
        setCameraError('Camera not ready. Please wait a moment and try again.');
        return;
      }

      setRecording(true);
      setVideoBlob(null);
      setVideoUrl(null);
      setAudioUrl(null);
      chunksRef.current = [];
      audioChunksRef.current = [];

      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm'
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      };

      mediaRecorderRef.current.start();

      // Start audio recording if enabled
      if (recordAudio) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            audioStreamRef.current = stream;
            audioRecorderRef.current = new MediaRecorder(stream, {
              mimeType: 'audio/webm'
            });

            audioRecorderRef.current.ondataavailable = (event) => {
              if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
              }
            };

            audioRecorderRef.current.onstop = () => {
              const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
              const url = URL.createObjectURL(blob);
              setAudioUrl(url);
              
              // Stop all audio tracks
              if (audioStreamRef.current) {
                audioStreamRef.current.getTracks().forEach(track => track.stop());
              }
            };

            audioRecorderRef.current.start();
          })
          .catch(error => {
            console.error('Audio access error:', error);
            setCameraError('Audio access denied. Continuing with video only.');
          });
      }

      setCameraError('');
    } catch (error) {
      console.error('Recording error:', error);
      setCameraError('Error starting recording: ' + error.message);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    try {
      setRecording(false);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (audioRecorderRef.current && audioRecorderRef.current.state !== 'inactive') {
        audioRecorderRef.current.stop();
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      setCameraError('Error stopping recording');
    }
  };

  const saveVideo = async () => {
    if (!videoBlob) {
      alert('No video recorded');
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('video', videoBlob, 'recording.webm');
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/upload/video', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Video saved successfully!');
      setVideoBlob(null);
      setVideoUrl(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving video: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const profileData = {
        name: userName,
        certifications: certifications.split(',').map(s => s.trim()).filter(s => s),
        profiles: {
          github,
          linkedin,
          leetcode,
          hackerrank
        }
      };
      await axios.put('http://localhost:5000/api/user/profile', profileData, { headers: { Authorization: `Bearer ${token}` } });
      alert('Profile updated successfully');
    } catch (error) {
      alert('Error updating profile: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const generateResume = async () => {
    if (!userName) {
      alert('Please fill in your name first');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const videoContext = {
        name: userName,
        certifications: certifications.split(',').map(s => s.trim()).filter(s => s),
        profiles: {
          github,
          linkedin,
          leetcode,
          hackerrank
        },
        videoRecorded: Boolean(videoUrl),
        videoDuration,
        audioDuration
      };
      await axios.post('http://localhost:5000/api/resume/generate', {
        templateId: selectedTemplate,
        videoContext
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Resume generated successfully!');
    } catch (error) {
      alert('Error generating resume: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const analyzeResume = async () => {
    if (!jobRole) {
      alert('Please enter a job role');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const resumeData = {
        name: userName,
        email: 'user@example.com', // Placeholder - could be expanded
        phone: '', // Placeholder
        certifications: certifications.split(',').map(s => s.trim()).filter(s => s),
        profiles: {
          github,
          linkedin,
          leetcode,
          hackerrank
        }
      };
      const res = await axios.post('http://localhost:5000/api/analyze/analyze', { jobRole, resumeData }, { headers: { Authorization: `Bearer ${token}` } });
      setAnalysis(res.data);
    } catch (error) {
      alert('Error analyzing resume: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" style={{ padding: '20px' }}>
      <Typography variant="h4" style={{ marginBottom: '20px' }}>Video Recording & Resume Builder</Typography>
      
      <Grid container spacing={3}>
        {/* Video Recording Section */}
        <Grid item xs={12}>
          <Card style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <CardContent>
              <Typography variant="h5" style={{ marginBottom: '15px', fontWeight: 'bold' }}>📹 Video Recording & Audio</Typography>
              
              {cameraError && (
                <Alert severity="error" style={{ marginBottom: '15px' }}>
                  {cameraError}
                </Alert>
              )}

              <Webcam 
                ref={webcamRef}
                onUserMedia={() => {
                  setCameraReady(true);
                  setCameraError('');
                }}
                onUserMediaError={(error) => {
                  setCameraError('Camera access denied. Please allow camera access in browser settings.');
                  console.error('Webcam error:', error);
                }}
                style={{ width: '100%', maxWidth: '500px', borderRadius: '8px', border: '2px solid #667eea' }} 
                muted={true}
              />
              
              {!cameraReady && (
                <Typography variant="body2" style={{ marginTop: '10px', color: '#ff9800' }}>
                  ⏳ Waiting for camera to activate...
                </Typography>
              )}

              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '15px' }}>
                  <input 
                    type="checkbox" 
                    checked={recordAudio} 
                    onChange={(e) => setRecordAudio(e.target.checked)}
                    disabled={recording}
                    style={{ marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <Typography variant="body1">🎤 Record Audio (when recording video)</Typography>
                </label>
                
                {recording && (
                  <Box style={{
                    padding: '10px',
                    backgroundColor: '#fff3cd',
                    borderRadius: '6px',
                    border: '1px solid #ffc107'
                  }}>
                    <Typography variant="body2" style={{ color: '#856404', marginBottom: '8px', fontWeight: 'bold' }}>
                      🔴 Recording In Progress...
                    </Typography>
                    <Box style={{
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '30px'
                    }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Box key={i} style={{
                          width: '6px',
                          height: '100%',
                          backgroundColor: '#ff6b6b',
                          borderRadius: '3px',
                          animation: `pulse 0.6s ease-in-out ${i * 0.12}s infinite`,
                        }} />
                      ))}
                    </Box>
                  </Box>
                )}
              </div>

              <div style={{ marginTop: '15px' }}>
                <Button 
                  onClick={recording ? stopRecording : startRecording} 
                  variant="contained" 
                  color={recording ? "error" : "success"}
                  disabled={loading || !cameraReady}
                  style={{ marginRight: '10px', padding: '10px 20px', fontWeight: 'bold' }}
                >
                  {recording ? '⏹️ Stop Recording' : '🔴 Start Recording'}
                </Button>
                {recording && (
                  <Box style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    marginLeft: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#fff3cd',
                    borderRadius: '8px',
                    border: '2px solid #ff6b6b',
                  }}>
                    <Typography variant="h6" style={{ 
                      fontWeight: 'bold', 
                      color: '#ff6b6b',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <span style={{ fontSize: '20px' }}>🔴</span>
                      Recording: {formatTime(recordingTime)}
                    </Typography>
                  </Box>
                )}
              </div>
              
              {videoUrl && (
                <div style={{ marginTop: '20px' }}>
                  <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>📺 Video Preview</Typography>
                  <video 
                    src={videoUrl} 
                    controls 
                    onLoadedMetadata={handleVideoMetadata}
                    style={{ width: '100%', maxWidth: '500px', marginTop: '10px', borderRadius: '8px', border: '2px solid #667eea' }} 
                  />
                  <Typography variant="body2" style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
                    ⏱️ Duration: <strong>{formatTime(videoDuration)}</strong>
                  </Typography>
                  
                  {audioUrl && (
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f7ff', borderRadius: '8px', border: '1px solid #667eea' }}>
                      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <Typography variant="h6" style={{ fontWeight: 'bold', margin: 0 }}>🔊 Audio Preview</Typography>
                        <Box style={{
                          display: 'flex',
                          gap: '10px',
                          padding: '5px 10px',
                          backgroundColor: 'white',
                          borderRadius: '6px',
                          fontSize: '12px'
                        }}>
                          <span>🎥 Video: <strong>{formatTime(videoDuration)}</strong></span>
                          <span style={{ color: '#999' }}>|</span>
                          <span>🎤 Audio: <strong>{formatTime(audioDuration)}</strong></span>
                          <span style={{ color: '#999' }}>|</span>
                          <span style={{ color: audioDuration === videoDuration ? '#48bb78' : '#ff9800', fontWeight: 'bold' }}>
                            {audioDuration === videoDuration ? '✅ Synced' : '⚠️ Out of sync'}
                          </span>
                        </Box>
                      </Box>
                      <audio 
                        src={audioUrl} 
                        controls 
                        onLoadedMetadata={handleAudioMetadata}
                        style={{ width: '100%', marginTop: '10px' }} 
                      />
                      <Typography variant="body2" style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
                        ⏱️ Duration: <strong>{formatTime(audioDuration)}</strong>
                      </Typography>
                    </div>
                  )}

                  <div style={{ marginTop: '15px' }}>
                    <Button 
                      onClick={saveVideo} 
                      variant="contained" 
                      color="primary"
                      disabled={loading}
                      style={{ marginRight: '10px', padding: '10px 20px' }}
                    >
                      {loading ? <CircularProgress size={24} /> : '💾 Save Video & Audio'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Student Information Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" style={{ marginBottom: '15px' }}>Student Information</Typography>
              <TextField 
                label="Full Name" 
                value={userName} 
                onChange={handleUserNameChange} 
                fullWidth 
                margin="normal"
                autoComplete="name"
              />
              <TextField 
                label="Certifications (comma separated)" 
                value={certifications} 
                onChange={handleCertificationsChange} 
                fullWidth 
                margin="normal"
              />
              <TextField 
                label="GitHub" 
                value={github} 
                onChange={handleGithubChange} 
                fullWidth 
                margin="normal"
                autoComplete="url"
              />
              <TextField 
                label="LinkedIn" 
                value={linkedin} 
                onChange={handleLinkedinChange} 
                fullWidth 
                margin="normal"
                autoComplete="url"
              />
              <TextField 
                label="LeetCode" 
                value={leetcode} 
                onChange={handleLeetcodeChange} 
                fullWidth 
                margin="normal"
                autoComplete="url"
              />
              <TextField 
                label="HackerRank" 
                value={hackerrank} 
                onChange={handleHackerrankChange} 
                fullWidth 
                margin="normal"
                autoComplete="url"
              />
              <Button 
                onClick={updateProfile} 
                variant="contained" 
                style={{ marginTop: '15px' }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Update Profile'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Resume Generator - Template Selection */}
        <Grid item xs={12}>
          <Card style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <CardContent>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Box>
                  <Typography variant="h5" style={{ fontWeight: 'bold', margin: 0 }}>
                    📄 Resume Templates
                  </Typography>
                  <Typography variant="body2" style={{ color: '#666', marginTop: '5px' }}>
                    Choose from 8 professional templates designed for different roles and industries
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={generateResume}
                  disabled={loading}
                  style={{ backgroundColor: '#48bb78', whiteSpace: 'nowrap' }}
                >
                  {loading ? <CircularProgress size={24} /> : '🚀 Generate Resume'}
                </Button>
              </Box>

              {/* Template Gallery */}
              <TemplateGallery
                userData={{
                  name: userName,
                  certifications: certifications ? certifications.split(',').map(s => s.trim()).filter(s => s) : [],
                  profiles: { github, linkedin, leetcode, hackerrank }
                }}
                onSelectTemplate={handleTemplateSelect}
                isEmbedded={true}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Resume Template Live Preview */}
        <Grid item xs={12}>
          <Card style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <CardContent>
              <Typography variant="h5" style={{ marginBottom: '20px', fontWeight: 'bold' }}>
                👁️ Live Preview - {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Template
              </Typography>
              <Box style={{
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                backgroundColor: '#fafafa',
                padding: '30px',
                maxHeight: '700px',
                overflow: 'auto'
              }}>
                {React.useMemo(() => {
                  const userData = {
                    name: userName || 'Your Name',
                    certifications: certifications ? certifications.split(',').map(s => s.trim()).filter(s => s) : [],
                    profiles: { github, linkedin, leetcode, hackerrank }
                  };
                  const Component = selectedTemplateComponent || ModernTemplate;
                  return React.createElement(Component, { data: userData });
                }, [userName, certifications, github, linkedin, leetcode, hackerrank, selectedTemplateComponent])}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Resume Analyzer Section */}
        <Grid item xs={12}>
          <Card style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <CardContent>
              <Typography variant="h5" style={{ marginBottom: '15px', fontWeight: 'bold' }}>🔍 Resume Analyzer</Typography>
              <Typography variant="body2" style={{ marginBottom: '15px', color: '#666' }}>
                Analyze your resume against a target job role
              </Typography>
              <Box style={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: '15px' }}>
                <TextField 
                  label="Target Job Role (e.g., Full Stack Developer)" 
                  value={jobRole} 
                  onChange={handleJobRoleChange} 
                  fullWidth 
                  margin="normal"
                  placeholder="Enter the position you're targeting"
                />
                <Box style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Button 
                    onClick={analyzeResume} 
                    variant="contained"
                    disabled={loading}
                    fullWidth
                    style={{ height: '56px', marginBottom: '8px' }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Analyze'}
                  </Button>
                </Box>
              </Box>

              {analysis && (
                <Box style={{ marginTop: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', overflow: 'hidden' }}>
                  {/* Overall Score Section */}
                  <Box style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '30px',
                    textAlign: 'center'
                  }}>
                    <Typography variant="body2" style={{ opacity: 0.9, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Resume Analysis
                    </Typography>
                    <Typography variant="h2" style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>
                      {analysis.score}%
                    </Typography>
                    <Typography variant="h6" style={{ margin: '0 0 15px 0', opacity: 0.95 }}>
                      Overall Resume Score
                    </Typography>
                    <Box style={{
                      backgroundColor: 'rgba(255,255,255, 0.2)',
                      height: '8px',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <Box style={{
                        backgroundColor: 'white',
                        height: '100%',
                        width: `${analysis.score}%`,
                        transition: 'width 0.3s ease'
                      }} />
                    </Box>
                  </Box>

                  <Box style={{ padding: '30px' }}>
                    {/* Job Role Match */}
                    {analysis.jobRoleMatch && (
                      <Box style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                          <Typography variant="h6" style={{ fontWeight: 'bold', margin: 0 }}>
                            🎯 Job Role Match: {jobRole}
                          </Typography>
                          <Box style={{
                            backgroundColor: analysis.jobRoleMatch.percentage >= 70 ? '#48bb78' : analysis.jobRoleMatch.percentage >= 40 ? '#f6ad55' : '#ed8936',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}>
                            {analysis.jobRoleMatch.percentage}%
                          </Box>
                        </Box>
                        {analysis.jobRoleMatch.matchedItems && analysis.jobRoleMatch.matchedItems.length > 0 && (
                          <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {analysis.jobRoleMatch.matchedItems.map((item, i) => (
                              <Box key={i} style={{
                                backgroundColor: '#e6f7ff',
                                color: '#0050b3',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px'
                              }}>
                                ✓ {item}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>
                    )}

                    {/* Section Scores */}
                    {analysis.sections && analysis.sections.length > 0 && (
                      <Box style={{ marginBottom: '30px' }}>
                        <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '15px' }}>
                          📋 Section Breakdown
                        </Typography>
                        <Box style={{ display: 'grid', gap: '15px' }}>
                          {analysis.sections.map((section, i) => (
                            <Box key={i} style={{
                              backgroundColor: 'white',
                              padding: '15px',
                              borderRadius: '8px',
                              border: '1px solid #e0e0e0'
                            }}>
                              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <Typography variant="body2" style={{ fontWeight: 'bold', color: '#333' }}>
                                  {section.name}
                                </Typography>
                                <Typography variant="body2" style={{ color: '#666' }}>
                                  {section.score}/{section.max}
                                </Typography>
                              </Box>
                              <Box style={{
                                backgroundColor: '#f0f0f0',
                                height: '6px',
                                borderRadius: '3px',
                                overflow: 'hidden'
                              }}>
                                <Box style={{
                                  backgroundColor: section.status === 'complete' ? '#48bb78' : section.status === 'good' ? '#63b3ed' : '#f6ad55',
                                  height: '100%',
                                  width: `${(section.score / section.max) * 100}%`,
                                  transition: 'width 0.3s ease'
                                }} />
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Strengths */}
                    {analysis.strengths && analysis.strengths.length > 0 && (
                      <Box style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#e6ffed', borderRadius: '8px', border: '1px solid #b7e4c7' }}>
                        <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '12px', color: '#22543d' }}>
                          💪 Your Strengths
                        </Typography>
                        <Box component="ul" style={{ margin: 0, paddingLeft: '20px' }}>
                          {analysis.strengths.map((strength, i) => (
                            <Typography component="li" key={i} variant="body2" style={{ color: '#22543d', marginBottom: '8px' }}>
                              {strength}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Improvements Needed */}
                    {analysis.improvements && analysis.improvements.length > 0 && (
                      <Box style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#fff5e6', borderRadius: '8px', border: '1px solid #fbd38d' }}>
                        <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '12px', color: '#7c2d12' }}>
                          🎯 Areas to Improve
                        </Typography>
                        <Box component="ul" style={{ margin: 0, paddingLeft: '20px' }}>
                          {analysis.improvements.map((improvement, i) => (
                            <Typography component="li" key={i} variant="body2" style={{ color: '#7c2d12', marginBottom: '8px' }}>
                              {improvement}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Suggestions */}
                    {analysis.suggestions && analysis.suggestions.length > 0 && (
                      <Box style={{ padding: '20px', backgroundColor: '#e6f0ff', borderRadius: '8px', border: '1px solid #91caff' }}>
                        <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '12px', color: '#003eb3' }}>
                          💡 Practical Suggestions
                        </Typography>
                        <Box component="ul" style={{ margin: 0, paddingLeft: '20px' }}>
                          {analysis.suggestions.map((suggestion, i) => (
                            <Typography component="li" key={i} variant="body2" style={{ color: '#003eb3', marginBottom: '8px' }}>
                              {suggestion}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VideoRecording;