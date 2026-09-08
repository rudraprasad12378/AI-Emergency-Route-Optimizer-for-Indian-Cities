import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const createVehicleIcon = (type, status) => {
  const isEmergency = status === 'en_route' || status === 'on_scene';
  const bgColor = isEmergency ? '#ef4444' : '#3b82f6';
  const pulseClass = isEmergency ? 'animate-ping opacity-75' : '';

  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
        ${isEmergency ? `<div style="position: absolute; width: 28px; height: 28px; border-radius: 9999px; background-color: ${bgColor};" class="${pulseClass}"></div>` : ''}
        <div style="position: relative; width: 22px; height: 22px; border-radius: 9999px; background-color: ${bgColor}; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4);">
          <span style="font-size: 10px; font-weight: 800; color: white;">${type === 'ambulance' ? '🚑' : type === 'fire_truck' ? '🚒' : '🚓'}</span>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

export const VehicleMarker = ({ vehicle, onSelect }) => {
  if (!vehicle.position || !vehicle.position.lat || !vehicle.position.lng) return null;

  const icon = createVehicleIcon(vehicle.type, vehicle.status);

  return (
    <Marker
      position={[vehicle.position.lat, vehicle.position.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect && onSelect(vehicle),
      }}
    >
      <Popup className="tactical-popup">
        <div className="p-1 min-w-[160px] text-slate-900">
          <div className="font-extrabold text-sm border-b pb-1 flex items-center justify-between">
            <span>{vehicle.callSign}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 uppercase">{vehicle.status}</span>
          </div>
          <p className="text-xs text-slate-600 mt-1 capitalize font-medium">{vehicle.type.replace('_', ' ')}</p>
          <div className="text-[11px] mt-1 text-slate-700 flex justify-between">
            <span>Speed: <strong>{vehicle.speed} km/h</strong></span>
            <span>Fuel: <strong>{vehicle.fuel}%</strong></span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default VehicleMarker;
