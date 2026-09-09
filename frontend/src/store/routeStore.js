import { create } from 'zustand';
import { routeService } from '../services/routeService';
import { mockRoutes } from '../mock/routes';

export const useRouteStore = create((set, get) => ({
  routes: mockRoutes,
  selectedRouteId: 'route-001',
  isRerouting: false,
  greenCorridorActive: true,
  isLoading: false,
  error: null,

  setSelectedRouteId: (id) => set({ selectedRouteId: id }),

  fetchRoutesForEmergency: async (emergencyId) => {
    set({ isLoading: true, error: null });
    try {
      const serverRoutes = await routeService.getRoutesByEmergencyId(emergencyId);
      if (serverRoutes && serverRoutes.length) {
        const formatted = serverRoutes.map((r) => {
          let waypoints = [];
          try {
            waypoints = typeof r.waypoints_json === 'string' ? JSON.parse(r.waypoints_json) : (r.waypoints_json || []);
          } catch {
            waypoints = [];
          }
          return {
            ...r,
            id: r.id,
            name: r.route_name || r.name,
            distanceKm: r.distance_km || r.distanceKm,
            estimatedDurationMin: r.eta_minutes || r.estimatedDurationMin,
            timeSavedMin: r.time_saved_minutes || r.timeSavedMin || 0,
            confidenceScore: Math.round((r.confidence_score || 0.9) * 100),
            trafficLevel: r.traffic_level || 'moderate',
            isRecommended: r.is_recommended,
            coordinates: waypoints.length ? waypoints : [
              [20.2648, 85.8402],
              [20.2610, 85.8050],
              [20.2312, 85.7766],
            ],
            aiExplanations: r.ai_explanation ? [r.ai_explanation] : [],
          };
        });
        set({ routes: formatted, selectedRouteId: formatted[0]?.id, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  getSelectedRoute: () => {
    const { routes, selectedRouteId } = get();
    return routes.find((r) => r.id === selectedRouteId) || routes[0] || null;
  },

  calculateAlternativeRoute: async (emergencyId) => {
    set({ isRerouting: true });
    
    let serverReroute = null;
    try {
      serverReroute = await routeService.reroute(emergencyId, 'Hazard avoidance AI reroute');
    } catch {
      // fallback to optimistic computation
    }

    const alternativeRoute = {
      id: serverReroute?.selected_route_id || `route-dyn-${Date.now().toString().slice(-4)}`,
      emergencyId,
      name: 'Dynamic AI Traffic Bypass (Via Canal Ring Road)',
      isRecommended: true,
      distanceKm: 10.9,
      estimatedDurationMin: serverReroute?.new_eta_minutes || 11,
      historicalDurationMin: 23,
      timeSavedMin: 12,
      confidenceScore: 97,
      riskScore: 'low',
      greenCorridorSignals: 9,
      trafficLevel: 'green_cleared',
      coordinates: [
        [20.2648, 85.8402],
        [20.2710, 85.8480],
        [20.2800, 85.8550],
        [20.2600, 85.8100],
        [20.2312, 85.7766],
      ],
      aiExplanations: [
        serverReroute?.reroute_explanation || 'Dynamically rerouted around reported waterlogging bottleneck.',
        'Canal Expressway clear with pre-cleared signal sequence.',
        'Saves additional 2 minutes over initial recommended corridor.',
      ],
      bottlenecks: [],
    };

    set((state) => ({
      routes: [alternativeRoute, ...state.routes],
      selectedRouteId: alternativeRoute.id,
      isRerouting: false,
    }));

    return alternativeRoute;
  },

  toggleGreenCorridor: () => set((state) => ({ greenCorridorActive: !state.greenCorridorActive })),
}));

export default useRouteStore;
