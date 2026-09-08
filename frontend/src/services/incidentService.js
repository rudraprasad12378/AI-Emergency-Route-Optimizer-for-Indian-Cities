import { apiClient } from './api';
import { mockIncidents } from '../mock/incidents';

export const incidentService = {
  getIncidents: async (filters = {}) => {
    const res = await apiClient.get('/incidents', filters, {
      mockData: { items: mockIncidents, total: mockIncidents.length },
    });
    const data = res.data;
    if (data && Array.isArray(data.items)) {
      return data.items;
    }
    return Array.isArray(data) ? data : mockIncidents;
  },

  getActiveIncidents: async () => {
    const res = await apiClient.get('/incidents/active', {}, {
      mockData: mockIncidents.filter((i) => i.status === 'ACTIVE' || i.status === 'active'),
    });
    return Array.isArray(res.data) ? res.data : mockIncidents;
  },

  getIncidentById: async (id) => {
    const fallback = mockIncidents.find((i) => i.id === id) || mockIncidents[0];
    const res = await apiClient.get(`/incidents/${id}`, {}, { mockData: fallback });
    return res.data || fallback;
  },

  reportIncident: async (incidentData) => {
    const payload = {
      title: incidentData.title || 'Road Hazard',
      type: (incidentData.type || 'ROAD_BLOCKAGE').toUpperCase(),
      severity: (incidentData.severity || 'HIGH').toUpperCase(),
      latitude: incidentData.latitude ?? incidentData.lat ?? 20.2961,
      longitude: incidentData.longitude ?? incidentData.lng ?? 85.8245,
      address: incidentData.address || incidentData.locationName || 'Bhubaneswar Corridor',
      description: incidentData.description || 'Reported hazard',
      delay_minutes: incidentData.delay_minutes || incidentData.delayMinutes || 5,
      radius_meters: incidentData.radius_meters || 300,
    };
    const res = await apiClient.post('/incidents', payload, {
      mockData: { id: `inc-${Date.now().toString().slice(-4)}`, status: 'ACTIVE', ...payload },
    });
    return res.data;
  },

  resolveIncident: async (id, notes = 'Cleared by traffic personnel') => {
    const res = await apiClient.post(`/incidents/${id}/resolve`, { notes }, {
      mockData: { id, status: 'RESOLVED', resolved_at: new Date().toISOString() },
    });
    return res.data;
  },
};

export const incidentApi = incidentService;
export default incidentService;
