const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directories
const uploadsDir = path.join(__dirname, 'uploads');
const videosDir = path.join(uploadsDir, 'videos');
const resumesDir = path.join(uploadsDir, 'resumes');

[uploadsDir, videosDir, resumesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

app.use('/uploads', express.static(uploadsDir));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });

    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.log('⚠️ MongoDB connection failed:', err.message);
    console.log('⚠️ Running in mock mode — all data stored in-memory');
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/analyze', require('./routes/analyze'));
app.use('/api/resume', require('./routes/resume'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongo:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected (mock mode)',
    timestamp: new Date().toISOString(),
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n🚀 AI Resume Video Builder — Backend');
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log(`   Health check:      http://localhost:${PORT}/api/health\n`);
});