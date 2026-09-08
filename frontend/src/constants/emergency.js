// Emergency type constants
export const EMERGENCY_TYPES = ['medical', 'fire', 'police', 'accident', 'disaster'];
export const EMERGENCY_PRIORITIES = ['critical', 'high', 'medium', 'low'];
export const EMERGENCY_STATUSES = ['pending', 'dispatched', 'en_route', 'on_scene', 'returning', 'completed', 'cancelled'];

export const EMERGENCY_TYPE_LABELS = {
  medical: 'Medical Emergency',
  fire: 'Fire Emergency',
  police: 'Police Emergency',
  accident: 'Road Accident',
  disaster: 'Natural Disaster',
};

export const EMERGENCY_TYPE_ICONS = {
  medical: '🚑',
  fire: '🚒',
  police: '🚓',
  accident: '💥',
  disaster: '🌊',
};

export const EMERGENCY_PRIORITY_LABELS = {
  critical: 'CRITICAL',
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
};

export const EMERGENCY_STATUS_LABELS = {
  pending: 'Pending',
  dispatched: 'Dispatched',
  en_route: 'En Route',
  on_scene: 'On Scene',
  returning: 'Returning',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
