import { useState } from 'react';
import { mockTrafficSensors, mockRiskZones } from '../mock/traffic';

export const useTraffic = () => {
  const [sensors] = useState(mockTrafficSensors);
  const [riskZones] = useState(mockRiskZones);

  return {
    sensors,
    riskZones,
    highCongestionSensors: sensors.filter((s) => s.congestionLevel >= 75),
    averageCitySpeed: Math.round(sensors.reduce((acc, s) => acc + s.avgSpeedKmph, 0) / sensors.length),
  };
};

export default useTraffic;
