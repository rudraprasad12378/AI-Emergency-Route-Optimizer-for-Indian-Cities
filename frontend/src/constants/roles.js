// Role constants
export const ROLES = ['admin', 'dispatcher', 'operator', 'driver'];

export const ROLE_LABELS = {
  admin: 'Administrator',
  dispatcher: 'Dispatcher',
  operator: 'Operator',
  driver: 'Driver',
};

export const ROLE_PERMISSIONS = {
  admin: ['manage_users', 'manage_vehicles', 'manage_stations', 'manage_settings', 'create_emergency', 'view_analytics', 'manage_incidents'],
  dispatcher: ['create_emergency', 'manage_incidents', 'view_analytics', 'manage_vehicles'],
  operator: ['create_emergency', 'view_analytics', 'report_incident'],
  driver: ['view_emergency', 'update_status', 'report_incident'],
};
