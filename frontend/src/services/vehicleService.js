import { apiClient } from './api';

export const vehicleService = {
  getVehicles: async (filters = {}) => {
    const res = await apiClient.get('/vehicles', filters);
    const data = res.data;
    if (data && Array.isArray(data.items)) {
      return data.items;
    }
    return Array.isArray(data) ? data : [];
  },

  getAvailableVehicles: async (type = null) => {
    const params = type ? { type } : {};
    const res = await apiClient.get('/vehicles/available', params);
    return Array.isArray(res.data) ? res.data : [];
  },

  getVehicleById: async (id) => {
    const res = await apiClient.get(`/vehicles/${id}`);
    return res.data;
  },

  updateVehicleLocation: async (id, locationData) => {
    const payload = {
      latitude: Number(locationData.latitude ?? locationData.lat ?? 20.2961),
      longitude: Number(locationData.longitude ?? locationData.lng ?? 85.8245),
      speed_kmh: Number(locationData.speed_kmh ?? locationData.speed ?? 0.0),
      heading_deg: Number(locationData.heading_deg ?? locationData.heading ?? 0.0),
      fuel_level_percent: Number(locationData.fuel_level_percent ?? 100),
    };
    const res = await apiClient.post(`/vehicles/${id}/location`, payload);
    return res.data;
  },
};

export const vehicleApi = vehicleService;
export default vehicleService;
