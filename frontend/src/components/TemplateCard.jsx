import React from 'react';
import { Card, CardContent, Box, Typography, Button } from '@mui/material';

const TemplateCard = ({ template, onSelect }) => {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: '#7c6ef5',
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(124,110,245,0.2)',
        },
      }}
      onClick={() => onSelect(template)}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          height: 160,
          background: template.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.06) 0%, transparent 60%)',
          },
        }}
      >
        <Box textAlign="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography sx={{ fontSize: '3rem', lineHeight: 1 }}>{template.emoji}</Typography>
          <Typography
            sx={{
              fontSize: '0.7rem',
              color: template.color,
              fontWeight: 700,
              mt: 0.5,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Template
          </Typography>
        </Box>
      </Box>

      {/* Body */}
      <CardContent sx={{ p: '16px 20px' }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            fontSize: '0.95rem',
            mb: 0.5,
            color: '#f0f0f8',
          }}
        >
          {template.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#888899',
            fontSize: '0.8rem',
            mb: 1.5,
            lineHeight: 1.5,
            minHeight: 36,
          }}
        >
          {template.desc}
        </Typography>
        <Button
          fullWidth
          variant="contained"
          size="small"
          sx={{
            bgcolor: '#7c6ef5',
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            fontSize: '0.875rem',
            py: 0.75,
            '&:hover': { bgcolor: '#a594f9' },
          }}
        >
          Use Template →
        </Button>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
