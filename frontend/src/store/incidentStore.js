import { create } from 'zustand';
import { mockIncidents } from '../mock/incidents';

export const useIncidentStore = create((set) => ({
  incidents: mockIncidents,
  selectedIncidentId: null,
  filterType: 'all',
  filterSeverity: 'all',
  isLoading: false,

  setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),
  setFilterType: (type) => set({ filterType: type }),
  setFilterSeverity: (severity) => set({ filterSeverity: severity }),

  reportIncident: (incidentData) => {
    const newIncident = {
      ...incidentData,
      id: `inc-${Date.now().toString().slice(-4)}`,
      status: 'active',
      reportedAt: new Date().toISOString(),
      source: 'Control Center Operator',
    };
    set((state) => ({
      incidents: [newIncident, ...state.incidents],
      selectedIncidentId: newIncident.id,
    }));
    return newIncident;
  },

  resolveIncident: (id) => {
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === id ? { ...inc, status: 'resolved' } : inc
      ),
    }));
  },
}));
