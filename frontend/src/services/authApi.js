import { mockUsers } from '../mock/users';

export const authApi = {
  login: async (credentials) => {
    await new Promise((r) => setTimeout(r, 400));
    const user = mockUsers.find((u) => u.email === credentials.email) || mockUsers[0];
    return {
      user,
      token: 'jwt-token-mock-auth',
      expiresIn: 3600,
    };
  },
  getCurrentUser: async () => {
    await new Promise((r) => setTimeout(r, 200));
    return mockUsers[0];
  },
  logout: async () => {
    await new Promise((r) => setTimeout(r, 100));
    return { success: true };
  },
};
