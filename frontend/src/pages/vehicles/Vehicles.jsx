import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Filter, Radio } from 'lucide-react';
import { useVehicleTracking } from '../../hooks/useVehicleTracking';
import { PageContainer } from '../../components/layout/PageContainer';
import { VehicleCard } from '../../components/vehicles/VehicleCard';
import { Select } from '../../components/ui/Select';

export const Vehicles = () => {
  const navigate = useNavigate();
  const { vehicles, filterType, setFilterType, filterStatus, setFilterStatus } = useVehicleTracking();

  return (
    <PageContainer
      title="Emergency Vehicle Fleet"
      subtitle="Live status, telemetry, fuel reserves, and crew assignments across Bhubaneswar"
    >
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="w-48">
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { label: 'All Fleet Types', value: 'all' },
              { label: 'Ambulances', value: 'ambulance' },
              { label: 'Fire Tenders', value: 'fire_truck' },
              { label: 'Police Interceptors', value: 'police' },
            ]}
          />
        </div>

        <div className="w-48">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { label: 'All Statuses', value: 'all' },
              { label: 'Available', value: 'available' },
              { label: 'En Route', value: 'en_route' },
              { label: 'On Scene', value: 'on_scene' },
              { label: 'Maintenance', value: 'maintenance' },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((veh) => (
          <VehicleCard
            key={veh.id}
            vehicle={veh}
            onClick={() => navigate(`/vehicles/${veh.id}`)}
          />
        ))}
      </div>
    </PageContainer>
  );
};

export default Vehicles;
