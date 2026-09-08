import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const createStationIcon = (type) => {
  return L.divIcon({
    className: 'custom-station-marker',
    html: `
      <div style="width: 26px; height: 26px; border-radius: 9999px; background: #0284c7; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4);">
        <span style="font-size: 11px;">🏥</span>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

export const StationMarker = ({ station, onSelect }) => {
  if (!station.coordinates?.lat || !station.coordinates?.lng) return null;

  const icon = createStationIcon(station.type);

  return (
    <Marker
      position={[station.coordinates.lat, station.coordinates.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect && onSelect(station),
      }}
    >
      <Popup className="tactical-popup">
        <div className="p-1 min-w-[170px] text-slate-900">
          <p className="font-extrabold text-xs text-sky-700">{station.name}</p>
          <p className="text-[11px] text-slate-600 mt-0.5">{station.address}</p>
          <div className="text-[10px] mt-2 flex justify-between bg-slate-100 p-1 rounded font-medium">
            <span>Ambulances: <strong>{station.availableAmbulances}/{station.totalAmbulances}</strong></span>
            <span>Fire: <strong>{station.availableFireTenders}/{station.totalFireTenders}</strong></span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default StationMarker;
