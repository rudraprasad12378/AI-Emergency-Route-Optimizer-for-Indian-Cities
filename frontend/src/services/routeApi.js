import { mockRoutes } from '../mock/routes';

export const routeApi = {
  getRoutesForEmergency: async (emergencyId) => {
    await new Promise((r) => setTimeout(r, 300));
    return mockRoutes.filter((r) => r.emergencyId === emergencyId || r.emergencyId === 'emg-001');
  },
  optimizeRoute: async (params) => {
    await new Promise((r) => setTimeout(r, 600));
    return mockRoutes[0];
  },
  triggerGreenCorridor: async (routeId) => {
    await new Promise((r) => setTimeout(r, 200));
    return { routeId, active: true, signalsPreempted: 8 };
  },
};
