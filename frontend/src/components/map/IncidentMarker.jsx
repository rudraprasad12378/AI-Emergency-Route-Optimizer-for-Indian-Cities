import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const createIncidentIcon = (severity) => {
  const color = severity === 'critical' ? '#dc2626' : severity === 'high' ? '#ea580c' : '#eab308';

  return L.divIcon({
    className: 'custom-incident-marker',
    html: `
      <div style="width: 24px; height: 24px; border-radius: 6px; background: ${color}; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4); transform: rotate(45deg);">
        <span style="transform: rotate(-45deg); font-size: 11px; font-weight: bold; color: white;">⚠️</span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export const IncidentMarker = ({ incident, onSelect }) => {
  if (!incident.location?.coordinates?.lat || !incident.location?.coordinates?.lng) return null;

  const icon = createIncidentIcon(incident.severity);

  return (
    <Marker
      position={[incident.location.coordinates.lat, incident.location.coordinates.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect && onSelect(incident),
      }}
    >
      <Popup className="tactical-popup">
        <div className="p-1 min-w-[180px] text-slate-900">
          <div className="font-extrabold text-xs text-red-600 uppercase tracking-wide">
            {incident.type.replace('_', ' ')}
          </div>
          <p className="text-xs font-bold text-slate-900 mt-0.5">{incident.title}</p>
          <p className="text-[11px] text-slate-600 mt-1">{incident.location.address}</p>
          <div className="text-[10px] bg-red-50 text-red-700 font-semibold p-1 rounded mt-1.5 border border-red-200">
            Avg Delay: +{incident.averageDelayMinutes} mins
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default IncidentMarker;
