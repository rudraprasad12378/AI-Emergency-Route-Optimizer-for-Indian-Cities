import { useRouteStore } from '../store/routeStore';

export const useRoute = () => {
  const store = useRouteStore();
  const selectedRoute = store.getSelectedRoute();

  return {
    routes: store.routes,
    selectedRoute,
    selectedRouteId: store.selectedRouteId,
    setSelectedRouteId: store.setSelectedRouteId,
    isRerouting: store.isRerouting,
    greenCorridorActive: store.greenCorridorActive,
    calculateAlternativeRoute: store.calculateAlternativeRoute,
    toggleGreenCorridor: store.toggleGreenCorridor,
  };
};

export default useRoute;
