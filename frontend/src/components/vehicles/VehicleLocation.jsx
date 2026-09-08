import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export const VehicleLocation = ({ vehicle }) => {
  if (!vehicle || !vehicle.position) return null;

  return (
    <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
      <div className="flex items-center gap-2">
        <MapPin className="h-3.5 w-3.5 text-primary-400" />
        <span className="font-mono text-slate-300">
          {vehicle.position.lat.toFixed(4)}°N, {vehicle.position.lng.toFixed(4)}°E
        </span>
      </div>
      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
        <Navigation className="h-3 w-3" />
        <span>HDG {vehicle.heading || 0}°</span>
      </div>
    </div>
  );
};

export default VehicleLocation;
