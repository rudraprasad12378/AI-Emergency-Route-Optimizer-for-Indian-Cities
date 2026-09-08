// Emergency lifecycle & type constants
export const EMERGENCY_LIFECYCLE = {
  REQUESTED: 'REQUESTED',
  TRIAGED: 'TRIAGED',
  ASSIGNED: 'ASSIGNED',
  ACCEPTED: 'ACCEPTED',
  EN_ROUTE: 'EN_ROUTE',
  REROUTING: 'REROUTING',
  ARRIVING: 'ARRIVING',
  ARRIVED: 'ARRIVED',
  COMPLETED: 'COMPLETED',
};

export const EMERGENCY_TYPES = ['medical', 'cardiac_arrest', 'fire', 'building_fire', 'police', 'accident', 'road_accident', 'maternity_emergency', 'disaster'];
export const EMERGENCY_PRIORITIES = ['critical', 'high', 'medium', 'low'];
export const EMERGENCY_STATUSES = [
  'REQUESTED',
  'TRIAGED',
  'ASSIGNED',
  'ACCEPTED',
  'EN_ROUTE',
  'REROUTING',
  'ARRIVING',
  'ARRIVED',
  'COMPLETED',
  'pending',
  'dispatched',
  'in_progress',
  'on_scene',
  'cancelled'
];

export const EMERGENCY_TYPE_LABELS = {
  medical: 'Medical Emergency',
  cardiac_arrest: 'Cardiac / Critical Medical',
  fire: 'Fire Emergency',
  building_fire: 'Building Fire / Hazard',
  police: 'Police Emergency',
  accident: 'Road Accident',
  road_accident: 'Severe Road Crash',
  maternity_emergency: 'Maternity Emergency',
  disaster: 'Natural Disaster',
};

export const EMERGENCY_TYPE_ICONS = {
  medical: '🚑',
  cardiac_arrest: '❤️',
  fire: '🚒',
  building_fire: '🔥',
  police: '🚓',
  accident: '💥',
  road_accident: '💥',
  maternity_emergency: '👶',
  disaster: '🌊',
};

export const EMERGENCY_PRIORITY_LABELS = {
  critical: 'CRITICAL',
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
};

export const EMERGENCY_STATUS_LABELS = {
  REQUESTED: 'Requested',
  TRIAGED: 'Triaged',
  ASSIGNED: 'Assigned',
  ACCEPTED: 'Accepted',
  EN_ROUTE: 'En Route',
  REROUTING: 'AI Rerouting',
  ARRIVING: 'Arriving Soon',
  ARRIVED: 'Arrived at Scene/Bay',
  COMPLETED: 'Completed',
  pending: 'Requested',
  dispatched: 'Dispatched',
  in_progress: 'En Route',
  on_scene: 'Arrived',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
