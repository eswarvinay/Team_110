import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, TextField, Button, Alert, CircularProgress,
  InputAdornment, IconButton, Fade, Grow, Slide,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

/* ─── Floating orb component ──────────────────────────── */
const FloatingOrb = ({ size, color, top, left, delay, duration }) => (
  <Box
    sx={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      top,
      left,
      filter: 'blur(60px)',
      opacity: 0.5,
      animation: `floatOrb ${duration || 8}s ease-in-out ${delay || 0}s infinite alternate`,
      '@keyframes floatOrb': {
        '0%': { transform: 'translate(0, 0) scale(1)' },
        '33%': { transform: 'translate(30px, -20px) scale(1.05)' },
        '66%': { transform: 'translate(-20px, 15px) scale(0.95)' },
        '100%': { transform: 'translate(10px, -30px) scale(1.02)' },
      },
    }}
  />
);

/* ─── Animated particle ──────────────────────────────── */
const Particle = ({ delay, left, size }) => (
  <Box
    sx={{
      position: 'absolute',
      width: size || 3,
      height: size || 3,
      borderRadius: '50%',
      background: 'rgba(165, 148, 249, 0.6)',
      left,
      bottom: '-5%',
      animation: `particleRise ${6 + Math.random() * 4}s linear ${delay}s infinite`,
      '@keyframes particleRise': {
        '0%': { transform: 'translateY(0) scale(0)', opacity: 0 },
        '10%': { opacity: 1, transform: 'scale(1)' },
        '90%': { opacity: 0.3 },
        '100%': { transform: 'translateY(-100vh) scale(0)', opacity: 0 },
      },
    }}
  />
);

