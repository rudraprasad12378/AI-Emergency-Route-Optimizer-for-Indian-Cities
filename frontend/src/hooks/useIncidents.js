import { useIncidentStore } from '../store/incidentStore';

export const useIncidents = () => {
  const store = useIncidentStore();

  const filteredIncidents = store.incidents.filter((inc) => {
    if (store.filterType !== 'all' && inc.type !== store.filterType) return false;
    if (store.filterSeverity !== 'all' && inc.severity !== store.filterSeverity) return false;
    return true;
  });

  const selectedIncident = store.incidents.find((i) => i.id === store.selectedIncidentId) || null;

  return {
    incidents: filteredIncidents,
    allIncidents: store.incidents,
    selectedIncident,
    selectedIncidentId: store.selectedIncidentId,
    setSelectedIncidentId: store.setSelectedIncidentId,
    filterType: store.filterType,
    setFilterType: store.setFilterType,
    filterSeverity: store.filterSeverity,
    setFilterSeverity: store.setFilterSeverity,
    reportIncident: store.reportIncident,
    resolveIncident: store.resolveIncident,
  };
};

export default useIncidents;
