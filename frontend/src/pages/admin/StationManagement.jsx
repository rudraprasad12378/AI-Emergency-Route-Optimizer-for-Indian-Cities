import React from 'react';
import { mockStations } from '../../mock/stations';
import { PageContainer } from '../../components/layout/PageContainer';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';

export const StationManagement = () => {
  const columns = [
    { header: 'Station Name', key: 'name' },
    { header: 'Type', key: 'type', render: (s) => <span className="capitalize">{s.type}</span> },
    { header: 'Address', key: 'address' },
    { header: 'Coverage', key: 'coverageRadiusKm', render: (s) => `${s.coverageRadiusKm} km` },
    { header: 'Ambulance Units', key: 'availableAmbulances', render: (s) => `${s.availableAmbulances}/${s.totalAmbulances}` },
  ];

  return (
    <PageContainer
      title="Emergency Hub Infrastructure"
      subtitle="Base stations, trauma centers, and territorial dispatch boundaries"
      actions={
        <Button size="sm" variant="primary">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Response Base
        </Button>
      }
    >
      <Table columns={columns} data={mockStations} />
    </PageContainer>
  );
};

export default StationManagement;
