import axios from 'axios';

// Your .NET backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5168';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// --- 👇 THIS IS THE FIX 👇 ---
// This "interceptor" runs before every single API request
apiClient.interceptors.request.use(
  (config) => {
    // 1. Get the token from local storage
    const token = localStorage.getItem('accessToken');
    
    // 2. If the token exists, add it to the 'Authorization' header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config; // Continue with the request
  },
  (error) => {
    // This handles errors *before* the request is sent
    return Promise.reject(error);
  }
);
// --- 👆 END OF FIX 👆 ---

// This interceptor handles 401 (Unauthorized) errors from the backend
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // If the token is invalid, log the user out
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);