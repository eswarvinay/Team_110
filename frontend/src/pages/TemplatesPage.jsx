import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Card, Button, Chip, Fade, Grow,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    desc: 'Clean single-column layout with blue header. Perfect for corporate and business roles.',
    preview: '/templates/modern.png',
    tags: ['Corporate', 'Clean'],
    popular: true,
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    desc: 'Two-column design with dark sidebar, skill bars, and colorful accents for creative roles.',
    preview: '/templates/creative.png',
    tags: ['Two-Column', 'Designer'],
    popular: true,
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    desc: 'Ultra-minimal elegant resume with serif headings. Sophistication through simplicity.',
    preview: '/templates/minimal.png',
    tags: ['Minimal', 'Elegant'],
    popular: false,
  },
  {
    id: 'altacv',
    name: 'AltaCV Infographic',
    desc: 'Infographic-style with teal accents, skill progress bars, and timeline markers.',
    preview: '/templates/altacv.png',
    tags: ['Infographic', 'Modern'],
    popular: true,
  },
  {
    id: 'academic',
    name: 'Academic CV',
    desc: 'Traditional scholarly layout with serif typography. Ideal for research and academia.',
    preview: '/templates/academic.png',
    tags: ['Academic', 'Formal'],
    popular: false,
  },
  {
    id: 'developer',
    name: 'Tech Developer',
    desc: 'Dark-themed dev resume with monospace fonts, code-style sections, and tech tag chips.',
    preview: '/templates/developer.png',
    tags: ['Developer', 'Dark Mode'],
    popular: true,
  },
];

const TemplatesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const extractedData = location.state?.extractedData || null;
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
  }, [navigate]);

  const handleSelectTemplate = (templateId) => {
    setSelectedId(templateId);
  };

  const handleGenerate = () => {
    if (!selectedId) return;
    navigate('/resume', {
      state: {
        templateId: selectedId,
        extractedData,
      },
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0f' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back + Header */}
        <Button
          onClick={() => navigate('/dashboard')}
          sx={{ color: '#888899', mb: 1, fontSize: '0.875rem', '&:hover': { color: '#f0f0f8' } }}
        >
          ← Back to Recording
        </Button>

        <Fade in timeout={600}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  background: 'linear-gradient(135deg, #f0f0f8, #a594f9)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}
              >
                Choose Your Template
              </Typography>
              <Chip
                label="Step 2 of 3"
                size="small"
                sx={{
                  bgcolor: 'rgba(124,110,245,0.12)', color: '#a594f9',
                  fontWeight: 600, fontSize: '0.7rem',
                  border: '1px solid rgba(124,110,245,0.2)',
                }}
              />
            </Box>
            <Typography variant="body1" sx={{ color: '#888899' }}>
              Select a resume style that fits your profession. Your AI-extracted data will be applied automatically.
            </Typography>
          </Box>
        </Fade>

        {/* Template Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          {templates.map((tmpl, index) => (
            <Grow in timeout={400 + index * 100} key={tmpl.id}>
              <Card
                onClick={() => handleSelectTemplate(tmpl.id)}
                onMouseEnter={() => setHoveredId(tmpl.id)}
                onMouseLeave={() => setHoveredId(null)}
                sx={{
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                  border: selectedId === tmpl.id
                    ? '2px solid #7c6ef5'
                    : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: selectedId === tmpl.id
                    ? '0 0 30px rgba(124,110,245,0.25)'
                    : 'none',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                    borderColor: selectedId === tmpl.id ? '#7c6ef5' : 'rgba(124,110,245,0.3)',
                  },
                  position: 'relative',
                }}
              >
                {/* Selected Badge */}
                {selectedId === tmpl.id && (
                  <Box sx={{
                    position: 'absolute', top: 12, right: 12, zIndex: 2,
                    bgcolor: '#7c6ef5', borderRadius: '50%',
                    width: 28, height: 28, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 12px rgba(124,110,245,0.5)',
                  }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>✓</Typography>
                  </Box>
                )}

                {/* Popular Badge */}
                {tmpl.popular && (
                  <Box sx={{
                    position: 'absolute', top: 12, left: 12, zIndex: 2,
                  }}>
                    <Chip
                      label="Popular"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(251,191,36,0.15)',
                        color: '#fbbf24',
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        height: 22,
                        border: '1px solid rgba(251,191,36,0.3)',
                      }}
                    />
                  </Box>
                )}

                {/* Preview Image */}
                <Box
                  sx={{
                    height: 260,
                    overflow: 'hidden',
                    bgcolor: '#1a1a24',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Box
                    component="img"
                    src={tmpl.preview}
                    alt={tmpl.name}
                    sx={{
                      width: '85%',
                      height: '90%',
                      objectFit: 'cover',
                      borderRadius: 1,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                      transform: hoveredId === tmpl.id ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />
                  {/* Overlay on hover */}
                  <Box sx={{
                    position: 'absolute', inset: 0,
                    background: hoveredId === tmpl.id
                      ? 'linear-gradient(180deg, transparent 40%, rgba(124,110,245,0.15) 100%)'
                      : 'none',
                    transition: 'all 0.3s',
                  }} />
                </Box>

                {/* Info */}
                <Box sx={{ p: '16px 20px' }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: "'Syne', sans-serif", fontWeight: 700,
                      fontSize: '1rem', mb: 0.5, color: '#f0f0f8',
                    }}
                  >
                    {tmpl.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#888899', fontSize: '0.8rem', mb: 1.5, lineHeight: 1.5, minHeight: 36 }}
                  >
                    {tmpl.desc}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.75 }}>
                    {tmpl.tags.map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.04)', color: '#666',
                          fontSize: '0.7rem', height: 22,
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Card>
            </Grow>
          ))}
        </Box>

        {/* Generate Button */}
        <Fade in={!!selectedId}>
          <Box sx={{
            position: 'sticky', bottom: 24,
            display: 'flex', justifyContent: 'center',
          }}>
            <Button
              variant="contained"
              onClick={handleGenerate}
              disabled={!selectedId}
              sx={{
                py: 1.5, px: 6, fontSize: '1.05rem',
                background: 'linear-gradient(135deg, #7c6ef5, #a594f9)',
                boxShadow: '0 8px 32px rgba(124,110,245,0.4)',
                borderRadius: 2,
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(135deg, #6c5ee5, #9584e9)',
                  boxShadow: '0 12px 40px rgba(124,110,245,0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s',
              }}
            >
              🚀 Generate My Resume
            </Button>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default TemplatesPage;
