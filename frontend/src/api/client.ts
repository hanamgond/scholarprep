import axios from "axios";

export const api = axios.create({
  // This automatically uses the correct address for production or development
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:3000',
  timeout: 15_000,
});
