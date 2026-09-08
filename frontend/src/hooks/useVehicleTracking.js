import { useEffect } from 'react';
import { useVehicleStore } from '../store/vehicleStore';

export const useVehicleTracking = () => {
  const store = useVehicleStore();

  // Simulated live telemetry movement for active vehicles
  useEffect(() => {
    if (!store.trackingEnabled) return;

    const interval = setInterval(() => {
      const activeVehicles = store.vehicles.filter((v) => v.status === 'en_route' || v.status === 'on_scene');
      if (activeVehicles.length > 0) {
        const randomVeh = activeVehicles[Math.floor(Math.random() * activeVehicles.length)];
        const deltaLat = (Math.random() - 0.5) * 0.0006;
        const deltaLng = (Math.random() - 0.5) * 0.0006;
        const newLat = randomVeh.position.lat + deltaLat;
        const newLng = randomVeh.position.lng + deltaLng;
        const speed = Math.floor(35 + Math.random() * 30);
        const heading = Math.floor(Math.random() * 360);

        store.updateVehicleLocation(randomVeh.id, { lat: newLat, lng: newLng }, speed, heading);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [store.trackingEnabled, store.vehicles]);

  const filteredVehicles = store.vehicles.filter((v) => {
    if (store.filterType !== 'all' && v.type !== store.filterType) return false;
    if (store.filterStatus !== 'all' && v.status !== store.filterStatus) return false;
    return true;
  });

  return {
    vehicles: filteredVehicles,
    allVehicles: store.vehicles,
    selectedVehicle: store.getSelectedVehicle(),
    selectedVehicleId: store.selectedVehicleId,
    setSelectedVehicleId: store.setSelectedVehicleId,
    filterType: store.filterType,
    setFilterType: store.setFilterType,
    filterStatus: store.filterStatus,
    setFilterStatus: store.setFilterStatus,
    trackingEnabled: store.trackingEnabled,
    setTrackingEnabled: store.setTrackingEnabled,
    updateVehicleStatus: store.updateVehicleStatus,
  };
};

export default useVehicleTracking;
