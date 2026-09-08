import { useEmergencyStore } from '../store/emergencyStore';

export const useEmergency = () => {
  const store = useEmergencyStore();

  const filteredEmergencies = store.emergencies.filter((e) => {
    if (store.filterStatus !== 'all' && e.status !== store.filterStatus) return false;
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
    updateEmergencyStatus: store.updateEmergencyStatus,
    toggleGreenCorridor: store.toggleGreenCorridor,
    isLoading: store.isLoading,
  };
};

export default useEmergency;
