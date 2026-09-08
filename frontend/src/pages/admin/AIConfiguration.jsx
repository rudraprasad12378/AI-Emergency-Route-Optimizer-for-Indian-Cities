import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BrainCircuit, Save, Sparkles } from 'lucide-react';

export const AIConfiguration = () => {
  const [config, setConfig] = useState({
    rerouteThresholdMins: 3.5,
    trafficWeight: 0.75,
    waterloggingPenalty: 0.9,
    vipAvoidanceMultiplier: 2.5,
    greenCorridorAutoTrigger: true,
  });

  return (
    <PageContainer
      title="AI Optimization Engine Parameters"
      subtitle="Tune routing heuristics, hazard penalty penalties, and signal preemption sensitivity"
      actions={
        <Button size="sm" variant="primary">
          <Save className="h-4 w-4 mr-1.5" />
          Save AI Weights
        </Button>
      }
    >
      <div className="max-w-2xl space-y-4">
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <BrainCircuit className="h-4 w-4" />
            <span>Path Optimization Heuristics</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Dynamic Reroute Trigger Threshold ({config.rerouteThresholdMins} minutes projected delay)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={config.rerouteThresholdMins}
                onChange={(e) => setConfig({ ...config, rerouteThresholdMins: parseFloat(e.target.value) })}
                className="w-full accent-primary-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Traffic Congestion Penalty Factor ({config.trafficWeight})
              </label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={config.trafficWeight}
                onChange={(e) => setConfig({ ...config, trafficWeight: parseFloat(e.target.value) })}
                className="w-full accent-primary-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Monsoon Inundation Penalty ({config.waterloggingPenalty})
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={config.waterloggingPenalty}
                onChange={(e) => setConfig({ ...config, waterloggingPenalty: parseFloat(e.target.value) })}
                className="w-full accent-primary-500"
              />
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AIConfiguration;
