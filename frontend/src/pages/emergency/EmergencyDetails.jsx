import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Shield, Phone, Hospital, User, Clock, AlertTriangle } from 'lucide-react';
import { useEmergency } from '../../hooks/useEmergency';
import { useRoute } from '../../hooks/useRoute';
import { PageContainer } from '../../components/layout/PageContainer';
import { EmergencySummary } from '../../components/emergency/EmergencySummary';
import { EmergencyTimeline } from '../../components/emergency/EmergencyTimeline';
import { RouteExplanation } from '../../components/route/RouteExplanation';
import { RouteMetrics } from '../../components/route/RouteMetrics';
import { CityMap } from '../../components/map/CityMap';
import { Button } from '../../components/ui/Button';

export const EmergencyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allEmergencies, toggleGreenCorridor } = useEmergency();
  const { selectedRoute } = useRoute();

  const emergency = allEmergencies.find((e) => e.id === id) || allEmergencies[0];

  return (
    <PageContainer
      title={`Emergency Record: ${emergency?.emergencyNumber || id}`}
      subtitle={`Tactical Mission Breakdown · ${emergency?.type?.replace('_', ' ')?.toUpperCase()}`}
      actions={
        <Button variant="outline" size="sm" onClick={() => navigate('/emergencies')}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to List
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Summary, Timeline, Rationale */}
        <div className="lg:col-span-6 space-y-4">
          <EmergencySummary
            emergency={emergency}
            onToggleGreenCorridor={() => toggleGreenCorridor(emergency.id)}
          />

          <EmergencyTimeline emergency={emergency} />

          {selectedRoute && <RouteExplanation route={selectedRoute} />}
        </div>

        {/* Right Side: Map & Route Metrics */}
        <div className="lg:col-span-6 space-y-4">
          <div className="h-[420px] rounded-2xl overflow-hidden border border-slate-800">
            <CityMap />
          </div>

          {selectedRoute && <RouteMetrics route={selectedRoute} />}
        </div>
      </div>
    </PageContainer>
  );
};

export default EmergencyDetails;
