import { useNotificationStore } from '../store/notificationStore';

export const useNotifications = () => {
  const store = useNotificationStore();
  return {
    notifications: store.notifications,
    unreadCount: store.unreadCount,
    markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead,
    addNotification: store.addNotification,
    clearNotifications: store.clearNotifications,
  };
};

export default useNotifications;
