import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, error, login, logout, updateProfile, switchRole } = useAuthStore();
  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
    switchRole,
    role: user?.role || 'dispatcher',
    isDispatcher: user?.role === 'dispatcher',
    isDriver: user?.role === 'driver',
    isCitizen: user?.role === 'citizen',
    isHospital: user?.role === 'hospital',
    isAdmin: user?.role === 'admin',
  };
};

export default useAuth;
