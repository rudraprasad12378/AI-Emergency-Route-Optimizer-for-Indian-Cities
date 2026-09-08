import React, { useState } from 'react';
import { Phone, User, MapPin, Hospital, Truck, Zap, AlertTriangle, ShieldCheck, CheckCircle2, Navigation } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { EmergencyPriorityBadge } from './EmergencyPriorityBadge';
import { EmergencyStatus } from './EmergencyStatus';
import { Dialog } from '../ui/Dialog';
import { useVehicleStore } from '../../store/vehicleStore';

export const EmergencySummary = ({ emergency, onToggleGreenCorridor, onReroute, onAssignVehicle }) => {
  if (!emergency) return null;

  const [assignOpen, setAssignOpen] = useState(false);
  const { vehicles } = useVehicleStore();

  const availableVehicles = vehicles.filter((v) => v.status === 'available' || v.id === emergency.assignedVehicleId);

  const handleSelectVehicle = (veh) => {
    if (onAssignVehicle) {
      onAssignVehicle(emergency.id, veh.id, veh.callSign);
    }
    setAssignOpen(false);
  };

  const isEnRoute = emergency.status === 'EN_ROUTE' || emergency.status === 'REROUTING' || emergency.status === 'ARRIVING';

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

          <div className="flex items-center gap-2 flex-wrap">
            {/* Action: Assign Vehicle Button */}
            {(!emergency.assignedVehicleId || emergency.status === 'REQUESTED' || emergency.status === 'TRIAGED') && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => setAssignOpen(true)}
                className="bg-primary-600 hover:bg-primary-500 font-bold"
              >
                <Truck className="h-4 w-4 mr-1.5" />
                Assign Vehicle
              </Button>
            )}

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

        {/* Live Simulation Progress Strip when En Route */}
        {isEnRoute && (
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-emerald-300 uppercase tracking-wide">
                <Navigation className="h-3.5 w-3.5 text-emerald-400 animate-spin" />
                Live Mission Transit: {emergency.assignedVehicleCallSign || 'AMB-101'}
              </span>
              <div className="flex items-center gap-3 font-mono font-bold text-xs">
                <span className="text-slate-300">Dist: <strong className="text-white">{emergency.distanceRemainingKm || 8.2} km</strong></span>
                <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                  ETA: {emergency.etaMinutes} min
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-primary-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, emergency.simulationProgress || 10)}%` }}
              />
            </div>
          </div>
        )}

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
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Transit & Assigned Unit</h4>
              {emergency.assignedVehicleCallSign ? (
                <span className="font-bold text-emerald-400 font-mono text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  🚑 {emergency.assignedVehicleCallSign}
                </span>
              ) : (
                <span className="text-amber-400 font-bold text-[10px] uppercase">Awaiting Unit</span>
              )}
            </div>

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

      {/* Vehicle Selection Modal */}
      <Dialog
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
        title="Assign Emergency Vehicle"
        description="Select an available emergency vehicle unit to dispatch to this incident."
      >
        <div className="space-y-2.5">
          {availableVehicles.map((veh) => (
            <button
              key={veh.id}
              onClick={() => handleSelectVehicle(veh)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-800/80 hover:border-primary-500 text-left transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{veh.type === 'ambulance' ? '🚑' : '🚒'}</span>
                <div>
                  <h4 className="font-mono font-bold text-white text-sm">{veh.callSign}</h4>
                  <p className="text-[11px] text-slate-400 capitalize">{veh.type.replace('_', ' ')} · {veh.status}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 block">Available</span>
                <span className="text-[10px] text-slate-500 font-mono">Fuel: {veh.fuel}%</span>
              </div>
            </button>
          ))}
        </div>
      </Dialog>
    </div>
  );
};

export default EmergencySummary;
