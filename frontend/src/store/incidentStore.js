import { create } from 'zustand';
import { incidentService } from '../services/incidentService';
import { mockIncidents } from '../mock/incidents';

export const useIncidentStore = create((set, get) => ({
  incidents: mockIncidents,
  selectedIncidentId: null,
  filterType: 'all',
  filterSeverity: 'all',
  isLoading: false,
  error: null,

  fetchIncidents: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await incidentService.getIncidents();
      if (items && items.length) {
        const formatted = items.map((inc) => ({
          ...inc,
          id: inc.id,
          title: inc.title,
          type: (inc.type || 'ROAD_BLOCKAGE').toLowerCase(),
          severity: (inc.severity || 'HIGH').toLowerCase(),
          status: (inc.status || 'ACTIVE').toLowerCase(),
          delayMinutes: inc.delay_minutes || inc.delayMinutes || 5,
          locationName: inc.address || inc.locationName,
          coordinates: {
            lat: inc.latitude || inc.coordinates?.lat || 20.2961,
            lng: inc.longitude || inc.coordinates?.lng || 85.8245,
          },
          description: inc.description,
          reportedAt: inc.created_at || inc.reportedAt || new Date().toISOString(),
        }));
        set({ incidents: formatted, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),
  setFilterType: (type) => set({ filterType: type }),
  setFilterSeverity: (severity) => set({ filterSeverity: severity }),

  reportIncident: async (incidentData) => {
    const payload = {
      title: incidentData.title || 'Road Hazard',
      type: incidentData.type || 'ROAD_BLOCKAGE',
      severity: incidentData.severity || 'HIGH',
      address: incidentData.address || incidentData.locationName || 'Bhubaneswar Corridor',
      latitude: incidentData.latitude || incidentData.coordinates?.lat || 20.2961,
      longitude: incidentData.longitude || incidentData.coordinates?.lng || 85.8245,
      description: incidentData.description || 'Reported road bottleneck',
      delay_minutes: incidentData.delayMinutes || incidentData.delay_minutes || 5,
    };

    let created = null;
    try {
      created = await incidentService.reportIncident(payload);
    } catch {
      // optimistic fallback
    }

    const newIncident = {
      ...payload,
      id: created?.id || `inc-${Date.now().toString().slice(-4)}`,
      status: 'active',
      locationName: payload.address,
      coordinates: { lat: payload.latitude, lng: payload.longitude },
      reportedAt: new Date().toISOString(),
      source: 'Control Center Operator',
    };

    set((state) => ({
      incidents: [newIncident, ...state.incidents],
      selectedIncidentId: newIncident.id,
    }));
    return newIncident;
  },

  resolveIncident: async (id) => {
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === id ? { ...inc, status: 'resolved' } : inc
      ),
    }));

    try {
      await incidentService.resolveIncident(id);
    } catch {
      // Keep optimistic state
    }
  },
}));

export default useIncidentStore;
