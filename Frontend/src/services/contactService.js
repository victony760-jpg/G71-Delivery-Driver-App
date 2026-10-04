import api from './api.js';

export async function submitContactMessage(payload) {
  const response = await api.post('/public/contact', payload);
  return response.data;
}
