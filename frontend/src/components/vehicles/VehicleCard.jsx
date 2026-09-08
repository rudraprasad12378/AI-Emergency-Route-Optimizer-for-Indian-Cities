import React from 'react';
import { Truck, Gauge, BatteryCharging, Radio } from 'lucide-react';
import { Card } from '../ui/Card';
import { VehicleStatus } from './VehicleStatus';

export const VehicleCard = ({ vehicle, isSelected = false, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className={`
        cursor-pointer transition-all border-l-4
        ${vehicle.status === 'en_route' ? 'border-l-red-500' : vehicle.status === 'available' ? 'border-l-emerald-500' : 'border-l-slate-700'}
        ${isSelected ? 'border-primary-500 bg-slate-800/80 shadow-lg' : 'hover:bg-slate-900/80'}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-sm">
            {vehicle.type === 'ambulance' ? '🚑' : vehicle.type === 'fire_truck' ? '🚒' : '🚓'}
          </div>
          <div>
            <span className="font-mono text-xs font-bold text-white block">{vehicle.callSign}</span>
            <span className="text-[11px] text-slate-400 capitalize">{vehicle.type.replace('_', ' ')}</span>
          </div>
        </div>
        <VehicleStatus status={vehicle.status} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-2.5 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Gauge className="h-3.5 w-3.5 text-slate-500" />
          <span>Speed: <strong className="text-slate-200">{vehicle.speed} km/h</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <BatteryCharging className="h-3.5 w-3.5 text-slate-500" />
          <span>Fuel: <strong className="text-slate-200">{vehicle.fuel}%</strong></span>
        </div>
      </div>
    </Card>
  );
};

export default VehicleCard;
