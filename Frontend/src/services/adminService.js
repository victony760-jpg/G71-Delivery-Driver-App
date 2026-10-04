import api from './api.js';

export const approveRequest = async (id) => {
  const { data } = await api.put(`/admin/requests/${id}/approve`);
  return data;
};

export const getAllRequests = async () => {
  const { data } = await api.get('/admin/requests');
  return data;
};
