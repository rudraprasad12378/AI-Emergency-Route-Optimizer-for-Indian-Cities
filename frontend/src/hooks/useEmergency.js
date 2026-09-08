import { useEmergencyStore } from '../store/emergencyStore';

export const useEmergency = () => {
  const store = useEmergencyStore();

  const filteredEmergencies = store.emergencies.filter((e) => {
    if (store.filterStatus !== 'all' && e.status.toUpperCase() !== store.filterStatus.toUpperCase()) return false;
    if (store.filterSeverity !== 'all' && e.severity !== store.filterSeverity) return false;
    return true;
  });

  const activeEmergency = store.getActiveEmergency();

  return {
    emergencies: filteredEmergencies,
    allEmergencies: store.emergencies,
    activeEmergency,
    activeEmergencyId: store.activeEmergencyId,
    setActiveEmergencyId: store.setActiveEmergencyId,
    filterStatus: store.filterStatus,
    setFilterStatus: store.setFilterStatus,
    filterSeverity: store.filterSeverity,
    setFilterSeverity: store.setFilterSeverity,
    createEmergency: store.createEmergency,
    triageEmergency: store.triageEmergency,
    assignVehicle: store.assignVehicle,
    acceptMission: store.acceptMission,
    startJourney: store.startJourney,
    triggerReroute: store.triggerReroute,
    completeEmergency: store.completeEmergency,
    startSimulation: store.startSimulation,
    stopSimulation: store.stopSimulation,
    updateEmergencyStatus: store.updateEmergencyStatus,
    toggleGreenCorridor: store.toggleGreenCorridor,
    isLoading: store.isLoading,
  };
};

export default useEmergency;
