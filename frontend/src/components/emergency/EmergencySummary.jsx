import React from 'react';
import { Phone, User, MapPin, Hospital, Truck, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { EmergencyPriorityBadge } from './EmergencyPriorityBadge';
import { EmergencyStatus } from './EmergencyStatus';

export const EmergencySummary = ({ emergency, onToggleGreenCorridor, onReroute }) => {
  if (!emergency) return null;

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <Card className="border-slate-800 bg-slate-900/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-white">{emergency.emergencyNumber}</span>
              <EmergencyStatus status={emergency.status} />
              <EmergencyPriorityBadge severity={emergency.severity} />
            </div>
            <h3 className="text-lg font-black text-white mt-1 capitalize">{emergency.type.replace('_', ' ')}</h3>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={emergency.greenCorridorActive ? 'primary' : 'outline'}
              onClick={onToggleGreenCorridor}
              className={emergency.greenCorridorActive ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500' : ''}
            >
              <Zap className="h-4 w-4 mr-1.5" />
              {emergency.greenCorridorActive ? 'Green Corridor ACTIVE' : 'Enable Green Corridor'}
            </Button>
            {onReroute && (
              <Button size="sm" variant="secondary" onClick={onReroute}>
                AI Reroute
              </Button>
            )}
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Caller & Patient Info */}
          <div className="space-y-2 rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">Caller & Patient</h4>
            <div className="flex items-center gap-2 text-slate-300">
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span>{emergency.callerName}</span>
              <span className="text-slate-500">({emergency.patientCount} Patient)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="h-3.5 w-3.5 text-slate-500" />
              <span className="font-mono">{emergency.callerPhone}</span>
            </div>
            <p className="text-slate-400 mt-2 bg-slate-900 p-2 rounded border border-slate-800/50 italic">
              "{emergency.description}"
            </p>
          </div>

          {/* Transit & Destination */}
          <div className="space-y-2 rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">Transit Routing</h4>
            <div className="flex items-start gap-2 text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">{emergency.pickupLocation?.address}</span>
                <span className="text-[11px] text-slate-500">{emergency.pickupLocation?.landmark}</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-slate-300 pt-1">
              <Hospital className="h-3.5 w-3.5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">{emergency.destinationHospital?.name}</span>
                <span className="text-[11px] text-slate-500">
                  {emergency.destinationHospital?.distanceKm} km · Est. Transit: {emergency.destinationHospital?.estimatedTimeMin} mins
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmergencySummary;
