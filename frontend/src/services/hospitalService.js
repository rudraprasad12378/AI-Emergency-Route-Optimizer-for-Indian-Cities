import { apiClient } from './api';
import { mockHospitals } from '../mock/hospitals';
import { mockEmergencies } from '../mock/emergencies';

export const hospitalService = {
  getHospitals: async () => {
    const res = await apiClient.get('/hospitals', {}, { mockData: mockHospitals });
    return Array.isArray(res.data) ? res.data : mockHospitals;
  },

  getIncomingEmergencies: async (hospitalId = null) => {
    const params = hospitalId ? { hospital_id: hospitalId } : {};
    const res = await apiClient.get('/hospitals/incoming', params, {
      mockData: mockEmergencies.filter((e) => e.status !== 'COMPLETED' && e.status !== 'CANCELLED'),
    });
    return Array.isArray(res.data) ? res.data : mockEmergencies;
  },
};

export default hospitalService;
