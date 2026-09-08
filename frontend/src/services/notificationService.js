import { apiClient } from './api';
import { mockNotifications } from '../mock/notifications';

export const notificationService = {
  getNotifications: async (unreadOnly = false) => {
    const res = await apiClient.get('/notifications', { unread_only: unreadOnly }, {
      mockData: { items: mockNotifications, total: mockNotifications.length },
    });
    const data = res.data;
    if (data && Array.isArray(data.items)) {
      return data.items;
    }
    return Array.isArray(data) ? data : mockNotifications;
  },

  markAsRead: async (id) => {
    const res = await apiClient.post(`/notifications/${id}/read`, {}, {
      mockData: { id, is_read: true, read_at: new Date().toISOString() },
    });
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await apiClient.post('/notifications/read-all', {}, {
      mockData: { success: true },
    });
    return res.data;
  },
};

export default notificationService;
