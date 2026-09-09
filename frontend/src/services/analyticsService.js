import { apiClient } from './api';

export const analyticsService = {
  getAnalyticsOverview: async () => {
    const res = await apiClient.get('/analytics/overview');
    return res.data;
  },

  getResponseTimeTrends: async (timeframe = '7d') => {
    const res = await apiClient.get('/analytics/response-times', { timeframe });
    return res.data;
  },

  getEmergencyBreakdown: async () => {
    const res = await apiClient.get('/analytics/emergency-breakdown');
    return res.data;
  },
};

export const analyticsApi = analyticsService;
export default analyticsService;
