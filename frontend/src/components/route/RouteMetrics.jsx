import React from 'react';
import { Zap, Clock, ShieldCheck, TrendingDown } from 'lucide-react';
import { Card } from '../ui/Card';

export const RouteMetrics = ({ route }) => {
  if (!route) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Card className="bg-slate-900/80 border-slate-800 p-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Duration</span>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-black text-white font-mono">{route.estimatedDurationMin}</span>
          <span className="text-xs text-slate-400 font-semibold">mins</span>
        </div>
      </Card>

      <Card className="bg-slate-900/80 border-slate-800 p-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time Saved</span>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-black text-emerald-400 font-mono">+{route.timeSavedMin}</span>
          <span className="text-xs text-emerald-400 font-semibold">mins</span>
        </div>
      </Card>

      <Card className="bg-slate-900/80 border-slate-800 p-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signals Cleared</span>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-black text-primary-400 font-mono">{route.greenCorridorSignals}</span>
          <span className="text-xs text-primary-400 font-semibold">junctions</span>
        </div>
      </Card>

      <Card className="bg-slate-900/80 border-slate-800 p-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Confidence</span>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-black text-amber-400 font-mono">{route.confidenceScore}%</span>
        </div>
      </Card>
    </div>
  );
};

export default RouteMetrics;
