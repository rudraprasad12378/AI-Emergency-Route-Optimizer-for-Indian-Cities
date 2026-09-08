import { create } from 'zustand';
import { authService } from '../services/authService';
import { mockUsers } from '../mock/users';

const ROLE_CREDENTIALS = {
  dispatcher: { email: 'dispatcher@ero.gov.in', password: 'emergency2026' },
  driver: { email: 'driver@ero.gov.in', password: 'emergency2026' },
  citizen: { email: 'citizen@ero.gov.in', password: 'emergency2026' },
  hospital: { email: 'hospital@ero.gov.in', password: 'emergency2026' },
  admin: { email: 'admin@ero.gov.in', password: 'emergency2026' },
};

export const useAuthStore = create((set, get) => ({
  user: {
    id: 'usr-dispatcher-01',
    name: 'Dispatcher Officer Priya Nayak',
    email: 'dispatcher@ero.gov.in',
    role: 'dispatcher',
    department: 'Odisha 108 Command Center',
  },
  token: localStorage.getItem('auth_token') || 'jwt-initial-token',
  isAuthenticated: true,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login({ email, password });
      const rawUser = data.user || data;
      const token = data.access_token || data.token || `jwt-${Date.now()}`;
      
      const normalizedRole = (rawUser.role || 'dispatcher').toLowerCase();
      const userObj = {
        ...rawUser,
        role: normalizedRole,
      };

      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify({ token, user: userObj }));

      set({
        user: userObj,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return { success: true, user: userObj };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message || 'Authentication failed';
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  switchRole: async (role) => {
    const roleKey = role.toLowerCase();
    const creds = ROLE_CREDENTIALS[roleKey] || { email: `${roleKey}@ero.gov.in`, password: 'emergency2026' };
    
    // Attempt real live login for selected role
    try {
      const res = await get().login(creds.email, creds.password);
      if (res.success) return res.user;
    } catch (e) {
      // Fallback
    }

    const fallbackUser = mockUsers.find((u) => u.role === roleKey) || {
      id: `usr-${roleKey}`,
      name: `${roleKey.toUpperCase()} Officer`,
      email: creds.email,
      role: roleKey,
      department: 'Emergency Response Command',
    };

    set({
      user: fallbackUser,
      token: `jwt-${roleKey}-token`,
      isAuthenticated: true,
    });
    return fallbackUser;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateProfile: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },
}));

export default useAuthStore;
