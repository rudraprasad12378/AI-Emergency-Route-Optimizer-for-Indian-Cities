import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, error, login, logout, updateProfile } = useAuthStore();
  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
    isDispatcher: user?.role === 'dispatcher' || user?.role === 'admin',
    isAdmin: user?.role === 'admin',
  };
};

export default useAuth;
