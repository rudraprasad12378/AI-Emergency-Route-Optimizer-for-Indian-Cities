import { mockPredictions } from '../mock/predictions';

export const predictionApi = {
  getPredictions: async () => {
    await new Promise((r) => setTimeout(r, 250));
    return mockPredictions;
  },
  getCorridorRisk: async (corridorId) => {
    await new Promise((r) => setTimeout(r, 150));
    return mockPredictions[0];
  },
};
