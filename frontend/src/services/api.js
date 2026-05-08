import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ── Auth APIs ──────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (data) => api.post('/api/auth/login', data),
};

// ── User APIs ──────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get('/api/user/profile'),
  updateProfile: (data) => api.put('/api/user/profile', data),
};

// ── Upload APIs ────────────────────────────────────────────
export const uploadAPI = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/api/upload/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadVideo: (blob) => {
    const formData = new FormData();
    formData.append('video', blob, 'recording.webm');
    return api.post('/api/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ── Resume APIs ────────────────────────────────────────────
export const resumeAPI = {
  /** Extract resume data from video context (simulates LLM) */
  extractFromVideo: (videoContext) =>
    api.post('/api/resume/extract', { videoContext }),

  /** Generate full HTML resume from template + data */
  generateResume: (templateId, videoContext) =>
    api.post('/api/resume/generate', { templateId, videoContext }),

  /** Get user's resume generation history */
  getHistory: () => api.get('/api/resume/history'),
};

export default api;
