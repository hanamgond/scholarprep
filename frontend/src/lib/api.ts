import axios from "axios";

export const api = axios.create({
  // Use a relative path for production (for the Vercel proxy) 
  // and the localhost URL for local development.
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:3000',
  timeout: 15_000,
});

// Optional: response interceptor to normalize errors later if you want
