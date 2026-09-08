import { create } from 'zustand';
import { mockEmergencies } from '../mock/emergencies';

export const useEmergencyStore = create((set, get) => ({
  emergencies: mockEmergencies,
  activeEmergencyId: 'emg-001',
  filterStatus: 'all',
  filterSeverity: 'all',
  isLoading: false,
  error: null,

  setActiveEmergencyId: (id) => set({ activeEmergencyId: id }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterSeverity: (severity) => set({ filterSeverity: severity }),

  getActiveEmergency: () => {
    const { emergencies, activeEmergencyId } = get();
    return emergencies.find((e) => e.id === activeEmergencyId) || emergencies[0] || null;
  },

  createEmergency: (newEmergency) => {
    const emergencyId = `emg-${Date.now().toString().slice(-4)}`;
    const emergencyNumber = `EMG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const entry = {
      ...newEmergency,
      id: emergencyId,
      emergencyNumber,
      status: 'assigned',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      etaMinutes: newEmergency.etaMinutes || 8,
      greenCorridorActive: true,
    };
    set((state) => ({
      emergencies: [entry, ...state.emergencies],
      activeEmergencyId: emergencyId,
    }));
    return entry;
  },

  updateEmergencyStatus: (id, status) => {
    set((state) => ({
      emergencies: state.emergencies.map((e) =>
        e.id === id ? { ...e, status, updatedAt: new Date().toISOString() } : e
      ),
    }));
  },

  toggleGreenCorridor: (id) => {
    set((state) => ({
      emergencies: state.emergencies.map((e) =>
        e.id === id ? { ...e, greenCorridorActive: !e.greenCorridorActive, updatedAt: new Date().toISOString() } : e
      ),
    }));
  },
}));
