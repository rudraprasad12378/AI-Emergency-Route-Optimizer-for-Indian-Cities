import { apiClient } from './api';

export const emergencyService = {
  getEmergencies: async (filters = {}) => {
    const res = await apiClient.get('/emergencies', filters);
    const data = res.data;
    if (data && Array.isArray(data.items)) {
      return data.items;
    }
    return Array.isArray(data) ? data : [];
  },

  getEmergencyById: async (id) => {
    const res = await apiClient.get(`/emergencies/${id}`);
    return res.data;
  },

  createEmergency: async (data) => {
    const payload = {
      type: data.type ? data.type.toUpperCase() : 'MEDICAL',
      priority: data.priority ? data.priority.toUpperCase() : (data.severity ? data.severity.toUpperCase() : 'CRITICAL'),
      pickup_address: data.pickup_address || data.pickupLocation?.address || 'Master Canteen Square, Bhubaneswar',
      pickup_landmark: data.pickup_landmark || data.pickupLocation?.landmark || 'Near Railway Station',
      pickup_latitude: Number(data.pickup_latitude || data.pickupLocation?.coordinates?.lat || 20.2648),
      pickup_longitude: Number(data.pickup_longitude || data.pickupLocation?.coordinates?.lng || 85.8402),
      destination_name: data.destination_name || data.destinationHospital?.name || 'AIIMS Bhubaneswar',
      destination_address: data.destination_address || data.destinationHospital?.address || 'Sijua, Patrapada',
      destination_latitude: Number(data.destination_latitude || data.destinationHospital?.coordinates?.lat || 20.2312),
      destination_longitude: Number(data.destination_longitude || data.destinationHospital?.coordinates?.lng || 85.7766),
      description: data.description || 'Emergency SOS call',
      patient_count: Number(data.patient_count || 1),
      caller_name: data.caller_name || 'Citizen Caller',
      caller_phone: data.caller_phone || '+91 108',
      destination_hospital_id: data.destination_hospital_id || null,
    };

    const res = await apiClient.post('/emergencies', payload);
    return res.data;
  },

  triageEmergency: async (emergencyId, triageData) => {
    const payload = {
      priority: triageData.priority ? triageData.priority.toUpperCase() : 'CRITICAL',
      destination_hospital_id: triageData.destination_hospital_id || triageData.destinationHospitalId || null,
    };
    const res = await apiClient.post(`/emergencies/${emergencyId}/triage`, payload);
    return res.data;
  },

  assignVehicle: async (emergencyId, vehicleId) => {
    const res = await apiClient.post(`/emergencies/${emergencyId}/assign`, {
      vehicle_id: vehicleId,
    });
    return res.data;
  },

  acceptEmergency: async (emergencyId) => {
    const res = await apiClient.post(`/emergencies/${emergencyId}/accept`, {});
    return res.data;
  },

  startEmergency: async (emergencyId) => {
    const res = await apiClient.post(`/emergencies/${emergencyId}/start`, {});
    return res.data;
  },

  arriveAtScene: async (emergencyId) => {
    const res = await apiClient.post(`/emergencies/${emergencyId}/arrive`, {});
    return res.data;
  },

  completeEmergency: async (emergencyId) => {
    const res = await apiClient.post(`/emergencies/${emergencyId}/complete`, {});
    return res.data;
  },

  cancelEmergency: async (emergencyId, reason = 'Cancelled by dispatch') => {
    const res = await apiClient.post(`/emergencies/${emergencyId}/cancel?reason=${encodeURIComponent(reason)}`, {});
    return res.data;
  },

  toggleGreenCorridor: async (emergencyId, active = true) => {
    const res = await apiClient.post(`/emergencies/${emergencyId}/green-corridor?active=${active}`, {});
    return res.data;
  },
};

export const emergencyApi = emergencyService;
export default emergencyService;
