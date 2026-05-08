import React, { useState, useCallback } from 'react';
import { TextField, Button, Card, CardContent, Typography, Box, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleForgotEmailChange = useCallback((e) => {
    setForgotEmail(e.target.value);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isSignUp ? '/register' : '/login';
      const res = await axios.post(`http://localhost:5000/api/auth${endpoint}`, { email, password });
      
      if (!isSignUp) {
        localStorage.setItem('token', res.data.token);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setSuccess('Account created successfully! Please login now.');
        setIsSignUp(false);
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setError('Please enter your email address');
      return;
    }

    setForgotLoading(true);
    try {
      // For now, show a message - in production this would send a reset email
      setSuccess('Password reset link has been sent to ' + forgotEmail);
      setOpenForgotPassword(false);
      setForgotEmail('');
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <Box style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card style={{ maxWidth: '400px', width: '100%' }}>
        <CardContent>
          <Typography variant="h4" style={{ marginBottom: '10px', textAlign: 'center', color: '#667eea' }}>
            AI Resume Video Builder
          </Typography>
          <Typography variant="subtitle1" style={{ marginBottom: '20px', textAlign: 'center', color: '#666' }}>
            {isSignUp ? 'Create Account' : 'Login to Your Account'}
          </Typography>

          {error && <Alert severity="error" style={{ marginBottom: '15px' }}>{error}</Alert>}
          {success && <Alert severity="success" style={{ marginBottom: '15px' }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField 
              label="Email" 
              type="email"
              value={email} 
              onChange={handleEmailChange} 
              fullWidth 
              margin="normal"
              disabled={loading}
              autoComplete="email"
            />
            <TextField 
              label="Password" 
              type="password" 
              value={password} 
              onChange={handlePasswordChange} 
              fullWidth 
              margin="normal"
              disabled={loading}
              autoComplete="current-password"
            />
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              style={{ marginTop: '20px', marginBottom: '10px', background: '#667eea' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
            </Button>
          </form>

          <Button 
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ width: '100%', marginBottom: '15px' }}
          >
            {isSignUp ? 'Already have account? Login' : 'Need account? Sign Up'}
          </Button>

          {!isSignUp && (
            <Button 
              onClick={() => setOpenForgotPassword(true)}
              style={{ width: '100%', color: '#667eea', textDecoration: 'underline' }}
            >
              Forgot Password?
            </Button>
          )}

          {/* Forgot Password Dialog */}
          <Dialog open={openForgotPassword} onClose={() => setOpenForgotPassword(false)}>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogContent style={{ minWidth: '300px' }}>
              <Typography variant="body2" style={{ marginBottom: '15px', color: '#666' }}>
                Enter your email address and we'll send you a password reset link.
              </Typography>
              <TextField 
                label="Email Address" 
                type="email"
                value={forgotEmail} 
                onChange={handleForgotEmailChange} 
                fullWidth 
                margin="normal"
                disabled={forgotLoading}
                autoComplete="email"
              />
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setOpenForgotPassword(false)}
                disabled={forgotLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleForgotPassword}
                variant="contained"
                style={{ background: '#667eea' }}
                disabled={forgotLoading}
              >
                {forgotLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;