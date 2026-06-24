import axios from 'axios';

// Create a centralized Axios instance pointing to our backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — runs before every API call
// Automatically attaches the JWT token if the user is logged in
api.interceptors.request.use(
  (config) => {
    // Read the stored user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      // Attach token in Authorization header
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
