import { mockEmergencies } from '../mock/emergencies';

export const emergencyApi = {
  getEmergencies: async (filters = {}) => {
    await new Promise((r) => setTimeout(r, 300));
    let list = [...mockEmergencies];
    if (filters.status && filters.status !== 'all') {
      list = list.filter((e) => e.status === filters.status);
    }
    if (filters.severity && filters.severity !== 'all') {
      list = list.filter((e) => e.severity === filters.severity);
    }
    return list;
  },
  getEmergencyById: async (id) => {
    await new Promise((r) => setTimeout(r, 200));
    return mockEmergencies.find((e) => e.id === id) || mockEmergencies[0];
  },
  createEmergency: async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    return {
      ...data,
      id: `emg-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
  },
  updateStatus: async (id, status) => {
    await new Promise((r) => setTimeout(r, 250));
    return { id, status, updatedAt: new Date().toISOString() };
  },
};
