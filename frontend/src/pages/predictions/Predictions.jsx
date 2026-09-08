import React from 'react';
import { usePredictions } from '../../hooks/usePredictions';
import { PageContainer } from '../../components/layout/PageContainer';
import { PredictionSummary } from '../../components/predictions/PredictionSummary';
import { TrafficPredictionCard } from '../../components/predictions/TrafficPredictionCard';
import { PredictionChart } from '../../components/predictions/PredictionChart';

export const Predictions = () => {
  const { predictions } = usePredictions();

  return (
    <PageContainer
      title="AI Predictive Traffic & Hazard Modeling"
      subtitle="Anticipate bottleneck surge windows and dynamically stage emergency response assets"
    >
      <div className="space-y-6">
        <PredictionSummary />

        <PredictionChart />

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Critical Corridor Forecasts ({predictions.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predictions.map((p) => (
              <TrafficPredictionCard key={p.id} prediction={p} />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Predictions;
