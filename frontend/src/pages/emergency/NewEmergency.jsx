import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Siren, ArrowLeft } from 'lucide-react';
import { useEmergency } from '../../hooks/useEmergency';
import { PageContainer } from '../../components/layout/PageContainer';
import { EmergencyForm } from '../../components/emergency/EmergencyForm';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const NewEmergency = () => {
  const navigate = useNavigate();
  const { createEmergency } = useEmergency();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    const created = createEmergency(formData);
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/emergencies/${created.id}`);
    }, 400);
  };

  return (
    <PageContainer
      title="Create New Emergency Incident"
      subtitle="Input 108 / 101 emergency call telemetry for instant automated AI corridor creation"
      actions={
        <Button variant="outline" size="sm" onClick={() => navigate('/emergencies')}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Cancel
        </Button>
      }
    >
      <div className="max-w-3xl mx-auto">
        <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <Siren className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Emergency Intake & Triage</h2>
              <p className="text-xs text-slate-400">Triggers automated route optimization and signal priority</p>
            </div>
          </div>

          <EmergencyForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/emergencies')}
            isLoading={isLoading}
          />
        </Card>
      </div>
    </PageContainer>
  );
};

export default NewEmergency;
