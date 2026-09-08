import React from 'react';
import { AlertTriangle, Clock, MapPin, Radio, Shield } from 'lucide-react';
import { Card } from '../ui/Card';
import { IncidentSeverityBadge } from './IncidentSeverityBadge';

export const IncidentCard = ({ incident, isSelected = false, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className={`
        cursor-pointer transition-all border-l-4
        ${incident.severity === 'critical' ? 'border-l-red-500' : 'border-l-amber-500'}
        ${isSelected ? 'border-primary-500 bg-slate-800/80 shadow-lg' : 'hover:bg-slate-900/80'}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400">{incident.id}</span>
            <span className="text-[10px] uppercase font-bold text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded">
              {incident.type.replace('_', ' ')}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-100 mt-1">{incident.title}</h4>
        </div>
        <IncidentSeverityBadge severity={incident.severity} />
      </div>

      <div className="mt-3 flex items-start gap-2 text-xs text-slate-400">
        <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
        <span className="truncate">{incident.location?.address}</span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-xs">
        <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
          <Clock className="h-3 w-3" />
          <span>Delay: +{incident.averageDelayMinutes}m</span>
        </div>
        <span className="text-[10px] text-slate-500">Radius: {incident.recommendedAvoidanceRadiusMeters}m</span>
      </div>
    </Card>
  );
};

export default IncidentCard;
