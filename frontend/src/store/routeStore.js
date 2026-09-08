import { create } from 'zustand';
import { mockRoutes } from '../mock/routes';

export const useRouteStore = create((set, get) => ({
  routes: mockRoutes,
  selectedRouteId: 'route-001',
  isRerouting: false,
  greenCorridorActive: true,

  setSelectedRouteId: (id) => set({ selectedRouteId: id }),

  getSelectedRoute: () => {
    const { routes, selectedRouteId } = get();
    return routes.find((r) => r.id === selectedRouteId) || routes[0] || null;
  },

  calculateAlternativeRoute: async (emergencyId) => {
    set({ isRerouting: true });
    await new Promise((resolve) => setTimeout(resolve, 800));

    const alternativeRoute = {
      id: `route-dyn-${Date.now().toString().slice(-4)}`,
      emergencyId,
      name: 'Dynamic AI Traffic Bypass (Via Canal Ring Road)',
      isRecommended: true,
      distanceKm: 10.9,
      estimatedDurationMin: 12,
      historicalDurationMin: 23,
      timeSavedMin: 11,
      confidenceScore: 96,
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
        'Dynamically rerouted around reported waterlogging bottleneck.',
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
