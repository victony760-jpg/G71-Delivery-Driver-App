import api from './api';
export const authService = {
  login: (data) =>
    api.post('/auth/login', data).then((response) => response.data),
};
