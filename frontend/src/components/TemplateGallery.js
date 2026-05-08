import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
  InputAdornment,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
  ModernTemplate,
  ProfessionalTemplate,
  CreativeTemplate,
  MinimalistTemplate,
  ATSFriendlyTemplate,
  FresherTemplate,
  DeveloperTemplate,
  DataAnalystTemplate
} from './ResumeTemplates';

const TEMPLATE_DATA = [
  {
    id: 'modern',
    name: 'Modern',
    category: 'modern',
    description: 'Clean and contemporary design with modern aesthetics',
    icon: '🎨',
    component: ModernTemplate,
    tags: ['colorful', 'professional', 'modern']
  },
  {
    id: 'professional',
    name: 'Professional',
    category: 'professional',
    description: 'Classic professional design suitable for corporate roles',
    icon: '💼',
    component: ProfessionalTemplate,
    tags: ['formal', 'traditional', 'corporate']
  },
  {
    id: 'creative',
    name: 'Creative',
    category: 'creative',
    description: 'Vibrant and creative design for creative professionals',
    icon: '✨',
    component: CreativeTemplate,
    tags: ['creative', 'colorful', 'modern']
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    category: 'minimal',
    description: 'Simple and clean minimal design with focus on content',
    icon: '📋',
    component: MinimalistTemplate,
    tags: ['minimal', 'clean', 'simple']
  },
  {
    id: 'ats',
    name: 'ATS-Friendly',
    category: 'ats',
    description: 'Optimized for Applicant Tracking System parsing',
    icon: '⚙️',
    component: ATSFriendlyTemplate,
    tags: ['ats', 'optimized', 'technical']
  },
  {
    id: 'fresher',
    name: 'Fresher Resume',
    category: 'fresher',
    description: 'Perfect for fresh graduates and entry-level positions',
    icon: '👨‍🎓',
    component: FresherTemplate,
    tags: ['fresher', 'student', 'entry-level']
  },
  {
    id: 'developer',
    name: 'Developer Resume',
    category: 'developer',
    description: 'Designed specifically for software developers and engineers',
    icon: '💻',
    component: DeveloperTemplate,
    tags: ['developer', 'tech', 'engineer']
  },
  {
    id: 'analyst',
    name: 'Data Analyst',
    category: 'analyst',
    description: 'Tailored for data analysts and business intelligence professionals',
    icon: '📊',
    component: DataAnalystTemplate,
    tags: ['analyst', 'data', 'business']
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Templates' },
  { id: 'modern', label: 'Modern' },
  { id: 'professional', label: 'Professional' },
  { id: 'ats', label: 'ATS-Friendly' },
  { id: 'creative', label: 'Creative' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'fresher', label: 'Fresher' },
  { id: 'developer', label: 'Developer' },
  { id: 'analyst', label: 'Data Analyst' }
];

const TemplateGallery = ({ userData, onSelectTemplate, isEmbedded = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('name');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Filter templates based on search and category
  const filteredTemplates = useMemo(() => {
    let filtered = TEMPLATE_DATA.filter(template => {
      const matchesSearch = 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort
    if (selectedSort === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === 'category') {
      filtered.sort((a, b) => a.category.localeCompare(b.category));
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedSort]);

  const handleSelectTemplate = useCallback((templateId) => {
    const selected = TEMPLATE_DATA.find(t => t.id === templateId);
    if (onSelectTemplate && selected) {
      onSelectTemplate(selected);
      setPreviewTemplate(null);
    }
  }, [onSelectTemplate]);

  const handlePreview = useCallback((template) => {
    setPreviewTemplate(template);
  }, []);

  return (
    <Box style={{ width: '100%' }}>
      {/* Header */}
      {!isEmbedded && (
        <Box style={{ marginBottom: '30px', textAlign: 'center' }}>
          <Typography variant="h4" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
            📄 Resume Template Gallery
          </Typography>
          <Typography variant="body1" style={{ color: '#666' }}>
            Choose from professional templates designed for different industries and career stages
          </Typography>
        </Box>
      )}

      {/* Filters and Search */}
      <Box style={{
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' },
        gap: '15px'
      }}>
        {/* Search */}
        <TextField
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: '#999' }} />
              </InputAdornment>
            )
          }}
          style={{ backgroundColor: 'white', borderRadius: '6px' }}
        />

        {/* Category Filter */}
        <FormControl fullWidth size="small">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ backgroundColor: 'white' }}
          >
            {CATEGORIES.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>{cat.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort */}
        <FormControl fullWidth size="small">
          <Select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            style={{ backgroundColor: 'white' }}
          >
            <MenuItem value="name">Sort by Name</MenuItem>
            <MenuItem value="category">Sort by Category</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Results Count */}
      <Box style={{ marginBottom: '20px' }}>
        <Typography variant="body2" style={{ color: '#666' }}>
          {filteredTemplates.length === 1
            ? '1 template found'
            : `${filteredTemplates.length} templates found`}
        </Typography>
      </Box>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <Grid container spacing={3}>
          {filteredTemplates.map(template => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
              <Card
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === template.id ? 'translateY(-8px)' : 'none',
                  boxShadow: hoveredCard === template.id 
                    ? '0 12px 24px rgba(0,0,0,0.15)'
                    : '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={() => setHoveredCard(template.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Template Icon/Preview Area */}
                <Box style={{
                  backgroundColor: '#f0f4f8',
                  padding: '40px 20px',
                  textAlign: 'center',
                  borderBottom: '1px solid #e0e0e0',
                  minHeight: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography style={{ fontSize: '60px' }}>
                    {template.icon}
                  </Typography>
                </Box>

                {/* Content */}
                <Box style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    {template.name}
                  </Typography>
                  <Typography variant="body2" style={{ color: '#666', marginBottom: '12px', flex: 1 }}>
                    {template.description}
                  </Typography>

                  {/* Tags */}
                  <Box style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {template.tags.slice(0, 2).map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        style={{ height: '24px', fontSize: '11px' }}
                      />
                    ))}
                  </Box>

                  {/* Buttons */}
                  <Box style={{ display: 'flex', gap: '10px' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handlePreview(template)}
                      fullWidth
                      style={{ color: '#667eea', borderColor: '#667eea' }}
                    >
                      Preview
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleSelectTemplate(template.id)}
                      fullWidth
                      style={{ backgroundColor: '#667eea' }}
                    >
                      Use
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px'
        }}>
          <Typography variant="h6" style={{ color: '#999', marginBottom: '10px' }}>
            No templates found
          </Typography>
          <Typography variant="body2" style={{ color: '#bbb' }}>
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        maxWidth="md"
        fullWidth
        style={{ maxHeight: '90vh' }}
      >
        <DialogTitle style={{
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              {previewTemplate?.icon} {previewTemplate?.name} - Preview
            </Typography>
            <Typography variant="body2" style={{ color: '#666' }}>
              {previewTemplate?.description}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent style={{ padding: '20px', maxHeight: '60vh', overflow: 'auto' }}>
          {previewTemplate && previewTemplate.component ? (
            <previewTemplate.component data={userData || { name: 'John Doe', certifications: [], profiles: {} }} />
          ) : (
            <Box style={{ textAlign: 'center', padding: '40px' }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions style={{ padding: '20px', borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={() => setPreviewTemplate(null)}>Close</Button>
          {previewTemplate && (
            <Button
              variant="contained"
              onClick={() => handleSelectTemplate(previewTemplate.id)}
              style={{ backgroundColor: '#667eea' }}
            >
              Use This Template
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateGallery;
