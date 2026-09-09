import { apiClient } from './api';

export const notificationService = {
  getNotifications: async (unreadOnly = false) => {
    const res = await apiClient.get('/notifications', { unread_only: unreadOnly });
    const data = res.data;
    if (data && Array.isArray(data.items)) {
      return data.items;
    }
    return Array.isArray(data) ? data : [];
  },

  markAsRead: async (id) => {
    const res = await apiClient.post(`/notifications/${id}/read`, {});
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await apiClient.post('/notifications/read-all', {});
    return res.data;
  },
};

export default notificationService;
