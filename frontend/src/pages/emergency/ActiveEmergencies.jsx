import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Siren } from 'lucide-react';
import { useEmergency } from '../../hooks/useEmergency';
import { PageContainer } from '../../components/layout/PageContainer';
import { EmergencyCard } from '../../components/emergency/EmergencyCard';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

export const ActiveEmergencies = () => {
  const navigate = useNavigate();
  const { emergencies, filterStatus, setFilterStatus, filterSeverity, setFilterSeverity } = useEmergency();

  return (
    <PageContainer
      title="Active Emergency Incidents"
      subtitle="Comprehensive overview of ongoing emergency responses across Bhubaneswar"
      actions={
        <Button variant="danger" size="sm" onClick={() => navigate('/emergencies/new')}>
          <Plus className="h-4 w-4 mr-1.5" />
          Dispatch New Unit
        </Button>
      }
    >
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="w-48">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { label: 'All Statuses', value: 'all' },
              { label: 'Assigned', value: 'assigned' },
              { label: 'Dispatched', value: 'dispatched' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Completed', value: 'completed' },
            ]}
          />
        </div>

        <div className="w-48">
          <Select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            options={[
              { label: 'All Severities', value: 'all' },
              { label: 'Critical (Red)', value: 'critical' },
              { label: 'High (Amber)', value: 'high' },
              { label: 'Medium (Yellow)', value: 'medium' },
            ]}
          />
        </div>
      </div>

      {/* Grid of Emergencies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emergencies.map((emg) => (
          <EmergencyCard
            key={emg.id}
            emergency={emg}
            onClick={() => navigate(`/emergencies/${emg.id}`)}
          />
        ))}
      </div>
    </PageContainer>
  );
};

export default ActiveEmergencies;
