import { mockIncidents } from '../mock/incidents';

export const incidentApi = {
  getIncidents: async () => {
    await new Promise((r) => setTimeout(r, 250));
    return mockIncidents;
  },
  reportIncident: async (data) => {
    await new Promise((r) => setTimeout(r, 350));
    return {
      ...data,
      id: `inc-${Date.now().toString().slice(-4)}`,
      reportedAt: new Date().toISOString(),
      status: 'active',
    };
  },
  resolveIncident: async (id) => {
    await new Promise((r) => setTimeout(r, 200));
    return { id, status: 'resolved' };
  },
};
