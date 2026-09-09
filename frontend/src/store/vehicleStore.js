import { create } from 'zustand';
import { vehicleService } from '../services/vehicleService';
import { mockVehicles } from '../mock/vehicles';

export const useVehicleStore = create((set, get) => ({
  vehicles: mockVehicles,
  selectedVehicleId: 'veh-001',
  filterType: 'all',
  filterStatus: 'all',
  trackingEnabled: true,
  isLoading: false,
  error: null,

  fetchVehicles: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await vehicleService.getVehicles();
      if (items && items.length) {
        const formatted = items.map((v) => ({
          ...v,
          id: v.id,
          callSign: v.call_sign || v.callSign || v.vehicle_number,
          vehicleNumber: v.vehicle_number || v.vehicleNumber,
          type: (v.type || 'ambulance').toLowerCase(),
          status: (v.status || 'available').toLowerCase(),
          fuelLevel: v.fuel_level_percent || v.fuelLevel || 90,
          speed: v.speed_kmh || v.speed || 0,
          heading: v.heading_deg || v.heading || 0,
          position: {
            lat: v.current_latitude || v.position?.lat || 20.2961,
            lng: v.current_longitude || v.position?.lng || 85.8245,
          },
        }));
        set({ vehicles: formatted, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

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

    // Dispatch location telemetry update in background if possible
    if (position && position.lat && position.lng) {
      vehicleService.updateVehicleLocation(id, {
        latitude: position.lat,
        longitude: position.lng,
        speed_kmh: speed,
        heading_deg: heading,
      }).catch(() => {});
    }
  },

  updateVehicleStatus: (id, status) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === id ? { ...v, status, updatedAt: new Date().toISOString() } : v
      ),
    }));
  },
}));

export default useVehicleStore;
