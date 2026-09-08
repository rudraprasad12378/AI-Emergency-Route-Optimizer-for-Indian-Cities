import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useIncidents } from '../../hooks/useIncidents';
import { PageContainer } from '../../components/layout/PageContainer';
import { IncidentDetails as IncidentDetailsCard } from '../../components/incidents/IncidentDetails';
import { IncidentAIAnalysis } from '../../components/incidents/IncidentAIAnalysis';
import { CityMap } from '../../components/map/CityMap';
import { Button } from '../../components/ui/Button';

export const IncidentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allIncidents, resolveIncident } = useIncidents();

  const incident = allIncidents.find((i) => i.id === id) || allIncidents[0];

  return (
    <PageContainer
      title={`Hazard Report: ${incident?.title || id}`}
      subtitle={`Incident Code: ${incident?.id} · Active avoidance radius`}
      actions={
        <Button variant="outline" size="sm" onClick={() => navigate('/incidents')}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Hazards
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4">
          <IncidentDetailsCard
            incident={incident}
            onResolve={(incId) => {
              resolveIncident(incId);
              navigate('/incidents');
            }}
          />

          <IncidentAIAnalysis incident={incident} />
        </div>

        <div className="lg:col-span-6">
          <div className="h-[460px] rounded-2xl overflow-hidden border border-slate-800">
            <CityMap />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default IncidentDetails;
