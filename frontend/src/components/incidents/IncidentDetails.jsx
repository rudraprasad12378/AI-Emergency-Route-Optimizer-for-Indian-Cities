import React from 'react';
import { AlertTriangle, Clock, MapPin, Radio, Shield, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { IncidentSeverityBadge } from './IncidentSeverityBadge';

export const IncidentDetails = ({ incident, onResolve }) => {
  if (!incident) return null;

  return (
    <Card className="border-slate-800 bg-slate-900/90 space-y-4">
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-400">{incident.id}</span>
            <IncidentSeverityBadge severity={incident.severity} />
          </div>
          <h3 className="text-base font-extrabold text-white mt-1">{incident.title}</h3>
        </div>
        {onResolve && (
          <Button size="sm" variant="outline" onClick={() => onResolve(incident.id)}>
            <CheckCircle className="h-3.5 w-3.5 mr-1 text-emerald-400" />
            Mark Resolved
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Location & Impact</p>
          <div className="flex items-start gap-2 text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
            <span>{incident.location?.address}</span>
          </div>
          <p className="text-slate-400 font-medium">Affected Lanes: {incident.affectedLanes}</p>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Clearance & AI Advisory</p>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Est. Clearance:</span>
            <span className="font-mono font-bold text-amber-400">{incident.estimatedClearanceMinutes} mins</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Avoidance Buffer:</span>
            <span className="font-mono font-bold text-slate-200">{incident.recommendedAvoidanceRadiusMeters}m</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Telemetry Feed:</span>
            <span className="text-primary-400 font-medium">{incident.source}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default IncidentDetails;
