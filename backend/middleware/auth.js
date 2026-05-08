const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ai-resume-video-builder-jwt-secret-2024';

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    console.warn('Auth middleware: No token provided');
    return res.status(401).json({ error: 'Access denied, no token' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.error('Auth middleware: Token verification failed —', error.message);
    // If token is expired, send a clearer message
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired, please log in again' });
    }
    res.status(401).json({ error: 'Invalid token, please log in again' });
  }
};

module.exports = auth;