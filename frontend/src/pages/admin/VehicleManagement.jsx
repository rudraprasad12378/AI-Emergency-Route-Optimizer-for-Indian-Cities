import React from 'react';
import { mockVehicles } from '../../mock/vehicles';
import { PageContainer } from '../../components/layout/PageContainer';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';

export const VehicleManagement = () => {
  const columns = [
    { header: 'Call Sign', key: 'callSign' },
    { header: 'Type', key: 'type', render: (v) => <span className="capitalize">{v.type.replace('_', ' ')}</span> },
    {
      header: 'Status',
      key: 'status',
      render: (v) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
          {v.status.replace('_', ' ')}
        </span>
      ),
    },
    { header: 'Fuel Level', key: 'fuel', render: (v) => `${v.fuel}%` },
    { header: 'Speed', key: 'speed', render: (v) => `${v.speed} km/h` },
  ];

  return (
    <PageContainer
      title="Fleet Asset Registry"
      subtitle="Configure vehicles, telemetry sensors, and automated maintenance triggers"
      actions={
        <Button size="sm" variant="primary">
          <Plus className="h-4 w-4 mr-1.5" />
          Register Vehicle
        </Button>
      }
    >
      <Table columns={columns} data={mockVehicles} />
    </PageContainer>
  );
};

export default VehicleManagement;
