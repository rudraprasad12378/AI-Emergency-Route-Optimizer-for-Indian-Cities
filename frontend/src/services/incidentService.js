import { apiClient } from './api';

export const incidentService = {
  getIncidents: async (filters = {}) => {
    const res = await apiClient.get('/incidents', filters);
    const data = res.data;
    if (data && Array.isArray(data.items)) {
      return data.items;
    }
    return Array.isArray(data) ? data : [];
  },

  getActiveIncidents: async () => {
    const res = await apiClient.get('/incidents/active');
    return Array.isArray(res.data) ? res.data : [];
  },

  getIncidentById: async (id) => {
    const res = await apiClient.get(`/incidents/${id}`);
    return res.data;
  },

  reportIncident: async (incidentData) => {
    const payload = {
      title: incidentData.title || 'Road Hazard',
      type: (incidentData.type || 'ROAD_BLOCKAGE').toUpperCase(),
      severity: (incidentData.severity || 'HIGH').toUpperCase(),
      latitude: Number(incidentData.latitude ?? incidentData.lat ?? 20.2961),
      longitude: Number(incidentData.longitude ?? incidentData.lng ?? 85.8245),
      address: incidentData.address || incidentData.locationName || 'Bhubaneswar Corridor',
      description: incidentData.description || 'Reported hazard',
      delay_minutes: Number(incidentData.delay_minutes || incidentData.delayMinutes || 5),
      radius_meters: Number(incidentData.radius_meters || 300),
    };
    const res = await apiClient.post('/incidents', payload);
    return res.data;
  },

  resolveIncident: async (id, notes = 'Cleared by traffic personnel') => {
    const res = await apiClient.post(`/incidents/${id}/resolve`, { notes });
    return res.data;
  },
};

export const incidentApi = incidentService;
export default incidentService;
