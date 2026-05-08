import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Card, CardContent, Chip, Fade, Grow,
  CircularProgress, Avatar, Button, LinearProgress, Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { resumeAPI, userAPI } from '../services/api';

/* ─── Template color map ─────────────────────────────── */
const templateColors = {
  modern: { bg: '#1e3a5f', accent: '#60a5fa', icon: '💼' },
  creative: { bg: '#3b1f4e', accent: '#c084fc', icon: '🎨' },
  minimal: { bg: '#1a2e1a', accent: '#86efac', icon: '✨' },
  altacv: { bg: '#1a3a3a', accent: '#22d3a4', icon: '📊' },
  academic: { bg: '#3a2e1a', accent: '#fbbf24', icon: '🎓' },
  developer: { bg: '#1a1a2e', accent: '#a594f9', icon: '💻' },
};

/* ─── Stat card ──────────────────────────────────────── */
const StatCard = ({ icon, label, value, color, delay }) => (
  <Grow in timeout={600 + delay}>
    <Card sx={{
      flex: 1, minWidth: 140,
      background: `linear-gradient(135deg, ${color}12, ${color}06)`,
      border: `1px solid ${color}25`,
      transition: 'all 0.3s',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: `0 8px 24px ${color}20`,
        borderColor: `${color}40`,
      },
    }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography sx={{ fontSize: '1.3rem' }}>{icon}</Typography>
          <Typography variant="caption" sx={{
            color: '#888899', textTransform: 'uppercase',
            letterSpacing: '0.08em', fontWeight: 600, fontSize: '0.65rem',
          }}>
            {label}
          </Typography>
        </Box>
        <Typography sx={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: '1.8rem', color: color, lineHeight: 1,
        }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  </Grow>
);

/* ─── Activity timeline dot ──────────────────────────── */
const TimelineDot = ({ color, isFirst }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.5 }}>
    <Box sx={{
      width: 12, height: 12, borderRadius: '50%',
      bgcolor: color,
      boxShadow: isFirst ? `0 0 12px ${color}60` : 'none',
      border: isFirst ? `2px solid ${color}` : '2px solid rgba(255,255,255,0.1)',
      flexShrink: 0,
    }} />
    <Box sx={{
      width: 2, flex: 1, mt: 0.5,
      background: `linear-gradient(to bottom, ${color}40, transparent)`,
    }} />
  </Box>
);

