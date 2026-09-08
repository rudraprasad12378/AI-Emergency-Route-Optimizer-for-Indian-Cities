import { apiClient } from './api';
import { mockVehicles } from '../mock/vehicles';

export const vehicleService = {
  getVehicles: async (filters = {}) => {
    const res = await apiClient.get('/vehicles', filters, {
      mockData: { items: mockVehicles, total: mockVehicles.length },
    });
    const data = res.data;
    if (data && Array.isArray(data.items)) {
      return data.items;
    }
    return Array.isArray(data) ? data : mockVehicles;
  },

  getAvailableVehicles: async (type = null) => {
    const params = type ? { type } : {};
    const res = await apiClient.get('/vehicles/available', params, {
      mockData: mockVehicles.filter((v) => v.status === 'AVAILABLE' || v.status === 'available'),
    });
    return Array.isArray(res.data) ? res.data : mockVehicles;
  },

  getVehicleById: async (id) => {
    const fallback = mockVehicles.find((v) => v.id === id) || mockVehicles[0];
    const res = await apiClient.get(`/vehicles/${id}`, {}, { mockData: fallback });
    return res.data || fallback;
  },

  updateVehicleLocation: async (id, locationData) => {
    const payload = {
      latitude: locationData.latitude ?? locationData.lat ?? 20.2961,
      longitude: locationData.longitude ?? locationData.lng ?? 85.8245,
      speed_kmh: locationData.speed_kmh ?? locationData.speed ?? 0.0,
      heading_deg: locationData.heading_deg ?? locationData.heading ?? 0.0,
      fuel_level_percent: locationData.fuel_level_percent ?? 100,
    };
    const res = await apiClient.post(`/vehicles/${id}/location`, payload, {
      mockData: { id, ...payload, updatedAt: new Date().toISOString() },
    });
    return res.data;
  },
};

export const vehicleApi = vehicleService;
export default vehicleService;
