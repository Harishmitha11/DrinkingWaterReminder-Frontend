import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE || 'https://drinkingwaterreminder-backend.onrender.com';
const api = axios.create({ baseURL: API_BASE + '/api' });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
