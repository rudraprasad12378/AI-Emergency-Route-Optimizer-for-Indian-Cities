import { create } from 'zustand';
import { emergencyService } from '../services/emergencyService';
import { mockEmergencies } from '../mock/emergencies';
import { useVehicleStore } from './vehicleStore';
import { useNotificationStore } from './notificationStore';

// Default waypoint corridor from Master Canteen -> AIIMS
const DEFAULT_ROUTE_WAYPOINTS = [
  [20.2648, 85.8402], // Master Canteen
  [20.2685, 85.8350], // Rajmahal
  [20.2721, 85.8280], // Sishu Bhawan
  [20.2610, 85.8050], // Siripur
  [20.2520, 85.7890], // Khandagiri
  [20.2312, 85.7766], // AIIMS Trauma Center
];

function interpolatePoint(p1, p2, ratio) {
  return {
    lat: p1[0] + (p2[0] - p1[0]) * ratio,
    lng: p1[1] + (p2[1] - p1[1]) * ratio,
  };
}

let simulationTimer = null;

export const useEmergencyStore = create((set, get) => ({
  emergencies: mockEmergencies.map((e) => ({
    ...e,
    status: e.status === 'in_progress' ? 'EN_ROUTE' : e.status === 'dispatched' ? 'ASSIGNED' : (e.status || 'REQUESTED').toUpperCase(),
    simulationProgress: e.status === 'in_progress' ? 30 : 0,
    distanceRemainingKm: e.destinationHospital?.distanceKm || e.distance_remaining_km || 11.2,
    routeWaypoints: DEFAULT_ROUTE_WAYPOINTS,
  })),
  activeEmergencyId: 'emg-001',
  filterStatus: 'all',
  filterSeverity: 'all',
  isLoading: false,
  error: null,

  fetchEmergencies: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await emergencyService.getEmergencies();
      if (items && items.length) {
        const formatted = items.map((e) => ({
          ...e,
          id: e.id,
          emergencyNumber: e.emergency_number || e.emergencyNumber || e.id,
          status: (e.status || 'REQUESTED').toUpperCase(),
          severity: (e.priority || e.severity || 'critical').toLowerCase(),
          type: (e.type || 'medical').toLowerCase(),
          createdAt: e.created_at || e.createdAt || new Date().toISOString(),
          etaMinutes: e.eta_minutes || e.etaMinutes || 14,
          distanceRemainingKm: e.distance_remaining_km || e.distanceRemainingKm || 8.2,
          simulationProgress: e.simulation_progress || 0,
          routeWaypoints: DEFAULT_ROUTE_WAYPOINTS,
          pickupLocation: {
            address: e.pickup_address || e.pickupLocation?.address || 'Saheed Nagar, Bhubaneswar',
            landmark: e.pickup_landmark || 'Near Main Gate',
            coordinates: {
              lat: e.pickup_latitude || e.pickupLocation?.coordinates?.lat || 20.2961,
              lng: e.pickup_longitude || e.pickupLocation?.coordinates?.lng || 85.8245,
            },
          },
          destinationHospital: {
            name: e.destination_name || 'AIIMS Bhubaneswar',
            address: e.destination_address || 'Sijua, Patrapada',
            coordinates: {
              lat: e.destination_latitude || 20.2285,
              lng: e.destination_longitude || 85.7765,
            },
            distanceKm: e.distance_remaining_km || 8.2,
            estimatedTimeMin: e.eta_minutes || 14,
          },
        }));
        set({ emergencies: formatted, isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false });
    }
  },

  setActiveEmergencyId: (id) => set({ activeEmergencyId: id }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterSeverity: (severity) => set({ filterSeverity: severity }),

  getActiveEmergency: () => {
    const { emergencies, activeEmergencyId } = get();
    return emergencies.find((e) => e.id === activeEmergencyId) || emergencies[0] || null;
  },

  // 1. Citizen Creates Emergency -> Status: REQUESTED
  createEmergency: async (newEmergency) => {
    const emergencyId = `emg-${Date.now().toString().slice(-4)}`;
    const emergencyNumber = `EMG-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const entry = {
      ...newEmergency,
      id: emergencyId,
      emergencyNumber,
      status: 'REQUESTED',
      severity: newEmergency.severity || 'critical',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      etaMinutes: 14,
      distanceRemainingKm: 11.4,
      simulationProgress: 0,
      assignedVehicleId: null,
      assignedVehicleCallSign: null,
      greenCorridorActive: true,
      routeWaypoints: DEFAULT_ROUTE_WAYPOINTS,
      pickupLocation: newEmergency.pickupLocation || {
        address: 'Master Canteen Square, Bhubaneswar',
        landmark: 'Near Railway Station Exit Gate 1',
        coordinates: { lat: 20.2648, lng: 85.8402 },
      },
      destinationHospital: newEmergency.destinationHospital || {
        id: 'hosp-001',
        name: 'AIIMS Bhubaneswar',
        address: 'Sijua, Patrapada, Bhubaneswar',
        coordinates: { lat: 20.2312, lng: 85.7766 },
        distanceKm: 11.2,
        estimatedTimeMin: 14,
      },
    };

    set((state) => ({
      emergencies: [entry, ...state.emergencies],
      activeEmergencyId: emergencyId,
    }));

    // Trigger API call in background
    try {
      await emergencyService.createEmergency(entry);
    } catch (e) {
      // Optimistic state preserved
    }

    const { addNotification } = useNotificationStore.getState();
    addNotification({
      type: 'critical',
      title: '🚨 New Emergency Request Received',
      message: `${entry.emergencyNumber} · ${entry.type?.replace('_', ' ')?.toUpperCase()} reported at ${entry.pickupLocation?.address}. Awaiting Dispatcher triage.`,
      link: `/emergencies/${entry.id}`,
    });

    return entry;
  },

  // 2. Dispatcher Triages Emergency -> Status: TRIAGED
  triageEmergency: async (emergencyId, triageNotes) => {
    set((state) => ({
      emergencies: state.emergencies.map((e) =>
        e.id === emergencyId ? { ...e, status: 'TRIAGED', triageNotes, updatedAt: new Date().toISOString() } : e
      ),
    }));

    try {
      await emergencyService.triageEmergency(emergencyId, { priority: 'CRITICAL', notes: triageNotes });
    } catch (e) {}

    const { addNotification } = useNotificationStore.getState();
    addNotification({
      type: 'info',
      title: 'Emergency Triaged',
      message: `Emergency ${emergencyId} triaged by Control Center. Ready for vehicle assignment.`,
    });
  },

  // 3. Dispatcher Assigns Vehicle -> Status: ASSIGNED
  assignVehicle: async (emergencyId, vehicleId, vehicleCallSign = 'AMB-101') => {
    set((state) => ({
      emergencies: state.emergencies.map((e) =>
        e.id === emergencyId
          ? {
              ...e,
              status: 'ASSIGNED',
              assignedVehicleId: vehicleId,
              assignedVehicleCallSign: vehicleCallSign,
              updatedAt: new Date().toISOString(),
            }
          : e
      ),
    }));

    try {
      await emergencyService.assignVehicle(emergencyId, vehicleId);
    } catch (e) {}

    const { updateVehicleStatus } = useVehicleStore.getState();
    updateVehicleStatus(vehicleId, 'en_route');

    const { addNotification } = useNotificationStore.getState();
    addNotification({
      type: 'warning',
      title: `Mission Assigned to ${vehicleCallSign}`,
      message: `Unit ${vehicleCallSign} assigned to mission ${emergencyId}. Awaiting Driver confirmation.`,
      link: '/driver',
    });
  },

  // 4. Driver Accepts Mission -> Status: ACCEPTED
  acceptMission: async (emergencyId) => {
    set((state) => ({
      emergencies: state.emergencies.map((e) =>
        e.id === emergencyId ? { ...e, status: 'ACCEPTED', updatedAt: new Date().toISOString() } : e
      ),
    }));

    try {
      await emergencyService.acceptEmergency(emergencyId);
    } catch (e) {}

    const { addNotification } = useNotificationStore.getState();
    addNotification({
      type: 'success',
      title: 'Mission Accepted by Driver',
      message: `Paramedic driver acknowledged mission ${emergencyId}. Ready to start journey.`,
      link: '/driver',
    });
  },

  // 5. Driver Starts Journey -> Status: EN_ROUTE
  startJourney: async (emergencyId) => {
    const state = get();
    const emg = state.emergencies.find((e) => e.id === emergencyId) || state.emergencies[0];
    if (!emg) return;

    set((s) => ({
      emergencies: s.emergencies.map((e) =>
        e.id === emergencyId
          ? {
              ...e,
              status: 'EN_ROUTE',
              etaMinutes: 14,
              distanceRemainingKm: e.destinationHospital?.distanceKm || 11.2,
              simulationProgress: 0,
              updatedAt: new Date().toISOString(),
            }
          : e
      ),
    }));

    try {
      await emergencyService.startEmergency(emergencyId);
    } catch (e) {}

    if (emg.assignedVehicleId) {
      const { updateVehicleStatus } = useVehicleStore.getState();
      updateVehicleStatus(emg.assignedVehicleId, 'en_route');
    }

    const { addNotification } = useNotificationStore.getState();
    addNotification({
      type: 'critical',
      title: `🚑 ${emg.assignedVehicleCallSign || 'AMB-101'} En Route to Destination`,
      message: `Emergency ${emg.emergencyNumber} transit started. Green corridor signals synchronized. ETA 14 min.`,
      link: '/hospital',
    });

    state.startSimulation(emergencyId);
  },

  startSimulation: (emergencyId) => {
    if (simulationTimer) clearInterval(simulationTimer);

    const waypoints = DEFAULT_ROUTE_WAYPOINTS;
    const totalSegments = waypoints.length - 1;
    let progress = 0;

    simulationTimer = setInterval(() => {
      const currentEmg = get().emergencies.find((e) => e.id === emergencyId);
      if (!currentEmg || currentEmg.status === 'COMPLETED' || currentEmg.status === 'CANCELLED') {
        clearInterval(simulationTimer);
        simulationTimer = null;
        return;
      }

      progress += 5;
      if (progress > 100) progress = 100;

      const floatIndex = (progress / 100) * totalSegments;
      const segmentIndex = Math.min(Math.floor(floatIndex), totalSegments - 1);
      const segmentRatio = floatIndex - segmentIndex;

      const p1 = waypoints[segmentIndex];
      const p2 = waypoints[segmentIndex + 1] || waypoints[waypoints.length - 1];
      const currentCoords = interpolatePoint(p1, p2, segmentRatio);

      const initialDist = currentEmg.destinationHospital?.distanceKm || 11.2;
      const remainingDist = Math.max(0, +(initialDist * (1 - progress / 100)).toFixed(1));
      const remainingEta = Math.max(0, Math.ceil(14 * (1 - progress / 100)));

      let nextStatus = currentEmg.status;
      if (progress >= 100) {
        nextStatus = 'ARRIVED';
      } else if (progress >= 75 && (currentEmg.status === 'EN_ROUTE' || currentEmg.status === 'REROUTING')) {
        nextStatus = 'ARRIVING';
      }

      set((s) => ({
        emergencies: s.emergencies.map((e) =>
          e.id === emergencyId
            ? {
                ...e,
                status: nextStatus,
                simulationProgress: progress,
                distanceRemainingKm: remainingDist,
                etaMinutes: remainingEta,
                currentPosition: currentCoords,
                updatedAt: new Date().toISOString(),
              }
            : e
        ),
      }));

      const vehicleId = currentEmg.assignedVehicleId || 'veh-001';
      const { updateVehicleLocation } = useVehicleStore.getState();
      updateVehicleLocation(vehicleId, currentCoords, progress >= 100 ? 0 : 54, 180);

      const { addNotification } = useNotificationStore.getState();
      if (nextStatus === 'ARRIVING' && currentEmg.status === 'EN_ROUTE') {
        addNotification({
          type: 'warning',
          title: `🚑 ${currentEmg.assignedVehicleCallSign || 'AMB-101'} Arriving Soon`,
          message: `Inbound unit is 2 minutes from AIIMS Trauma Bay. Prepare reception deck.`,
          link: '/hospital',
        });
      } else if (nextStatus === 'ARRIVED' && currentEmg.status !== 'ARRIVED') {
        addNotification({
          type: 'success',
          title: `✅ ${currentEmg.assignedVehicleCallSign || 'AMB-101'} Arrived at Destination`,
          message: `Unit has docked at Trauma Bay. Handover in progress.`,
          link: '/hospital',
        });
        clearInterval(simulationTimer);
        simulationTimer = null;
      }
    }, 2000);
  },

  stopSimulation: () => {
    if (simulationTimer) {
      clearInterval(simulationTimer);
      simulationTimer = null;
    }
  },

  triggerReroute: async (emergencyId) => {
    set((state) => ({
      emergencies: state.emergencies.map((e) =>
        e.id === emergencyId ? { ...e, status: 'REROUTING', updatedAt: new Date().toISOString() } : e
      ),
    }));

    try {
      await emergencyService.toggleGreenCorridor(emergencyId, true);
    } catch (e) {}

    const { addNotification } = useNotificationStore.getState();
    addNotification({
      type: 'info',
      title: 'AI Traffic Reroute Computed',
      message: 'Bypassing Nayapalli waterlogging via Siripur flyover corridor. 2 min saved.',
      link: '/routes',
    });

    setTimeout(() => {
      set((state) => ({
        emergencies: state.emergencies.map((e) =>
          e.id === emergencyId ? { ...e, status: 'EN_ROUTE', etaMinutes: Math.max(1, e.etaMinutes - 2), updatedAt: new Date().toISOString() } : e
        ),
      }));
    }, 1500);
  },

  completeEmergency: async (emergencyId) => {
    if (simulationTimer) {
      clearInterval(simulationTimer);
      simulationTimer = null;
    }

    const state = get();
    const emg = state.emergencies.find((e) => e.id === emergencyId) || state.emergencies[0];

    set((s) => ({
      emergencies: s.emergencies.map((e) =>
        e.id === emergencyId
          ? {
              ...e,
              status: 'COMPLETED',
              simulationProgress: 100,
              etaMinutes: 0,
              distanceRemainingKm: 0,
              updatedAt: new Date().toISOString(),
            }
          : e
      ),
    }));

    try {
      await emergencyService.completeEmergency(emergencyId, 'Handover complete');
    } catch (e) {}

    if (emg && emg.assignedVehicleId) {
      const { updateVehicleStatus } = useVehicleStore.getState();
      updateVehicleStatus(emg.assignedVehicleId, 'available');
    }

    const { addNotification } = useNotificationStore.getState();
    addNotification({
      type: 'success',
      title: '✅ Emergency Mission Successfully Completed',
      message: `Emergency ${emg?.emergencyNumber || emergencyId} patient handed over to hospital. Vehicle reset to Available.`,
      link: '/control-center',
    });
  },

  updateEmergencyStatus: (id, status) => {
    set((state) => ({
      emergencies: state.emergencies.map((e) =>
        e.id === id ? { ...e, status: status.toUpperCase(), updatedAt: new Date().toISOString() } : e
      ),
    }));
  },

  toggleGreenCorridor: (id) => {
    set((state) => ({
      emergencies: state.emergencies.map((e) =>
        e.id === id ? { ...e, greenCorridorActive: !e.greenCorridorActive, updatedAt: new Date().toISOString() } : e
      ),
    }));
  },
}));

export default useEmergencyStore;
