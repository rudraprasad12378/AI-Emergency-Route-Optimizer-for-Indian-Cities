import { create } from 'zustand';
import { authService } from '../services/authService';

const ROLE_CREDENTIALS = {
  dispatcher: { email: 'dispatcher@ero.gov.in', password: 'emergency2026' },
  driver: { email: 'driver@ero.gov.in', password: 'emergency2026' },
  citizen: { email: 'citizen@ero.gov.in', password: 'emergency2026' },
  hospital: { email: 'hospital@ero.gov.in', password: 'emergency2026' },
  admin: { email: 'admin@ero.gov.in', password: 'emergency2026' },
};

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('auth_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.user || null;
    }
  } catch {
    return null;
  }
  return null;
};

export const useAuthStore = create((set, get) => ({
  user: getStoredUser() || {
    id: 'usr-dispatcher-01',
    name: 'Dispatcher Officer Priya Nayak',
    email: 'dispatcher@ero.gov.in',
    role: 'dispatcher',
    department: 'Odisha 108 Command Center',
  },
  token: localStorage.getItem('auth_token') || null,
  isAuthenticated: Boolean(localStorage.getItem('auth_token')),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login({ email, password });
      const rawUser = data.user || data;
      const token = data.access_token || data.token;
      
      const normalizedRole = (rawUser.role || 'dispatcher').toLowerCase();
      const userObj = {
        ...rawUser,
        role: normalizedRole,
      };

      if (token) {
        localStorage.setItem('auth_token', token);
      }
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

  fetchCurrentUser: async () => {
    try {
      const rawUser = await authService.getCurrentUser();
      const normalizedRole = (rawUser.role || 'dispatcher').toLowerCase();
      const userObj = { ...rawUser, role: normalizedRole };
      set({ user: userObj, isAuthenticated: true });
      return userObj;
    } catch {
      return null;
    }
  },

  switchRole: async (role) => {
    const roleKey = role.toLowerCase();
    const creds = ROLE_CREDENTIALS[roleKey] || { email: `${roleKey}@ero.gov.in`, password: 'emergency2026' };
    
    // Authenticate with real credentials against backend
    const res = await get().login(creds.email, creds.password);
    if (res.success) {
      return res.user;
    }
    return get().user;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  updateProfile: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },
}));

export default useAuthStore;
