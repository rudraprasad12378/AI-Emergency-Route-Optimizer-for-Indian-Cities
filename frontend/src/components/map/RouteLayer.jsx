import React from 'react';
import { Polyline, Tooltip } from 'react-leaflet';

export const RouteLayer = ({ route, isSelected = false, onSelect }) => {
  if (!route || !route.coordinates || route.coordinates.length === 0) return null;

  const color = route.isRecommended ? '#10b981' : '#f59e0b';
  const weight = isSelected ? 6 : 4;
  const dashArray = route.isRecommended ? null : '6, 8';

  return (
    <Polyline
      positions={route.coordinates}
      pathOptions={{
        color,
        weight,
        opacity: isSelected ? 0.95 : 0.7,
        dashArray,
        lineCap: 'round',
        lineJoin: 'round',
      }}
      eventHandlers={{
        click: () => onSelect && onSelect(route),
      }}
    >
      <Tooltip sticky>
        <div className="text-xs font-sans">
          <p className="font-bold">{route.name}</p>
          <p className="text-[11px] text-slate-600">
            {route.distanceKm} km · {route.estimatedDurationMin} mins (Saves {route.timeSavedMin}m)
          </p>
        </div>
      </Tooltip>
    </Polyline>
  );
};

export default RouteLayer;
