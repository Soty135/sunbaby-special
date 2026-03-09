import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for general error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // General error handling without authentication redirects
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Helper to get full URL for images and media
export const getMediaUrl = (mediaPath) => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  return mediaPath && mediaPath.startsWith('http') 
    ? mediaPath 
    : `${baseUrl}${mediaPath || ''}`;
};

export default api;