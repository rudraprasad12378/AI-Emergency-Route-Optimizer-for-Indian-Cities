export const mockTrafficSensors = [
  { id: 'sensor-01', name: 'Master Canteen Junc', lat: 20.2648, lng: 85.8402, congestionLevel: 42, avgSpeedKmph: 34, status: 'moderate' },
  { id: 'sensor-02', name: 'Rajmahal Square', lat: 20.2685, lng: 85.8350, congestionLevel: 35, avgSpeedKmph: 38, status: 'low' },
  { id: 'sensor-03', name: 'Iskcon Flyover Underpass', lat: 20.2942, lng: 85.8198, congestionLevel: 91, avgSpeedKmph: 8, status: 'severe' },
  { id: 'sensor-04', name: 'Jayadev Vihar Overbridge', lat: 20.3015, lng: 85.8242, congestionLevel: 78, avgSpeedKmph: 15, status: 'heavy' },
  { id: 'sensor-05', name: 'Khandagiri Chowk', lat: 20.2589, lng: 85.7891, congestionLevel: 62, avgSpeedKmph: 22, status: 'moderate' },
  { id: 'sensor-06', name: 'Patia Big Bazaar Crossing', lat: 20.3540, lng: 85.8180, congestionLevel: 55, avgSpeedKmph: 28, status: 'moderate' },
  { id: 'sensor-07', name: 'Rasulgarh Square NH16', lat: 20.2911, lng: 85.8643, congestionLevel: 84, avgSpeedKmph: 12, status: 'heavy' },
  { id: 'sensor-08', name: 'Vani Vihar Interchange', lat: 20.2882, lng: 85.8456, congestionLevel: 48, avgSpeedKmph: 30, status: 'moderate' },
];

export const mockRiskZones = [
  {
    id: 'risk-01',
    name: 'Iskcon Monsoon Inundation Zone',
    severity: 'high',
    center: [20.2942, 85.8198],
    radiusMeters: 600,
    cause: 'Heavy drainage overflow & stalled vehicles',
  },
  {
    id: 'risk-02',
    name: 'Sachivalaya Marg VIP Perimeter',
    severity: 'critical',
    center: [20.2741, 85.8315],
    radiusMeters: 1000,
    cause: 'Cordoned road for State Governor convoy',
  },
  {
    id: 'risk-03',
    name: 'Lingaraj Festive Congestion Area',
    severity: 'medium',
    center: [20.2382, 85.8338],
    radiusMeters: 750,
    cause: 'High pedestrian density and temple queue',
  },
];
