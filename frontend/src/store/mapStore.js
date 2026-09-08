import { create } from 'zustand';

export const useMapStore = create((set) => ({
  center: [20.2961, 85.8245], // Bhubaneswar City Center
  zoom: 13,
  selectedLayer: 'all', // all, traffic, incidents, riskZones, greenCorridors
  layers: {
    trafficHeatmap: true,
    riskZones: true,
    greenCorridors: true,
    emergencyVehicles: true,
    incidents: true,
    stations: true,
    hospitals: true,
  },
  mapTheme: 'dark', // dark, tactical, standard

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setMapTheme: (theme) => set({ mapTheme: theme }),
  toggleLayer: (layerName) =>
    set((state) => ({
      layers: {
        ...state.layers,
        [layerName]: !state.layers[layerName],
      },
    })),
  setAllLayers: (status) =>
    set((state) => ({
      layers: Object.keys(state.layers).reduce((acc, key) => {
        acc[key] = status;
        return acc;
      }, {}),
    })),
}));
