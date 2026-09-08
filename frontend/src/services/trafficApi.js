import { mockTrafficSensors, mockRiskZones } from '../mock/traffic';

export const trafficApi = {
  getTrafficSensors: async () => {
    await new Promise((r) => setTimeout(r, 200));
    return mockTrafficSensors;
  },
  getRiskZones: async () => {
    await new Promise((r) => setTimeout(r, 200));
    return mockRiskZones;
  },
};
