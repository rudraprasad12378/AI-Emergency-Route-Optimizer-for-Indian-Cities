import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useIncidents } from '../../hooks/useIncidents';
import { PageContainer } from '../../components/layout/PageContainer';
import { IncidentForm } from '../../components/incidents/IncidentForm';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const NewIncident = () => {
  const navigate = useNavigate();
  const { reportIncident } = useIncidents();

  const handleSubmit = (formData) => {
    const created = reportIncident(formData);
    navigate(`/incidents/${created.id}`);
  };

  return (
    <PageContainer
      title="Broadcast Traffic Hazard Alert"
      subtitle="Register active blockages, VIP diversions, and waterlogging to update AI avoidance weights"
      actions={
        <Button variant="outline" size="sm" onClick={() => navigate('/incidents')}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Cancel
        </Button>
      }
    >
      <div className="max-w-3xl mx-auto">
        <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Hazard Intake Form</h2>
              <p className="text-xs text-slate-400">Broadcasts instant recalculations to all en-route vehicles</p>
            </div>
          </div>

          <IncidentForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/incidents')}
          />
        </Card>
      </div>
    </PageContainer>
  );
};

export default NewIncident;
