import React from 'react';
import { Sparkles, CheckCircle, AlertOctagon } from 'lucide-react';
import { Card } from '../ui/Card';

export const RouteExplanation = ({ route }) => {
  if (!route) return null;

  return (
    <Card className="border-emerald-900/40 bg-emerald-950/20 backdrop-blur-sm space-y-3">
      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
        <Sparkles className="h-4 w-4" />
        <span>AI Route Selection Rationale</span>
      </div>

      <div className="space-y-2 text-xs text-slate-300">
        {route.aiExplanations?.map((exp, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>{exp}</span>
          </div>
        ))}
      </div>

      {route.bottlenecks && route.bottlenecks.length > 0 && (
        <div className="border-t border-slate-800/80 pt-3 space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Identified Bottlenecks</p>
          {route.bottlenecks.map((bn, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 px-2 py-1 rounded">
              <span>{bn.name}</span>
              <span className="font-mono text-amber-400">+{bn.delaySeconds}s delay</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RouteExplanation;
