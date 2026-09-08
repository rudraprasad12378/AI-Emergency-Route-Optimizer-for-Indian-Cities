import { apiClient } from './api';
import { mockRoutes } from '../mock/routes';

export const routeService = {
  getRoutesByEmergencyId: async (emergencyId) => {
    const res = await apiClient.get(`/routes/emergency/${emergencyId}`, {}, {
      mockData: mockRoutes,
    });
    return Array.isArray(res.data) ? res.data : mockRoutes;
  },

  calculateRoutes: async (calcData) => {
    const payload = {
      emergency_id: calcData.emergency_id || calcData.emergencyId,
      pickup_lat: calcData.pickup_lat ?? calcData.pickupLat ?? 20.2961,
      pickup_lng: calcData.pickup_lng ?? calcData.pickupLng ?? 85.8245,
      dest_lat: calcData.dest_lat ?? calcData.destLat ?? 20.2312,
      dest_lng: calcData.dest_lng ?? calcData.destLng ?? 85.7766,
      priority: (calcData.priority || 'CRITICAL').toUpperCase(),
      avoid_incidents: calcData.avoid_incidents ?? true,
    };
    const res = await apiClient.post('/routes/calculate', payload, {
      mockData: { routes: mockRoutes, ai_recommendation: { recommended_route_id: mockRoutes[0].id } },
    });
    return res.data;
  },

  reroute: async (emergencyId, reason = 'Dynamic AI congestion avoidance') => {
    const payload = {
      emergency_id: emergencyId,
      reason,
    };
    const res = await apiClient.post('/routes/reroute', payload, {
      mockData: { status: 'REROUTED', emergency_id: emergencyId, routes: mockRoutes },
    });
    return res.data;
  },

  calculateAlternativeRoute: async (emergencyId) => {
    return routeService.reroute(emergencyId, 'Hazard avoidance reroute');
  },
};

export const routeApi = routeService;
export default routeService;
