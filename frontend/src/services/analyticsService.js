import { apiClient } from './api';
import { mockAnalytics } from '../mock/analytics';

export const analyticsService = {
  getAnalyticsOverview: async () => {
    const res = await apiClient.get('/analytics/overview', {}, { mockData: mockAnalytics });
    return res.data || mockAnalytics;
  },

  getResponseTimeTrends: async (timeframe = '7d') => {
    const res = await apiClient.get('/analytics/response-times', { timeframe }, {
      mockData: mockAnalytics.responseTimeTrends,
    });
    return res.data || mockAnalytics.responseTimeTrends;
  },

  getEmergencyBreakdown: async () => {
    const res = await apiClient.get('/analytics/emergency-breakdown', {}, {
      mockData: mockAnalytics.emergencyTypeBreakdown,
    });
    return res.data || mockAnalytics.emergencyTypeBreakdown;
  },
};

export const analyticsApi = analyticsService;
export default analyticsService;
