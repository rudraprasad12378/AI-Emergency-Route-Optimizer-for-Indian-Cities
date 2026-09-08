import React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useMapStore } from '../../store/mapStore';
import { useVehicleTracking } from '../../hooks/useVehicleTracking';
import { useIncidents } from '../../hooks/useIncidents';
import { useRoute } from '../../hooks/useRoute';
import { useTraffic } from '../../hooks/useTraffic';
import { mockStations } from '../../mock/stations';

import { VehicleMarker } from './VehicleMarker';
import { IncidentMarker } from './IncidentMarker';
import { StationMarker } from './StationMarker';
import { RouteLayer } from './RouteLayer';
import { TrafficLayer } from './TrafficLayer';
import { MapControls } from './MapControls';
import { MapLegend } from './MapLegend';

// Controller to sync map center changes from store
const MapViewController = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

export const CityMap = ({
  height = '100%',
  onVehicleClick,
  onIncidentClick,
  onRouteChange,
  className = '',
}) => {
  const { center, zoom, layers } = useMapStore();
  const { vehicles } = useVehicleTracking();
  const { incidents } = useIncidents();
  const { routes, selectedRouteId, setSelectedRouteId } = useRoute();
  const { sensors, riskZones } = useTraffic();

  return (
    <div className={`relative w-full h-full min-h-[400px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl isolate z-0 ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: '#090d16' }}
        zoomControl={false}
      >
        <MapViewController center={center} zoom={zoom} />

        {/* Dark Tactical CartoDB Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Traffic & Risk Zone overlays */}
        {layers.trafficHeatmap && (
          <TrafficLayer sensors={sensors} riskZones={layers.riskZones ? riskZones : []} />
        )}

        {/* Multi Routes */}
        {layers.greenCorridors &&
          routes.map((r) => (
            <RouteLayer
              key={r.id}
              route={r}
              isSelected={r.id === selectedRouteId}
              onSelect={(route) => {
                setSelectedRouteId(route.id);
                if (onRouteChange) onRouteChange(route);
              }}
            />
          ))}

        {/* Stations & Hubs */}
        {layers.stations &&
          mockStations.map((station) => (
            <StationMarker key={station.id} station={station} />
          ))}

        {/* Traffic / Road Incidents */}
        {layers.incidents &&
          incidents.map((incident) => (
            <IncidentMarker
              key={incident.id}
              incident={incident}
              onSelect={onIncidentClick}
            />
          ))}

        {/* Fleet Vehicles */}
        {layers.emergencyVehicles &&
          vehicles.map((vehicle) => (
            <VehicleMarker
              key={vehicle.id}
              vehicle={vehicle}
              onSelect={onVehicleClick}
            />
          ))}
      </MapContainer>

      {/* Tactical Map Overlays */}
      <MapControls />
      <MapLegend />
    </div>
  );
};

export default CityMap;