/* ═══════════════════════════════════════════════════════ */
/*  PROFILE PAGE                                          */
/* ═══════════════════════════════════════════════════════ */
const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalResumes: 0, templateBreakdown: {}, lastGenerated: null });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [historyRes, profileRes] = await Promise.all([
        resumeAPI.getHistory(),
        userAPI.getProfile(),
      ]);
      setHistory(historyRes.data.history || []);
      setStats(historyRes.data.stats || {});
      setProfile(profileRes.data || historyRes.data.profile || {});
    } catch (err) {
      console.error('Failed to load profile data:', err);
      // Fallback to localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setProfile(user);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return diffMin + 'm ago';
    if (diffHr < 24) return diffHr + 'h ago';
    if (diffDay < 7) return diffDay + 'd ago';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatFullDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  // Compute most used template
  const topTemplate = Object.entries(stats.templateBreakdown || {})
    .sort((a, b) => b[1] - a[1])[0];

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0f' }}>
        <Navbar />
        <Box sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: 'calc(100vh - 64px)', gap: 2,
        }}>
          <CircularProgress size={40} sx={{ color: '#7c6ef5' }} />
          <Typography variant="body2" sx={{ color: '#888899' }}>Loading your profile...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0f' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* ═══ PROFILE HEADER ═══ */}
        <Fade in timeout={600}>
          <Card sx={{
            mb: 3, overflow: 'visible',
            background: 'linear-gradient(135deg, rgba(124,110,245,0.08) 0%, rgba(34,211,164,0.04) 100%)',
            border: '1px solid rgba(124,110,245,0.15)',
            position: 'relative',
          }}>
            {/* Decorative gradient bar */}
            <Box sx={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 4,
              background: 'linear-gradient(90deg, #7c6ef5, #22d3a4, #60a5fa, #a594f9)',
              borderRadius: '14px 14px 0 0',
            }} />

            <CardContent sx={{ p: { xs: 3, md: 4 }, pt: { xs: 4, md: 5 } }}>
              <Box sx={{
                display: 'flex', alignItems: 'flex-start',
                gap: { xs: 2, md: 3 }, flexWrap: 'wrap',
              }}>
                {/* Avatar */}
                <Avatar sx={{
                  width: 72, height: 72,
                  background: 'linear-gradient(135deg, #7c6ef5, #a594f9)',
                  fontSize: '1.5rem', fontWeight: 800,
                  fontFamily: "'Syne', sans-serif",
                  boxShadow: '0 4px 20px rgba(124,110,245,0.4)',
                  border: '3px solid rgba(124,110,245,0.3)',
                }}>
                  {getInitials(profile.name)}
                </Avatar>

                {/* Info */}
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography sx={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 800,
                    fontSize: '1.6rem', color: '#f0f0f8', mb: 0.25,
                  }}>
                    {profile.name || 'User'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#888899', mb: 1.5 }}>
                    {profile.email || ''}
                  </Typography>

                  {/* Chips */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {(profile.certifications || []).length > 0 && (
                      <Chip
                        label={`${profile.certifications.length} Certification${profile.certifications.length !== 1 ? 's' : ''}`}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(34,211,164,0.1)', color: '#22d3a4',
                          fontWeight: 600, fontSize: '0.7rem',
                          border: '1px solid rgba(34,211,164,0.2)',
                        }}
                      />
                    )}
                    {profile.profiles?.github && (
                      <Chip label="GitHub ✓" size="small" sx={{
                        bgcolor: 'rgba(255,255,255,0.05)', color: '#888899',
                        fontSize: '0.7rem', border: '1px solid rgba(255,255,255,0.08)',
                      }} />
                    )}
                    {profile.profiles?.linkedin && (
                      <Chip label="LinkedIn ✓" size="small" sx={{
                        bgcolor: 'rgba(255,255,255,0.05)', color: '#888899',
                        fontSize: '0.7rem', border: '1px solid rgba(255,255,255,0.08)',
                      }} />
                    )}
                    <Chip
                      label={stats.totalResumes > 0 ? 'Active' : 'New Member'}
                      size="small"
                      sx={{
                        bgcolor: stats.totalResumes > 0 ? 'rgba(34,211,164,0.1)' : 'rgba(96,165,250,0.1)',
                        color: stats.totalResumes > 0 ? '#22d3a4' : '#60a5fa',
                        fontWeight: 600, fontSize: '0.7rem',
                        border: `1px solid ${stats.totalResumes > 0 ? 'rgba(34,211,164,0.2)' : 'rgba(96,165,250,0.2)'}`,
                      }}
                    />
                  </Box>
                </Box>

                {/* Quick Actions */}
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      py: 1.1, px: 2.5,
                      background: 'linear-gradient(135deg, #7c6ef5, #a594f9)',
                      fontWeight: 600, fontSize: '0.85rem',
                      boxShadow: '0 4px 16px rgba(124,110,245,0.3)',
                      '&:hover': {
                        boxShadow: '0 6px 24px rgba(124,110,245,0.4)',
                      },
                    }}
                  >
                    📹 New Resume
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      py: 1.1, px: 2.5,
                      color: '#888899', borderColor: 'rgba(255,255,255,0.12)',
                      fontWeight: 600, fontSize: '0.85rem',
                      '&:hover': {
                        borderColor: '#7c6ef5', color: '#a594f9',
                      },
                    }}
                  >
                    ✏️ Edit Profile
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {/* ═══ STATS ROW ═══ */}
        <Box sx={{
          display: 'flex', gap: 2, mb: 3,
          flexWrap: 'wrap',
        }}>
          <StatCard
            icon="📄"
            label="Resumes Generated"
            value={stats.totalResumes}
            color="#7c6ef5"
            delay={0}
          />
          <StatCard
            icon="🎨"
            label="Templates Used"
            value={Object.keys(stats.templateBreakdown || {}).length}
            color="#22d3a4"
            delay={100}
          />
          <StatCard
            icon="⭐"
            label="Favorite Template"
            value={topTemplate ? (templateColors[topTemplate[0]]?.icon || '—') : '—'}
            color="#fbbf24"
            delay={200}
          />
          <StatCard
            icon="🕐"
            label="Last Activity"
            value={stats.lastGenerated ? formatDate(stats.lastGenerated) : 'Never'}
            color="#60a5fa"
            delay={300}
          />
        </Box>

        {/* ═══ MAIN CONTENT — two columns ═══ */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 340px' },
          gap: 3,
        }}>

          {/* ─── LEFT: Resume History Timeline ─── */}
          <Box>
            <Typography sx={{
              fontFamily: "'Syne', sans-serif", fontWeight: 700,
              fontSize: '1.2rem', mb: 2, color: '#f0f0f8',
              display: 'flex', alignItems: 'center', gap: 1,
            }}>
              📋 Resume History
              {history.length > 0 && (
                <Chip
                  label={history.length}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(124,110,245,0.12)', color: '#a594f9',
                    fontWeight: 700, fontSize: '0.7rem', height: 22, minWidth: 28,
                  }}
                />
              )}
            </Typography>

            {history.length === 0 ? (
              /* Empty state */
              <Fade in timeout={800}>
                <Card sx={{
                  background: 'linear-gradient(135deg, rgba(124,110,245,0.04), rgba(34,211,164,0.02))',
                  border: '1px dashed rgba(124,110,245,0.2)',
                  textAlign: 'center',
                  py: 6,
                }}>
                  <CardContent>
                    <Typography sx={{ fontSize: '3rem', mb: 2 }}>📝</Typography>
                    <Typography sx={{
                      fontFamily: "'Syne', sans-serif", fontWeight: 700,
                      fontSize: '1.2rem', color: '#f0f0f8', mb: 1,
                    }}>
                      No resumes yet
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888899', mb: 3, maxWidth: 340, mx: 'auto' }}>
                      Record a video introduction and let our AI create your first professional resume.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/dashboard')}
                      sx={{
                        py: 1.2, px: 4,
                        background: 'linear-gradient(135deg, #7c6ef5, #a594f9)',
                        fontWeight: 600,
                        boxShadow: '0 4px 20px rgba(124,110,245,0.3)',
                        '&:hover': {
                          boxShadow: '0 8px 28px rgba(124,110,245,0.45)',
                        },
                      }}
                    >
                      🚀 Create Your First Resume
                    </Button>
                  </CardContent>
                </Card>
              </Fade>
            ) : (
              /* History Timeline */
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {history.map((item, idx) => {
                  const tmplColor = templateColors[item.templateId] || templateColors.modern;
                  return (
                    <Grow in timeout={400 + idx * 80} key={item.id}>
                      <Box sx={{ display: 'flex', gap: 2, mb: 0.5 }}>
                        {/* Timeline line & dot */}
                        <TimelineDot color={tmplColor.accent} isFirst={idx === 0} />

                        {/* Card */}
                        <Card sx={{
                          flex: 1, mb: 1.5,
                          transition: 'all 0.3s ease',
                          border: idx === 0
                            ? `1px solid ${tmplColor.accent}30`
                            : '1px solid rgba(255,255,255,0.06)',
                          '&:hover': {
                            transform: 'translateX(4px)',
                            borderColor: `${tmplColor.accent}50`,
                            boxShadow: `0 4px 20px ${tmplColor.accent}15`,
                          },
                        }}>
                          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                            <Box sx={{
                              display: 'flex', alignItems: 'flex-start',
                              justifyContent: 'space-between', gap: 1.5, flexWrap: 'wrap',
                            }}>
                              {/* Left side */}
                              <Box sx={{ flex: 1, minWidth: 180 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                                  <Box sx={{
                                    width: 32, height: 32, borderRadius: 1.5,
                                    bgcolor: tmplColor.bg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1rem',
                                  }}>
                                    {tmplColor.icon}
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" sx={{
                                      fontWeight: 700, color: '#f0f0f8', lineHeight: 1.2,
                                    }}>
                                      {item.templateName}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.65rem' }}>
                                      {item.templateId} template
                                    </Typography>
                                  </Box>
                                  {idx === 0 && (
                                    <Chip label="Latest" size="small" sx={{
                                      bgcolor: `${tmplColor.accent}18`,
                                      color: tmplColor.accent,
                                      fontWeight: 700, fontSize: '0.6rem', height: 20,
                                      border: `1px solid ${tmplColor.accent}30`,
                                      ml: 0.5,
                                    }} />
                                  )}
                                </Box>

                                {/* Resume info */}
                                {item.data && (
                                  <Box sx={{ mt: 1 }}>
                                    {item.data.name && (
                                      <Typography variant="caption" sx={{ color: '#888899', display: 'block', mb: 0.5 }}>
                                        For: <Box component="span" sx={{ color: '#f0f0f8', fontWeight: 500 }}>{item.data.name}</Box>
                                      </Typography>
                                    )}
                                    {item.data.skills && item.data.skills.length > 0 && (
                                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                                        {item.data.skills.slice(0, 4).map((skill, si) => (
                                          <Chip key={si} label={skill} size="small" sx={{
                                            bgcolor: 'rgba(255,255,255,0.04)',
                                            color: '#777',
                                            fontSize: '0.6rem', height: 18,
                                            border: '1px solid rgba(255,255,255,0.06)',
                                          }} />
                                        ))}
                                        {item.data.skills.length > 4 && (
                                          <Chip label={`+${item.data.skills.length - 4}`} size="small" sx={{
                                            bgcolor: 'rgba(124,110,245,0.08)',
                                            color: '#a594f9',
                                            fontSize: '0.6rem', height: 18,
                                          }} />
                                        )}
                                      </Box>
                                    )}
                                  </Box>
                                )}
                              </Box>

                              {/* Right side — time */}
                              <Tooltip title={formatFullDate(item.createdAt)} arrow placement="top">
                                <Typography variant="caption" sx={{
                                  color: '#555', fontSize: '0.7rem',
                                  whiteSpace: 'nowrap', cursor: 'default',
                                }}>
                                  {formatDate(item.createdAt)}
                                </Typography>
                              </Tooltip>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    </Grow>
                  );
                })}
              </Box>
            )}
          </Box>

          {/* ─── RIGHT: Sidebar ─── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

            {/* Template Usage Breakdown */}
            {Object.keys(stats.templateBreakdown || {}).length > 0 && (
              <Card sx={{
                border: '1px solid rgba(124,110,245,0.12)',
              }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 700, mb: 2,
                    display: 'flex', alignItems: 'center', gap: 0.75,
                  }}>
                    🎨 Template Usage
                  </Typography>
                  {Object.entries(stats.templateBreakdown).sort((a, b) => b[1] - a[1]).map(([tmpl, count]) => {
                    const color = templateColors[tmpl] || templateColors.modern;
                    const pct = Math.round((count / stats.totalResumes) * 100);
                    return (
                      <Box key={tmpl} sx={{ mb: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Typography sx={{ fontSize: '0.9rem' }}>{color.icon}</Typography>
                            <Typography variant="caption" sx={{ color: '#ccc', fontWeight: 500, textTransform: 'capitalize' }}>
                              {tmpl}
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ color: color.accent, fontWeight: 700 }}>
                            {count}× ({pct}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          sx={{
                            height: 5, borderRadius: 3,
                            bgcolor: 'rgba(255,255,255,0.04)',
                            '& .MuiLinearProgress-bar': {
                              background: `linear-gradient(90deg, ${color.accent}, ${color.accent}aa)`,
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Profile Summary */}
            <Card sx={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle2" sx={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 700, mb: 2,
                  display: 'flex', alignItems: 'center', gap: 0.75,
                }}>
                  👤 Profile Summary
                </Typography>

                {[
                  { label: 'Name', value: profile.name },
                  { label: 'Email', value: profile.email },
                  { label: 'Certifications', value: (profile.certifications || []).join(', ') || 'None added' },
                  { label: 'GitHub', value: profile.profiles?.github || '—' },
                  { label: 'LinkedIn', value: profile.profiles?.linkedin || '—' },
                ].map(({ label, value }) => (
                  <Box key={label} sx={{
                    mb: 1.5, pb: 1.5,
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    '&:last-child': { mb: 0, pb: 0, borderBottom: 'none' },
                  }}>
                    <Typography variant="caption" sx={{
                      color: '#555', textTransform: 'uppercase',
                      letterSpacing: '0.08em', fontWeight: 600, fontSize: '0.6rem',
                    }}>
                      {label}
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: value && value !== '—' && value !== 'None added' ? '#ddd' : '#555',
                      fontSize: '0.82rem', wordBreak: 'break-all',
                    }}>
                      {value || '—'}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(34,211,164,0.06), rgba(34,211,164,0.02))',
              border: '1px solid rgba(34,211,164,0.12)',
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle2" sx={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 700, mb: 2,
                  display: 'flex', alignItems: 'center', gap: 0.75,
                }}>
                  ⚡ Quick Actions
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    mb: 1, py: 1.1,
                    background: 'linear-gradient(135deg, #7c6ef5, #a594f9)',
                    fontWeight: 600, fontSize: '0.85rem',
                    boxShadow: '0 4px 16px rgba(124,110,245,0.25)',
                    '&:hover': {
                      boxShadow: '0 6px 24px rgba(124,110,245,0.4)',
                    },
                  }}
                >
                  📹 Record New Video
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/templates')}
                  sx={{
                    py: 1.1,
                    color: '#22d3a4', borderColor: 'rgba(34,211,164,0.25)',
                    fontWeight: 600, fontSize: '0.85rem',
                    '&:hover': {
                      borderColor: '#22d3a4',
                      bgcolor: 'rgba(34,211,164,0.06)',
                    },
                  }}
                >
                  🎨 Browse Templates
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage;
