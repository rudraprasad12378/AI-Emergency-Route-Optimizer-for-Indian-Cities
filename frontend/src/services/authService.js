import { apiClient } from './api';
import { mockUsers } from '../mock/users';

export const authService = {
  login: async (credentials) => {
    const user = mockUsers.find((u) => u.email === credentials.email) || mockUsers[0];
    const mockAuthResponse = {
      user,
      token: 'jwt-mock-token-odisha-108-operator',
      expiresIn: 3600,
    };
    const res = await apiClient.post('/auth/login', credentials, { mockData: mockAuthResponse });
    return res.data || mockAuthResponse;
  },

  getCurrentUser: async () => {
    const res = await apiClient.get('/auth/me', {}, { mockData: mockUsers[0] });
    return res.data || mockUsers[0];
  },

  logout: async () => {
    const res = await apiClient.post('/auth/logout', {}, { mockData: { success: true } });
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await apiClient.put('/auth/profile', profileData, {
      mockData: { ...mockUsers[0], ...profileData },
    });
    return res.data;
  },
};

export const authApi = authService;
export default authService;
