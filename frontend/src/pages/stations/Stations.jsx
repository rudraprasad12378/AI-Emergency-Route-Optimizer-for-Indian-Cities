import React, { useState } from 'react';
import { mockStations } from '../../mock/stations';
import { PageContainer } from '../../components/layout/PageContainer';
import { StationCard } from '../../components/stations/StationCard';
import { StationDetails } from '../../components/stations/StationDetails';
import { StationFilters } from '../../components/stations/StationFilters';
import { CityMap } from '../../components/map/CityMap';
import { EmptyState } from '../../components/ui/EmptyState';
import { Building2 } from 'lucide-react';

export const Stations = () => {
  const [filterType, setFilterType] = useState('all');
  const [selectedStation, setSelectedStation] = useState(mockStations[0]);

  const filteredStations = mockStations.filter((s) => {
    if (filterType !== 'all' && s.type !== filterType) return false;
    return true;
  });

  return (
    <PageContainer
      title="Emergency Stations & Bases"
      subtitle="Operational capacity, ambulance reserves, and coverage radius per zone"
    >
      <div className="flex items-center justify-between">
        <StationFilters filterType={filterType} onTypeChange={setFilterType} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          {filteredStations.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No Stations in Category"
              description="No emergency facilities registered under this category."
              actionLabel="Show All Hubs"
              onAction={() => setFilterType('all')}
            />
          ) : (
            <div className="space-y-3">
              {filteredStations.map((station) => (
                <StationCard
                  key={station.id}
                  station={station}
                  isSelected={station.id === selectedStation?.id}
                  onClick={() => setSelectedStation(station)}
                />
              ))}
            </div>
          )}

          {selectedStation && <StationDetails station={selectedStation} />}
        </div>

        <div className="lg:col-span-7">
          <div className="h-[520px] rounded-2xl overflow-hidden border border-slate-800">
            <CityMap />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Stations;
