import React, { useState } from 'react';
import { mockVehicles } from '../../mock/vehicles';
import { PageContainer } from '../../components/layout/PageContainer';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Plus, CheckCircle2 } from 'lucide-react';

export const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    callSign: '',
    type: 'ambulance',
    fuel: 100,
    speed: 0,
    status: 'available',
  });
  const [successMsg, setSuccessMsg] = useState('');

  const columns = [
    { header: 'Call Sign', key: 'callSign' },
    { header: 'Type', key: 'type', render: (v) => <span className="capitalize">{v.type.replace('_', ' ')}</span> },
    {
      header: 'Status',
      key: 'status',
      render: (v) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
          v.status === 'available' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-300'
        }`}>
          {v.status.replace('_', ' ')}
        </span>
      ),
    },
    { header: 'Fuel Level', key: 'fuel', render: (v) => `${v.fuel}%` },
    { header: 'Speed', key: 'speed', render: (v) => `${v.speed} km/h` },
  ];

  const handleAddVehicle = () => {
    if (!formData.callSign) return;
    const newVehicle = {
      id: `veh-${Date.now().toString().slice(-4)}`,
      ...formData,
      coordinates: { lat: 20.2961, lng: 85.8245 },
    };
    setVehicles([newVehicle, ...vehicles]);
    setIsAddOpen(false);
    setFormData({ callSign: '', type: 'ambulance', fuel: 100, speed: 0, status: 'available' });
    setSuccessMsg(`Vehicle ${newVehicle.callSign} registered successfully.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <PageContainer
      title="Fleet Asset Registry"
      subtitle="Configure vehicles, telemetry sensors, and automated maintenance triggers"
      actions={
        <Button size="sm" variant="primary" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Register Vehicle
        </Button>
      }
    >
      {successMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-3 text-xs text-emerald-300 font-bold">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <Table columns={columns} data={vehicles} />

      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onConfirm={handleAddVehicle}
        title="Register New Fleet Vehicle Unit"
        confirmLabel="Register Unit"
      >
        <div className="space-y-3 pt-2">
          <Input
            label="Call Sign / Registration"
            placeholder="e.g. AMB-108"
            value={formData.callSign}
            onChange={(e) => setFormData({ ...formData, callSign: e.target.value })}
            required
          />
          <Select
            label="Vehicle Category"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { label: 'Ambulance (ALS / BLS)', value: 'ambulance' },
              { label: 'Fire Rescue Tender', value: 'fire_truck' },
              { label: 'Police Interceptor', value: 'police' },
            ]}
          />
          <Input
            label="Initial Fuel Level (%)"
            type="number"
            min="10"
            max="100"
            value={formData.fuel}
            onChange={(e) => setFormData({ ...formData, fuel: parseInt(e.target.value) || 100 })}
          />
        </div>
      </Dialog>
    </PageContainer>
  );
};

export default VehicleManagement;
