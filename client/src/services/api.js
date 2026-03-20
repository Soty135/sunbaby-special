import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('API baseURL:', import.meta.env.VITE_API_URL);

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
  // If it's already a Base64 data URL, return as is
  if (mediaPath && mediaPath.startsWith('data:')) {
    return mediaPath;
  }
  
  // If it's a full URL (http/https), return as is
  if (mediaPath && mediaPath.startsWith('http')) {
    return mediaPath;
  }
  
  // Otherwise, prepend the API URL
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  return `${baseUrl}${mediaPath || ''}`;
};

export default api;
