import { apiClient } from './api';

export const authService = {
  login: async (credentials) => {
    const res = await apiClient.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  register: async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    return res.data;
  },

  logout: async () => {
    return { success: true };
  },

  updateProfile: async (profileData) => {
    const res = await apiClient.put('/users/profile', profileData);
    return res.data;
  },
};

export const authApi = authService;
export default authService;
