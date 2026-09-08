import React from 'react';
import { Select } from '../ui/Select';

export const StationFilters = ({ filterType, onTypeChange }) => {
  return (
    <div className="flex items-center gap-3">
      <Select
        value={filterType}
        onChange={(e) => onTypeChange(e.target.value)}
        options={[
          { label: 'All Station Types', value: 'all' },
          { label: 'Combined Response Hubs', value: 'combined' },
          { label: 'EMS / Trauma Centers', value: 'ems' },
          { label: 'Fire & Rescue Bases', value: 'fire' },
          { label: 'Police Quick Reaction Posts', value: 'police' },
        ]}
      />
    </div>
  );
};

export default StationFilters;
