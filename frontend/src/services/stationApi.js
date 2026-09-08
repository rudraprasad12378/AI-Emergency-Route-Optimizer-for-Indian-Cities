import { mockStations } from '../mock/stations';

export const stationApi = {
  getStations: async () => {
    await new Promise((r) => setTimeout(r, 200));
    return mockStations;
  },
  getStationById: async (id) => {
    await new Promise((r) => setTimeout(r, 150));
    return mockStations.find((s) => s.id === id) || mockStations[0];
  },
};
