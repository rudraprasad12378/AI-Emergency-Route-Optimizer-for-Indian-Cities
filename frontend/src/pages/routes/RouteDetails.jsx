import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Sparkles, Route, RefreshCw } from 'lucide-react';
import { useRoute } from '../../hooks/useRoute';
import { PageContainer } from '../../components/layout/PageContainer';
import { RouteMetrics } from '../../components/route/RouteMetrics';
import { RouteExplanation } from '../../components/route/RouteExplanation';
import { RouteComparison } from '../../components/route/RouteComparison';
import { RouteTimeline } from '../../components/route/RouteTimeline';
import { RerouteDialog } from '../../components/route/RerouteDialog';
import { CityMap } from '../../components/map/CityMap';
import { Button } from '../../components/ui/Button';

export const RouteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { routes, selectedRoute, selectedRouteId, setSelectedRouteId, calculateAlternativeRoute, isRerouting } = useRoute();
  const [isRerouteOpen, setIsRerouteOpen] = useState(false);

  const activeRoute = selectedRoute || routes[0];

  const handleTriggerReroute = async () => {
    await calculateAlternativeRoute(activeRoute.emergencyId);
    setIsRerouteOpen(false);
  };

  return (
    <PageContainer
      title={`AI Route Intelligence: ${activeRoute?.name}`}
      subtitle={`Corridor Code: ${activeRoute?.id} · Active Signal Synchronization`}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Command Center
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsRerouteOpen(true)}>
            <Sparkles className="h-4 w-4 mr-1.5" />
            Recalculate AI Path
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <RouteMetrics route={activeRoute} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <RouteExplanation route={activeRoute} />
            <RouteTimeline route={activeRoute} />
            <RouteComparison
              routes={routes}
              selectedRouteId={selectedRouteId}
              onSelectRoute={(r) => setSelectedRouteId(r.id)}
            />
          </div>

          <div className="lg:col-span-7">
            <div className="h-[520px] rounded-2xl overflow-hidden border border-slate-800">
              <CityMap />
            </div>
          </div>
        </div>
      </div>

      <RerouteDialog
        isOpen={isRerouteOpen}
        onClose={() => setIsRerouteOpen(false)}
        onConfirm={handleTriggerReroute}
        isCalculating={isRerouting}
      />
    </PageContainer>
  );
};

export default RouteDetails;
