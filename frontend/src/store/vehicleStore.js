import { create } from 'zustand';
import { mockVehicles } from '../mock/vehicles';

export const useVehicleStore = create((set, get) => ({
  vehicles: mockVehicles,
  selectedVehicleId: 'veh-001',
  filterType: 'all',
  filterStatus: 'all',
  trackingEnabled: true,

  setSelectedVehicleId: (id) => set({ selectedVehicleId: id }),
  setFilterType: (type) => set({ filterType: type }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setTrackingEnabled: (enabled) => set({ trackingEnabled: enabled }),

  getSelectedVehicle: () => {
    const { vehicles, selectedVehicleId } = get();
    return vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0] || null;
  },

  updateVehicleLocation: (id, position, speed, heading) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === id ? { ...v, position, speed, heading, updatedAt: new Date().toISOString() } : v
      ),
    }));
  },

  updateVehicleStatus: (id, status) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === id ? { ...v, status, updatedAt: new Date().toISOString() } : v
      ),
    }));
  },
}));
