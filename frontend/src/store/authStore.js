import { create } from 'zustand';
import { mockUsers } from '../mock/users';

export const useAuthStore = create((set) => ({
  user: mockUsers[0], // Default logged in as Dispatcher
  token: 'mock-jwt-token-dispatcher-01',
  isAuthenticated: true,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate network authentication
      await new Promise((resolve) => setTimeout(resolve, 600));
      const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (foundUser) {
        set({
          user: foundUser,
          token: `mock-jwt-token-${foundUser.id}`,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      } else {
        // Fallback default operator
        const defaultUser = {
          id: 'usr-custom',
          name: email.split('@')[0],
          email,
          role: 'dispatcher',
          department: 'Emergency Response Command',
        };
        set({
          user: defaultUser,
          token: 'mock-jwt-token-custom',
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      }
    } catch (err) {
      set({ error: err.message || 'Authentication failed', isLoading: false });
      return { success: false, error: err.message };
    }
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateProfile: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },
}));
