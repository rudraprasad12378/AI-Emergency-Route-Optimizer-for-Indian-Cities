import React from 'react';
import { Clock, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';

export const TrafficPredictionCard = ({ prediction }) => {
  return (
    <Card className="border-slate-800 bg-slate-900/90 space-y-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
            {prediction.riskLevel} Risk Corridor
          </span>
          <h4 className="text-sm font-extrabold text-white mt-1.5">{prediction.corridorName}</h4>
        </div>
        <div className="text-right">
          <span className="font-mono text-xs font-bold text-slate-300 block">{prediction.predictedPeakHour}</span>
          <span className="text-[10px] text-slate-500">Confidence: {prediction.confidence}%</span>
        </div>
      </div>

      <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span>Projected Transit Delay: +{prediction.projectedDelayMinutes} mins</span>
        </div>
        <p className="text-slate-300 text-xs leading-relaxed">{prediction.recommendation}</p>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {prediction.factors?.map((factor, idx) => (
          <span key={idx} className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-400">
            • {factor}
          </span>
        ))}
      </div>
    </Card>
  );
};

export default TrafficPredictionCard;
