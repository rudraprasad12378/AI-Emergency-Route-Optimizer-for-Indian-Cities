import { mockAnalytics } from '../mock/analytics';

export const analyticsApi = {
  getOperationalAnalytics: async (timeRange = 'today') => {
    await new Promise((r) => setTimeout(r, 300));
    return mockAnalytics;
  },
  getResponseTimeTrends: async () => {
    await new Promise((r) => setTimeout(r, 200));
    return mockAnalytics.responseTimeTrends;
  },
};
