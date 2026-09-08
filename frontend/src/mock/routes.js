export const mockRoutes = [
  {
    id: 'route-001',
    emergencyId: 'emg-001',
    name: 'AIIMS Emergency Corridor (AI Recommended)',
    isRecommended: true,
    distanceKm: 11.4,
    estimatedDurationMin: 14,
    historicalDurationMin: 23,
    timeSavedMin: 9,
    confidenceScore: 94,
    riskScore: 'low',
    greenCorridorSignals: 8,
    trafficLevel: 'low_with_corridor',
    coordinates: [
      [20.2648, 85.8402], // Master Canteen
      [20.2685, 85.8350], // Rajmahal
      [20.2721, 85.8280], // Sishu Bhawan
      [20.2610, 85.8050], // Siripur
      [20.2520, 85.7890], // Khandagiri
      [20.2312, 85.7766], // AIIMS
    ],
    aiExplanations: [
      'Bypasses blocked Sachivalaya Marg VIP diversion via Siripur flyover corridor.',
      'Synchronized with 8 smart traffic lights for automatic preemption.',
      'Saves approx 9 minutes compared to standard NH16 route.',
    ],
    bottlenecks: [
      { name: 'Rajmahal Underpass', severity: 'low', delaySeconds: 30 },
      { name: 'Khandagiri Crossing', severity: 'medium', delaySeconds: 65 },
    ],
  },
  {
    id: 'route-001-alt1',
    emergencyId: 'emg-001',
    name: 'NH16 Expressway Direct (Standard Route)',
    isRecommended: false,
    distanceKm: 12.8,
    estimatedDurationMin: 22,
    historicalDurationMin: 25,
    timeSavedMin: 0,
    confidenceScore: 78,
    riskScore: 'high',
    greenCorridorSignals: 3,
    trafficLevel: 'heavy',
    coordinates: [
      [20.2648, 85.8402],
      [20.2882, 85.8456],
      [20.3015, 85.8242],
      [20.2700, 85.7900],
      [20.2312, 85.7766],
    ],
    aiExplanations: [
      'Severe bottleneck detected at Iskcon Flyover underpass due to heavy waterlogging.',
      'High risk of cascading congestion near Jayadev Vihar interchange.',
    ],
    bottlenecks: [
      { name: 'Iskcon Underpass Waterlogging', severity: 'critical', delaySeconds: 360 },
      { name: 'Baramunda Bus Terminal Gate', severity: 'high', delaySeconds: 180 },
    ],
  },
  {
    id: 'route-002',
    emergencyId: 'emg-002',
    name: 'Capital Hospital Fire Tender Rapid Transit',
    isRecommended: true,
    distanceKm: 4.8,
    estimatedDurationMin: 6,
    historicalDurationMin: 12,
    timeSavedMin: 6,
    confidenceScore: 92,
    riskScore: 'low',
    greenCorridorSignals: 5,
    trafficLevel: 'green_cleared',
    coordinates: [
      [20.2882, 85.8456], // Saheed Nagar
      [20.2810, 85.8390], // Vani Vihar
      [20.2740, 85.8320], // Ram Mandir
      [20.2635, 85.8239], // Capital Hospital
    ],
    aiExplanations: [
      'Direct Janpath clearance activated via smart signal control.',
      'Clear lane width accommodates wide heavy rescue tenders.',
    ],
    bottlenecks: [],
  },
];
