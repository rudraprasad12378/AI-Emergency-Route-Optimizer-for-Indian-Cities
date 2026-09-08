export const mockUsers = [
  {
    id: 'user-001',
    name: 'Dr. Rajesh Kumar',
    email: 'admin@ero.gov.in',
    role: 'admin',
    phone: '+91 98765 43210',
    station: 'Central Command',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'user-002',
    name: 'Priya Patel',
    email: 'dispatcher@ero.gov.in',
    role: 'dispatcher',
    phone: '+91 98765 43211',
    station: 'Bhubaneswar Control Center',
    createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'user-003',
    name: 'Amit Singh',
    email: 'operator@ero.gov.in',
    role: 'operator',
    phone: '+91 98765 43212',
    station: 'Saheed Nagar Station',
    createdAt: '2025-03-15T10:00:00Z',
  },
];

// Default user for mock login
export const DEFAULT_USER = mockUsers[0];

// Simple password for demo (not real auth)
export const DEMO_PASSWORD = 'admin123';
