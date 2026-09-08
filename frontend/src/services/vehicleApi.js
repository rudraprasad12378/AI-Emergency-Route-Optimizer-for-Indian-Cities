import { mockVehicles } from '../mock/vehicles';

export const vehicleApi = {
  getVehicles: async () => {
    await new Promise((r) => setTimeout(r, 250));
    return mockVehicles;
  },
  getVehicleById: async (id) => {
    await new Promise((r) => setTimeout(r, 150));
    return mockVehicles.find((v) => v.id === id) || mockVehicles[0];
  },
  updateStatus: async (id, status) => {
    await new Promise((r) => setTimeout(r, 200));
    return { id, status };
  },
};
