import React, { useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const templates = [
  { id: 1, name: 'Template 1', image: 'https://via.placeholder.com/300x200' },
  { id: 2, name: 'Template 2', image: 'https://via.placeholder.com/300x200' },
  // Add more
];

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
    else {
      axios.get('http://localhost:5000/api/user/profile', { headers: { Authorization: `Bearer ${token}` } })
        .catch(() => navigate('/'));
    }
  }, [navigate]);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4">Dashboard</Typography>
      <Grid container spacing={2}>
        {templates.map(template => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card>
              <CardMedia component="img" height="140" image={template.image} />
              <CardContent>
                <Typography variant="h6">{template.name}</Typography>
                <Button variant="contained" onClick={() => navigate('/record')}>Use Template</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Dashboard;