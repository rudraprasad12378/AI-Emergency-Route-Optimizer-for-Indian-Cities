import { apiClient } from './api';

export const hospitalService = {
  getHospitals: async () => {
    const res = await apiClient.get('/hospitals');
    return Array.isArray(res.data) ? res.data : [];
  },

  getIncomingEmergencies: async (hospitalId = null) => {
    const params = hospitalId ? { hospital_id: hospitalId } : {};
    const res = await apiClient.get('/hospitals/incoming', params);
    return Array.isArray(res.data) ? res.data : [];
  },
};

export default hospitalService;