/* ─── Feature card on left panel ─────────────────────── */
const FeatureCard = ({ icon, title, desc, delay }) => (
  <Grow in timeout={800 + delay}>
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        alignItems: 'flex-start',
        p: 2,
        borderRadius: 2,
        bgcolor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        cursor: 'default',
        '&:hover': {
          bgcolor: 'rgba(124,110,245,0.08)',
          borderColor: 'rgba(124,110,245,0.2)',
          transform: 'translateX(4px)',
        },
      }}
    >
      <Box sx={{
        width: 40, height: 40, borderRadius: 1.5,
        background: 'linear-gradient(135deg, rgba(124,110,245,0.2), rgba(34,211,164,0.15))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.2rem', flexShrink: 0,
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#f0f0f8', mb: 0.25 }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: '#888899', lineHeight: 1.4 }}>
          {desc}
        </Typography>
      </Box>
    </Box>
  </Grow>
);

/* ═══════════════════════════════════════════════════════ */
/*  LOGIN PAGE                                            */
/* ═══════════════════════════════════════════════════════ */
const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
    setMounted(true);
  }, [navigate]);

  const switchMode = useCallback((newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await authAPI.login({ email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setSuccess('Welcome back! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 900);
      } else {
        const res = await authAPI.signup({ email, password, name });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setSuccess('Account created! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 900);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isSignup = mode === 'signup';

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      background: '#0a0a0f',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* ═══ LEFT PANEL — Hero ═══ */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'center',
        width: '50%',
        position: 'relative',
        overflow: 'hidden',
        p: { md: 5, lg: 7 },
      }}>
        {/* Background orbs */}
        <FloatingOrb size={340} color="radial-gradient(circle, rgba(124,110,245,0.4), transparent 70%)" top="-5%" left="10%" delay={0} duration={10} />
        <FloatingOrb size={260} color="radial-gradient(circle, rgba(34,211,164,0.3), transparent 70%)" top="60%" left="55%" delay={2} duration={12} />
        <FloatingOrb size={180} color="radial-gradient(circle, rgba(96,165,250,0.25), transparent 70%)" top="30%" left="-5%" delay={4} duration={9} />

        {/* Particles */}
        {[...Array(12)].map((_, i) => (
          <Particle key={i} delay={i * 0.8} left={`${8 + (i * 7.5)}%`} size={2 + (i % 3)} />
        ))}

        {/* Grid lines overlay */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(124,110,245,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,110,245,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <Fade in={mounted} timeout={800}>
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5 }}>
              <Box sx={{
                width: 44, height: 44, borderRadius: 2,
                background: 'linear-gradient(135deg, #7c6ef5, #a594f9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem',
                boxShadow: '0 4px 20px rgba(124,110,245,0.4)',
              }}>
                🎬
              </Box>
              <Typography sx={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.6rem', fontWeight: 800,
                background: 'linear-gradient(135deg, #a594f9, #7c6ef5)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                ResumeAI
              </Typography>
            </Box>

            {/* Headline */}
            <Typography sx={{
              fontFamily: "'Syne', sans-serif",
              fontSize: { md: '2.4rem', lg: '3rem' },
              fontWeight: 800,
              lineHeight: 1.15,
              mb: 2,
              color: '#f0f0f8',
            }}>
              Build your story.
              <br />
              <Box component="span" sx={{
                background: 'linear-gradient(135deg, #7c6ef5, #22d3a4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Land your dream role.
              </Box>
            </Typography>

            <Typography sx={{
              color: '#888899', fontSize: '1.05rem',
              maxWidth: 440, lineHeight: 1.6, mb: 5,
            }}>
              Record a video introduction, let our AI extract your details,
              and generate a professional resume — all in minutes.
            </Typography>

            {/* Feature cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 420 }}>
              <FeatureCard
                icon="🎥"
                title="Video-First Approach"
                desc="Record yourself naturally — no typing needed"
                delay={0}
              />
              <FeatureCard
                icon="🧠"
                title="AI-Powered Extraction"
                desc="Our AI analyzes your intro and builds your resume"
                delay={200}
              />
              <FeatureCard
                icon="✨"
                title="Professional Templates"
                desc="Choose from 6 stunning resume designs"
                delay={400}
              />
            </Box>

            {/* Trust badge */}
            <Box sx={{
              mt: 5, display: 'flex', alignItems: 'center', gap: 1.5,
            }}>
              <Box sx={{ display: 'flex', gap: -0.5 }}>
                {['#f87171', '#fbbf24', '#22d3a4', '#60a5fa', '#a594f9'].map((c, i) => (
                  <Box key={i} sx={{
                    width: 28, height: 28, borderRadius: '50%',
                    bgcolor: c, border: '2px solid #0a0a0f',
                    marginLeft: i > 0 ? '-8px' : 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700, color: '#fff',
                  }}>
                    {['S', 'A', 'R', 'M', 'V'][i]}
                  </Box>
                ))}
              </Box>
              <Typography variant="caption" sx={{ color: '#888899' }}>
                Trusted by <Box component="span" sx={{ color: '#a594f9', fontWeight: 600 }}>500+</Box> students worldwide
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Box>

      {/* ═══ RIGHT PANEL — Auth Form ═══ */}
      <Box sx={{
        width: { xs: '100%', md: '50%' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 3, sm: 4 },
        position: 'relative',
      }}>
        {/* Subtle gradient backdrop */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 50% at 70% 40%, rgba(124,110,245,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <Slide direction="up" in={mounted} timeout={600}>
          <Box sx={{
            width: '100%', maxWidth: 440,
            position: 'relative', zIndex: 2,
          }}>
            {/* Mobile logo */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mb: 3 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: 1.5,
                background: 'linear-gradient(135deg, #7c6ef5, #a594f9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem',
              }}>🎬</Box>
              <Typography sx={{
                fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 800,
                color: '#a594f9',
              }}>ResumeAI</Typography>
            </Box>

            {/* Card */}
            <Box sx={{
              bgcolor: 'rgba(22,22,31,0.85)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3.5,
              p: { xs: 3, sm: 4 },
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(124,110,245,0.05)',
            }}>
              {/* Header */}
              <Typography sx={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.7rem', fontWeight: 800,
                color: '#f0f0f8', mb: 0.5,
              }}>
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#888899', mb: 3 }}>
                {isSignup
                  ? 'Join thousands of students building stunning resumes'
                  : 'Sign in to continue building your video resume'}
              </Typography>

              {/* Mode Toggle */}
              <Box sx={{
                display: 'flex',
                bgcolor: '#1a1a24',
                borderRadius: 2,
                p: 0.5,
                mb: 3,
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                {['login', 'signup'].map((m) => (
                  <Button
                    key={m}
                    onClick={() => switchMode(m)}
                    fullWidth
                    sx={{
                      py: 1, borderRadius: 1.5,
                      fontSize: '0.875rem', fontWeight: 600,
                      textTransform: 'none',
                      color: mode === m ? '#fff' : '#666',
                      bgcolor: mode === m ? '#7c6ef5' : 'transparent',
                      boxShadow: mode === m ? '0 4px 15px rgba(124,110,245,0.35)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: mode === m ? '#6c5ee5' : 'rgba(255,255,255,0.04)',
                        transform: mode === m ? 'none' : 'none',
                      },
                    }}
                  >
                    {m === 'login' ? '✦  Sign In' : '✦  Sign Up'}
                  </Button>
                ))}
              </Box>

              {/* Alerts */}
              {error && (
                <Fade in>
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2.5, fontSize: '0.85rem',
                      bgcolor: 'rgba(248,113,113,0.08)',
                      border: '1px solid rgba(248,113,113,0.2)',
                      '& .MuiAlert-icon': { color: '#f87171' },
                    }}
                    onClose={() => setError('')}
                  >
                    {error}
                  </Alert>
                </Fade>
              )}
              {success && (
                <Fade in>
                  <Alert
                    severity="success"
                    sx={{
                      mb: 2.5, fontSize: '0.85rem',
                      bgcolor: 'rgba(34,211,164,0.08)',
                      border: '1px solid rgba(34,211,164,0.2)',
                      '& .MuiAlert-icon': { color: '#22d3a4' },
                    }}
                  >
                    {success}
                  </Alert>
                </Fade>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Name field (signup only) */}
                <Box sx={{
                  maxHeight: isSignup ? 100 : 0,
                  opacity: isSignup ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  mb: isSignup ? 2 : 0,
                }}>
                  <Typography variant="caption" sx={{
                    color: '#888899', textTransform: 'uppercase',
                    letterSpacing: '0.08em', fontWeight: 600,
                    mb: 0.75, display: 'block', fontSize: '0.7rem',
                  }}>
                    Full Name
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="e.g. Sanjana Medapati"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    autoComplete="name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography sx={{ fontSize: '1rem', opacity: 0.5 }}>👤</Typography>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(26,26,36,0.8)',
                        '&:hover fieldset': { borderColor: 'rgba(124,110,245,0.4)' },
                        '&.Mui-focused fieldset': {
                          borderColor: '#7c6ef5',
                          boxShadow: '0 0 0 3px rgba(124,110,245,0.1)',
                        },
                      },
                    }}
                  />
                </Box>

                {/* Email */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{
                    color: '#888899', textTransform: 'uppercase',
                    letterSpacing: '0.08em', fontWeight: 600,
                    mb: 0.75, display: 'block', fontSize: '0.7rem',
                  }}>
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography sx={{ fontSize: '1rem', opacity: 0.5 }}>✉️</Typography>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(26,26,36,0.8)',
                        '&:hover fieldset': { borderColor: 'rgba(124,110,245,0.4)' },
                        '&.Mui-focused fieldset': {
                          borderColor: '#7c6ef5',
                          boxShadow: '0 0 0 3px rgba(124,110,245,0.1)',
                        },
                      },
                    }}
                  />
                </Box>

                {/* Password */}
                <Box sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{
                    color: '#888899', textTransform: 'uppercase',
                    letterSpacing: '0.08em', fontWeight: 600,
                    mb: 0.75, display: 'block', fontSize: '0.7rem',
                  }}>
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isSignup ? 'Min. 6 characters' : '••••••••'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography sx={{ fontSize: '1rem', opacity: 0.5 }}>🔒</Typography>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                            sx={{ color: '#666', '&:hover': { color: '#a594f9' } }}
                          >
                            <Typography sx={{ fontSize: '0.85rem' }}>
                              {showPassword ? '🙈' : '👁️'}
                            </Typography>
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(26,26,36,0.8)',
                        '&:hover fieldset': { borderColor: 'rgba(124,110,245,0.4)' },
                        '&.Mui-focused fieldset': {
                          borderColor: '#7c6ef5',
                          boxShadow: '0 0 0 3px rgba(124,110,245,0.1)',
                        },
                      },
                    }}
                  />
                </Box>

                {/* Password strength indicator (signup only) */}
                {isSignup && password.length > 0 && (
                  <Fade in>
                    <Box sx={{ mt: 1, mb: 1 }}>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[1, 2, 3, 4].map((level) => {
                          const strength = password.length >= 12 ? 4
                            : password.length >= 8 ? 3
                            : password.length >= 6 ? 2 : 1;
                          const getColor = () => {
                            if (level > strength) return 'rgba(255,255,255,0.08)';
                            if (strength >= 4) return '#22d3a4';
                            if (strength >= 3) return '#60a5fa';
                            if (strength >= 2) return '#fbbf24';
                            return '#f87171';
                          };
                          return (
                            <Box key={level} sx={{
                              flex: 1, height: 3, borderRadius: 2,
                              bgcolor: getColor(),
                              transition: 'all 0.3s',
                            }} />
                          );
                        })}
                      </Box>
                      {(() => {
                        const strengthColor = password.length >= 12 ? '#22d3a4'
                          : password.length >= 8 ? '#60a5fa'
                          : password.length >= 6 ? '#fbbf24' : '#f87171';
                        const strengthLabel = password.length >= 12 ? 'Strong password ✓'
                          : password.length >= 8 ? 'Good password'
                          : password.length >= 6 ? 'Minimum met'
                          : (6 - password.length) + ' more character' + (6 - password.length !== 1 ? 's' : '') + ' needed';
                        return (
                          <Typography variant="caption" sx={{
                            color: strengthColor,
                            fontSize: '0.65rem', mt: 0.5, display: 'block',
                          }}>
                            {strengthLabel}
                          </Typography>
                        );
                      })()}
                    </Box>
                  </Fade>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 2.5, py: 1.4,
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: 2,
                    background: loading
                      ? 'rgba(124,110,245,0.5)'
                      : 'linear-gradient(135deg, #7c6ef5 0%, #a594f9 50%, #7c6ef5 100%)',
                    backgroundSize: '200% 200%',
                    animation: loading ? 'none' : 'gradientShift 3s ease infinite',
                    '@keyframes gradientShift': {
                      '0%': { backgroundPosition: '0% 50%' },
                      '50%': { backgroundPosition: '100% 50%' },
                      '100%': { backgroundPosition: '0% 50%' },
                    },
                    boxShadow: '0 6px 25px rgba(124,110,245,0.35)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 35px rgba(124,110,245,0.5)',
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                    },
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CircularProgress size={20} sx={{ color: '#fff' }} />
                      <span>{isSignup ? 'Creating Account...' : 'Signing In...'}</span>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
                      <span style={{ fontSize: '1.1rem' }}>→</span>
                    </Box>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <Box sx={{
                display: 'flex', alignItems: 'center', gap: 2,
                my: 2.5,
              }}>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.06)' }} />
                <Typography variant="caption" sx={{ color: '#555', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {isSignup ? 'Already have an account?' : 'New here?'}
                </Typography>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.06)' }} />
              </Box>

              {/* Switch mode link */}
              <Button
                fullWidth
                onClick={() => switchMode(isSignup ? 'login' : 'signup')}
                sx={{
                  py: 1.2,
                  color: '#a594f9',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  border: '1px solid rgba(124,110,245,0.15)',
                  bgcolor: 'rgba(124,110,245,0.04)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(124,110,245,0.1)',
                    borderColor: 'rgba(124,110,245,0.3)',
                    transform: 'none',
                  },
                }}
              >
                {isSignup ? '← Sign In Instead' : 'Create Free Account →'}
              </Button>
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#444', fontSize: '0.7rem', lineHeight: 1.6 }}>
                By continuing, you agree to our Terms of Service
                <br />
                and Privacy Policy.
              </Typography>
            </Box>
          </Box>
        </Slide>
      </Box>
    </Box>
  );
};

export default Login;
