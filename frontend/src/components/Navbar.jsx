import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
        <Typography
          variant="h6"
          onClick={() => navigate('/dashboard')}
          sx={{
            cursor: 'pointer',
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            color: '#a594f9',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: '1.1rem',
            '&:hover': { color: '#c4b8ff' },
            transition: 'color 0.2s',
          }}
        >
          <span role="img" aria-label="camera">🎬</span> ResumeAI
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
          {/* Nav links */}
          <Button
            onClick={() => navigate('/dashboard')}
            size="small"
            sx={{
              color: '#888899', fontSize: '0.8rem', px: 1.5,
              display: { xs: 'none', sm: 'inline-flex' },
              '&:hover': { color: '#a594f9' },
            }}
          >
            📹 Record
          </Button>
          <Button
            onClick={() => navigate('/profile')}
            size="small"
            sx={{
              color: '#888899', fontSize: '0.8rem', px: 1.5,
              display: { xs: 'none', sm: 'inline-flex' },
              '&:hover': { color: '#a594f9' },
            }}
          >
            📋 My Resumes
          </Button>

          <Chip
            label={user.name || user.email || 'User'}
            onClick={() => navigate('/profile')}
            size="small"
            sx={{
              bgcolor: 'rgba(124,110,245,0.12)',
              color: '#a594f9',
              fontWeight: 500,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'rgba(124,110,245,0.2)',
                transform: 'translateY(-1px)',
              },
              display: { xs: 'none', sm: 'flex' },
            }}
          />

          <Button
            onClick={handleLogout}
            size="small"
            variant="outlined"
            sx={{
              color: '#888899',
              borderColor: 'rgba(255,255,255,0.15)',
              fontSize: '0.8rem',
              px: 1.5,
              '&:hover': {
                color: '#f0f0f8',
                borderColor: '#f0f0f8',
              },
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
