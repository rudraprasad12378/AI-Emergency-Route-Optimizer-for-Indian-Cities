export const mockAnalytics = {
  overview: {
    totalDispatchesToday: 48,
    activeEmergencies: 3,
    avgResponseTimeMin: 7.4,
    avgTimeSavedMin: 6.8,
    greenCorridorsActivated: 29,
    targetResponseTimeMin: 10.0,
    complianceRate: 94.2,
  },
  responseTimeTrends: [
    { time: '00:00', actual: 6.2, baseline: 12.0 },
    { time: '04:00', actual: 5.8, baseline: 11.5 },
    { time: '08:00', actual: 8.9, baseline: 18.2 },
    { time: '12:00', actual: 7.6, baseline: 15.4 },
    { time: '16:00', actual: 9.1, baseline: 19.8 },
    { time: '20:00', actual: 8.2, baseline: 17.0 },
    { time: 'Now', actual: 7.4, baseline: 16.5 },
  ],
  emergencyTypeBreakdown: [
    { type: 'Cardiac Arrest', count: 18, color: '#ef4444' },
    { type: 'Road Accident', count: 14, color: '#f97316' },
    { type: 'Fire Emergency', count: 8, color: '#eab308' },
    { type: 'Maternity', count: 5, color: '#06b6d4' },
    { type: 'Other Trauma', count: 3, color: '#8b5cf6' },
  ],
  hospitalStats: [
    { name: 'AIIMS Bhubaneswar', admissionsToday: 18, avgTransitMin: 12.4, status: 'High Load' },
    { name: 'Capital Hospital', admissionsToday: 14, avgTransitMin: 7.1, status: 'Normal' },
    { name: 'Apollo Hospitals', admissionsToday: 9, avgTransitMin: 8.5, status: 'Normal' },
    { name: 'KIMS Hospital', admissionsToday: 7, avgTransitMin: 11.2, status: 'Normal' },
  ],
};
