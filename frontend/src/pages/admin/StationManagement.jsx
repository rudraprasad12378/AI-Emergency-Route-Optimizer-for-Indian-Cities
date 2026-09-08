import React, { useState } from 'react';
import { mockStations } from '../../mock/stations';
import { PageContainer } from '../../components/layout/PageContainer';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Plus, CheckCircle2 } from 'lucide-react';

export const StationManagement = () => {
  const [stations, setStations] = useState(mockStations);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'ambulance_hub',
    address: '',
    coverageRadiusKm: 8,
    totalAmbulances: 4,
    availableAmbulances: 4,
  });
  const [successMsg, setSuccessMsg] = useState('');

  const columns = [
    { header: 'Station Name', key: 'name' },
    { header: 'Type', key: 'type', render: (s) => <span className="capitalize">{s.type.replace('_', ' ')}</span> },
    { header: 'Address', key: 'address' },
    { header: 'Coverage', key: 'coverageRadiusKm', render: (s) => `${s.coverageRadiusKm} km` },
    { header: 'Ambulance Units', key: 'availableAmbulances', render: (s) => `${s.availableAmbulances}/${s.totalAmbulances}` },
  ];

  const handleAddStation = () => {
    if (!formData.name || !formData.address) return;
    const newStation = {
      id: `stn-${Date.now().toString().slice(-4)}`,
      ...formData,
      coordinates: { lat: 20.2961, lng: 85.8245 },
    };
    setStations([newStation, ...stations]);
    setIsAddOpen(false);
    setFormData({ name: '', type: 'ambulance_hub', address: '', coverageRadiusKm: 8, totalAmbulances: 4, availableAmbulances: 4 });
    setSuccessMsg(`Station ${newStation.name} registered.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <PageContainer
      title="Emergency Hub Infrastructure"
      subtitle="Base stations, trauma centers, and territorial dispatch boundaries"
      actions={
        <Button size="sm" variant="primary" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Response Base
        </Button>
      }
    >
      {successMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-3 text-xs text-emerald-300 font-bold">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <Table columns={columns} data={stations} />

      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onConfirm={handleAddStation}
        title="Add Emergency Response Hub / Base"
        confirmLabel="Create Hub"
      >
        <div className="space-y-3 pt-2">
          <Input
            label="Station / Hub Name"
            placeholder="e.g. Master Canteen Emergency Outpost"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Physical Address / Zone"
            placeholder="e.g. Station Square, Unit 3, Bhubaneswar"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
          <Select
            label="Facility Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { label: 'Ambulance Base Hub', value: 'ambulance_hub' },
              { label: 'Hospital Trauma Emergency Center', value: 'hospital' },
              { label: 'Fire & Rescue Station', value: 'fire_station' },
              { label: 'Police Traffic Control Hub', value: 'police_station' },
            ]}
          />
          <Input
            label="Coverage Radius (km)"
            type="number"
            value={formData.coverageRadiusKm}
            onChange={(e) => setFormData({ ...formData, coverageRadiusKm: parseFloat(e.target.value) || 5 })}
          />
        </div>
      </Dialog>
    </PageContainer>
  );
};

export default StationManagement;
