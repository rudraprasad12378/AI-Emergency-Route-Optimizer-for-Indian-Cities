import { create } from 'zustand';
import { notificationService } from '../services/notificationService';
import { mockNotifications } from '../mock/notifications';

export const useNotificationStore = create((set, get) => ({
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter((n) => !n.read && !n.is_read).length,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const items = await notificationService.getNotifications();
      if (items && items.length) {
        const formatted = items.map((n) => ({
          ...n,
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type || 'info',
          read: n.is_read ?? false,
          timestamp: n.created_at || new Date().toISOString(),
        }));
        set({
          notifications: formatted,
          unreadCount: formatted.filter((n) => !n.read).length,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
    notificationService.markAsRead(id).catch(() => {});
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
    notificationService.markAllAsRead().catch(() => {});
  },

  addNotification: (notification) =>
    set((state) => {
      const newNotif = {
        ...notification,
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      const updated = [newNotif, ...state.notifications];
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    }),

  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));

export default useNotificationStore;
