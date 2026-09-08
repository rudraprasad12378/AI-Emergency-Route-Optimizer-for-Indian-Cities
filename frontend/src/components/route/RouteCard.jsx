import React from 'react';
import { Route, Clock, Zap, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';

export const RouteCard = ({ route, isSelected = false, onSelect }) => {
  return (
    <Card
      onClick={() => onSelect && onSelect(route)}
      className={`
        cursor-pointer transition-all border-l-4
        ${route.isRecommended ? 'border-l-emerald-500' : 'border-l-amber-500'}
        ${isSelected ? 'border-primary-500 bg-slate-800/80 shadow-lg' : 'hover:bg-slate-900/80'}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            {route.isRecommended ? (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                <CheckCircle2 className="h-3 w-3" />
                AI Recommended
              </span>
            ) : (
              <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                Alternative Route
              </span>
            )}
            <span className="font-mono text-xs text-slate-400 font-semibold">{route.distanceKm} km</span>
          </div>
          <h4 className="text-sm font-extrabold text-slate-100 mt-1.5">{route.name}</h4>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 font-mono text-base font-black text-white justify-end">
            <Clock className="h-4 w-4 text-primary-400" />
            <span>{route.estimatedDurationMin}m</span>
          </div>
          {route.timeSavedMin > 0 && (
            <span className="text-[10px] font-bold text-emerald-400">
              Saves {route.timeSavedMin}m
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-xs text-slate-400">
        <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
          <Zap className="h-3 w-3 fill-emerald-400" />
          <span>{route.greenCorridorSignals} Preempted Signals</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Confidence: <strong className="text-slate-200">{route.confidenceScore}%</strong>
        </span>
      </div>
    </Card>
  );
};

export default RouteCard;
