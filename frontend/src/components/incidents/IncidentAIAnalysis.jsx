import React from 'react';
import { BrainCircuit, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';

export const IncidentAIAnalysis = ({ incident }) => {
  if (!incident) return null;

  return (
    <Card className="border-indigo-900/50 bg-indigo-950/20 backdrop-blur-sm space-y-3">
      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
        <BrainCircuit className="h-4 w-4" />
        <span>AI Predictive Impact Assessment</span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Autonomous sensors predict traffic queue propagation of <strong>1.4 km</strong> over the next 20 minutes. Recommended dispatch rerouting to <strong>Janpath Secondary Transit</strong> to maintain ambulance response times under 8 minutes.
      </p>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-900/40 text-[11px]">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Active Reroute Active</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Risk Index: 8.4/10</span>
        </div>
      </div>
    </Card>
  );
};

export default IncidentAIAnalysis;
