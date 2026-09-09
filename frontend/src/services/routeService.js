import { apiClient } from './api';

export const routeService = {
  getRoutesByEmergencyId: async (emergencyId) => {
    const res = await apiClient.get(`/routes/emergency/${emergencyId}`);
    return Array.isArray(res.data) ? res.data : [];
  },

  getRouteEvents: async (emergencyId) => {
    const res = await apiClient.get(`/routes/emergency/${emergencyId}/events`);
    return Array.isArray(res.data) ? res.data : [];
  },

  calculateRoutes: async (calcData) => {
    const payload = {
      emergency_id: calcData.emergency_id || calcData.emergencyId,
      pickup_lat: Number(calcData.pickup_lat ?? calcData.pickupLat ?? 20.2961),
      pickup_lng: Number(calcData.pickup_lng ?? calcData.pickupLng ?? 85.8245),
      dest_lat: Number(calcData.dest_lat ?? calcData.destLat ?? 20.2312),
      dest_lng: Number(calcData.dest_lng ?? calcData.destLng ?? 85.7766),
      priority: (calcData.priority || 'CRITICAL').toUpperCase(),
      avoid_incidents: calcData.avoid_incidents ?? true,
    };
    const res = await apiClient.post('/routes/calculate', payload);
    return res.data;
  },

  reroute: async (emergencyId, reason = 'Dynamic AI congestion avoidance') => {
    const payload = {
      emergency_id: emergencyId,
      reason,
    };
    const res = await apiClient.post('/routes/reroute', payload);
    return res.data;
  },

  calculateAlternativeRoute: async (emergencyId) => {
    return routeService.reroute(emergencyId, 'Hazard avoidance reroute');
  },
};

export const routeApi = routeService;
export default routeService;
