import axios from 'axios';
import { API_URL, STORAGE_KEYS } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const exp = Number(localStorage.getItem(STORAGE_KEYS.TOKEN_EXP) || 0);
  if (token && exp && Date.now() > exp) {
    localStorage.clear();
    window.location.href = '/login?reason=expired';
    return Promise.reject(new Error('Token expired'));
  }
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      if (
        ['/admin', '/driver'].some((p) =>
          window.location.pathname.startsWith(p),
        )
      ) {
        window.location.href = '/login?reason=unauthorized';
      }
    }
    return Promise.reject(err);
  },
);

export default api;
