import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertTriangle } from 'lucide-react';
import { useIncidents } from '../../hooks/useIncidents';
import { PageContainer } from '../../components/layout/PageContainer';
import { IncidentCard } from '../../components/incidents/IncidentCard';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

export const Incidents = () => {
  const navigate = useNavigate();
  const { incidents, filterType, setFilterType, filterSeverity, setFilterSeverity } = useIncidents();

  return (
    <PageContainer
      title="Traffic & Hazard Incidents"
      subtitle="Live road hazards, waterlogging spots, and VIP security cordons affecting emergency routing"
      actions={
        <Button variant="danger" size="sm" onClick={() => navigate('/incidents/new')}>
          <Plus className="h-4 w-4 mr-1.5" />
          Report Hazard Alert
        </Button>
      }
    >
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="w-52">
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { label: 'All Hazard Types', value: 'all' },
              { label: 'Monsoon Waterlogging', value: 'waterlogging' },
              { label: 'VVIP Movement', value: 'vip_movement' },
              { label: 'Road Construction', value: 'construction' },
              { label: 'Procession / Crowds', value: 'procession' },
            ]}
          />
        </div>

        <div className="w-48">
          <Select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            options={[
              { label: 'All Severities', value: 'all' },
              { label: 'Critical Blockage', value: 'critical' },
              { label: 'High Congestion', value: 'high' },
              { label: 'Moderate Impact', value: 'medium' },
            ]}
          />
        </div>

        {(filterType !== 'all' || filterSeverity !== 'all') && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilterType('all');
              setFilterSeverity('all');
            }}
          >
            Reset Filters
          </Button>
        )}
      </div>

      {incidents.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No Active Road Hazards Found"
          description="Corridors are clear of logged hazards for the selected category."
          actionLabel="Report Hazard Alert"
          onAction={() => navigate('/incidents/new')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incidents.map((inc) => (
            <IncidentCard
              key={inc.id}
              incident={inc}
              onClick={() => navigate(`/incidents/${inc.id}`)}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default Incidents;
