import React from 'react';
import { Truck, Gauge, BatteryCharging, User, Phone, MapPin, Radio } from 'lucide-react';
import { Card } from '../ui/Card';
import { VehicleStatus } from './VehicleStatus';

export const VehicleDetails = ({ vehicle }) => {
  if (!vehicle) return null;

  return (
    <Card className="border-slate-800 bg-slate-900/90 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-lg">
            {vehicle.type === 'ambulance' ? '🚑' : vehicle.type === 'fire_truck' ? '🚒' : '🚓'}
          </div>
          <div>
            <h3 className="font-black text-white text-base">{vehicle.callSign}</h3>
            <p className="text-xs text-slate-400 capitalize">{vehicle.type.replace('_', ' ')} · Base Unit</p>
          </div>
        </div>
        <VehicleStatus status={vehicle.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Crew Telemetry</p>
          <div className="flex items-center gap-2 text-slate-300">
            <User className="h-3.5 w-3.5 text-slate-500" />
            <span>Driver: {vehicle.driverName || 'Officer S. Patnaik'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="h-3.5 w-3.5 text-slate-500" />
            <span className="font-mono">{vehicle.contactNumber || '+91 94370 11223'}</span>
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Live Diagnostics</p>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Current Speed:</span>
            <span className="font-mono font-bold text-white">{vehicle.speed} km/h</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Fuel Reserves:</span>
            <span className="font-mono font-bold text-emerald-400">{vehicle.fuel}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VehicleDetails;
