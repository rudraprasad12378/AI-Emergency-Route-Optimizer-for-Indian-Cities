import React from 'react';
import { BrainCircuit, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';

export const PredictionSummary = () => {
  return (
    <Card className="border-indigo-900/50 bg-gradient-to-r from-indigo-950/30 to-purple-950/20 p-4 space-y-2">
      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
        <BrainCircuit className="h-4 w-4 text-primary-400" />
        <span>Predictive AI City Corridor Overview</span>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">
        Autonomous time-series modeling projects <strong>3 bottleneck surges</strong> across NH16 and Old Town corridors between 18:30 and 21:00 due to combined evening commuter peaks and rain forecast. Pre-positioning 4 standby emergency units recommended.
      </p>
    </Card>
  );
};

export default PredictionSummary;
