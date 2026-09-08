import React from 'react';
import { Clock, MapPin, Hospital, Truck, Zap } from 'lucide-react';
import { Card } from '../ui/Card';
import { EmergencyPriorityBadge } from './EmergencyPriorityBadge';
import { EmergencyStatus } from './EmergencyStatus';

export const EmergencyCard = ({
  emergency,
  isSelected = false,
  onClick,
  className = '',
}) => {
  return (
    <Card
      onClick={onClick}
      className={`
        cursor-pointer transition-all duration-200 border-l-4
        ${emergency.severity === 'critical' ? 'border-l-red-500' : 'border-l-amber-500'}
        ${isSelected ? 'border-primary-500 bg-slate-800/80 shadow-lg' : 'hover:border-slate-700 hover:bg-slate-900/80'}
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-white">{emergency.emergencyNumber}</span>
            <EmergencyStatus status={emergency.status} />
          </div>
          <h4 className="mt-1 text-sm font-extrabold text-slate-100 capitalize">
            {emergency.type.replace('_', ' ')}
          </h4>
        </div>
        <EmergencyPriorityBadge severity={emergency.severity} />
      </div>

      <div className="mt-3 space-y-1.5 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
          <span className="truncate">{emergency.pickupLocation?.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Hospital className="h-3.5 w-3.5 text-sky-400 shrink-0" />
          <span className="truncate">{emergency.destinationHospital?.name}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <Truck className="h-3.5 w-3.5 text-primary-400" />
          <span>{emergency.assignedVehicleCallSign || 'Awaiting Unit'}</span>
        </div>

        <div className="flex items-center gap-2">
          {emergency.greenCorridorActive && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
              <Zap className="h-3 w-3 fill-emerald-400" />
              GC On
            </span>
          )}
          <span className="flex items-center gap-1 font-mono font-bold text-primary-400 bg-primary-950/60 px-2 py-0.5 rounded border border-primary-800/50">
            <Clock className="h-3 w-3" />
            ETA {emergency.etaMinutes}m
          </span>
        </div>
      </div>
    </Card>
  );
};

export default EmergencyCard;
