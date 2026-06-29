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

// Helper to get full URL for images and media with Cloudinary transformations
export const getMediaUrl = (mediaPath, options = {}) => {
  if (!mediaPath) return '';

  if (mediaPath.startsWith('data:')) return mediaPath;

  // Inject Cloudinary transformation params for optimized delivery
  if (mediaPath.includes('res.cloudinary.com') && mediaPath.includes('/upload/')) {
    const uploadMarker = '/upload/';
    const uploadIdx = mediaPath.indexOf(uploadMarker);
    const afterUpload = mediaPath.slice(uploadIdx + uploadMarker.length);

    // If transformations already exist, don't double-apply
    const hasExistingTransform = /^(w_|h_|c_|q_|f_|dpr_|e_|g_|r_|b_|co_|l_|o_|x_|y_|z_)/.test(afterUpload);
    if (hasExistingTransform) return mediaPath;

    const { width = 300, height = 200 } = options;
    const transformation = `w_${width},h_${height},c_fill,q_auto,f_auto,dpr_auto`;
    return mediaPath.replace(uploadMarker, `${uploadMarker}${transformation}/`);
  }

  if (mediaPath.startsWith('http')) return mediaPath;

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  return `${baseUrl}${mediaPath || ''}`;
};

export default api;
