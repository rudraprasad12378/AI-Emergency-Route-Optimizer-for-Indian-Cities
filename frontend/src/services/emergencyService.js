import { apiClient } from './api';
import { mockEmergencies } from '../mock/emergencies';

export const emergencyService = {
  getEmergencies: async (filters = {}) => {
    const res = await apiClient.get('/emergencies', filters, { mockData: { items: mockEmergencies, total: mockEmergencies.length } });
    const data = res.data;
    if (data && Array.isArray(data.items)) {
      return data.items;
    }
    return Array.isArray(data) ? data : mockEmergencies;
  },

  getEmergencyById: async (id) => {
    const fallback = mockEmergencies.find((e) => e.id === id) || mockEmergencies[0];
    const res = await apiClient.get(`/emergencies/${id}`, {}, { mockData: fallback });
    return res.data || fallback;
  },

  createEmergency: async (data) => {
    const payload = {
      type: data.type ? data.type.toUpperCase() : 'MEDICAL',
      priority: data.priority ? data.priority.toUpperCase() : (data.severity ? data.severity.toUpperCase() : 'CRITICAL'),
      pickup_address: data.pickup_address || data.pickupLocation?.address || 'Master Canteen Square, Bhubaneswar',
      pickup_landmark: data.pickup_landmark || data.pickupLocation?.landmark || 'Near Railway Station',
      pickup_latitude: data.pickup_latitude || data.pickupLocation?.coordinates?.lat || 20.2648,
      pickup_longitude: data.pickup_longitude || data.pickupLocation?.coordinates?.lng || 85.8402,
      destination_name: data.destination_name || data.destinationHospital?.name || 'AIIMS Bhubaneswar',
      destination_address: data.destination_address || data.destinationHospital?.address || 'Sijua, Patrapada',
      destination_latitude: data.destination_latitude || data.destinationHospital?.coordinates?.lat || 20.2312,
      destination_longitude: data.destination_longitude || data.destinationHospital?.coordinates?.lng || 85.7766,
      description: data.description || 'Emergency SOS call',
      patient_count: data.patient_count || 1,
      caller_name: data.caller_name || 'Citizen Caller',
      caller_phone: data.caller_phone || '+91 108',
    };

    const res = await apiClient.post('/emergencies', payload, {
      mockData: {
        ...payload,
        id: `emg-${Date.now().toString().slice(-4)}`,
        emergency_number: `EMG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'REQUESTED',
        created_at: new Date().toISOString(),
      },
    });
    return res.data;
  },

  triageEmergency: async (emergencyId, triageData) => {
    const payload = {
      priority: triageData.priority ? triageData.priority.toUpperCase() : 'CRITICAL',
      notes: triageData.notes || triageData.triageNotes || 'Triage completed',
    };
    const res = await apiClient.post(`/emergencies/${emergencyId}/triage`, payload, {
      mockData: { id: emergencyId, status: 'TRIAGED', ...payload },
    });
    return res.data;
  },

  assignVehicle: async (emergencyId, vehicleId, instructions = '') => {
    const res = await apiClient.post(`/emergencies/${emergencyId}/assign`, {
      vehicle_id: vehicleId,
      instructions,
    }, {
      mockData: { id: emergencyId, assigned_vehicle_id: vehicleId, status: 'ASSIGNED' },
    });
    return res.data;
  },

  acceptEmergency: async (emergencyId) => {
    const res = await apiClient.post(`/emergencies/${emergencyId}/accept`, {}, {
      mockData: { id: emergencyId, status: 'ACCEPTED' },
    });
    return res.data;
  },

  startEmergency: async (emergencyId) => {
    const res = await apiClient.post(`/emergencies/${emergencyId}/start`, {}, {
      mockData: { id: emergencyId, status: 'EN_ROUTE' },
    });
    return res.data;
  },

  arriveAtScene: async (emergencyId) => {
    const res = await apiClient.post(`/emergencies/${emergencyId}/arrive`, {}, {
      mockData: { id: emergencyId, status: 'ARRIVED' },
    });
    return res.data;
  },

  completeEmergency: async (emergencyId, handoverNotes = '') => {
    const res = await apiClient.post(`/emergencies/${emergencyId}/complete`, {
      handover_notes: handoverNotes,
    }, {
      mockData: { id: emergencyId, status: 'COMPLETED' },
    });
    return res.data;
  },

  cancelEmergency: async (emergencyId, reason = 'Cancelled by dispatch') => {
    const res = await apiClient.post(`/emergencies/${emergencyId}/cancel`, {
      reason,
    }, {
      mockData: { id: emergencyId, status: 'CANCELLED' },
    });
    return res.data;
  },

  toggleGreenCorridor: async (emergencyId, active) => {
    const res = await apiClient.post(`/emergencies/${emergencyId}/green-corridor`, { active }, {
      mockData: { id: emergencyId, green_corridor_active: active },
    });
    return res.data;
  },
};

export const emergencyApi = emergencyService;
export default emergencyService;
