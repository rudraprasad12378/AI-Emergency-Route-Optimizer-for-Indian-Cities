import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useVehicleTracking } from '../../hooks/useVehicleTracking';
import { PageContainer } from '../../components/layout/PageContainer';
import { VehicleDetails as VehicleDetailsCard } from '../../components/vehicles/VehicleDetails';
import { VehicleLocation } from '../../components/vehicles/VehicleLocation';
import { CityMap } from '../../components/map/CityMap';
import { Button } from '../../components/ui/Button';

export const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allVehicles } = useVehicleTracking();

  const vehicle = allVehicles.find((v) => v.id === id) || allVehicles[0];

  return (
    <PageContainer
      title={`Vehicle Unit: ${vehicle?.callSign || id}`}
      subtitle={`Fleet Registry · Type: ${vehicle?.type?.replace('_', ' ')?.toUpperCase()}`}
      actions={
        <Button variant="outline" size="sm" onClick={() => navigate('/vehicles')}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Fleet
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <VehicleDetailsCard vehicle={vehicle} />
          <VehicleLocation vehicle={vehicle} />
        </div>

        <div className="lg:col-span-7">
          <div className="h-[460px] rounded-2xl overflow-hidden border border-slate-800">
            <CityMap />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default VehicleDetails;
