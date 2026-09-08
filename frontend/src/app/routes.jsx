import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layout
import { AppLayout } from '../components/layout/AppLayout';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';

// Dashboard / Control Center
import { ControlCenter } from '../pages/dashboard/ControlCenter';

// Emergencies
import { ActiveEmergencies } from '../pages/emergency/ActiveEmergencies';
import { EmergencyDetails } from '../pages/emergency/EmergencyDetails';
import { NewEmergency } from '../pages/emergency/NewEmergency';

// Incidents
import { Incidents } from '../pages/incidents/Incidents';
import { IncidentDetails } from '../pages/incidents/IncidentDetails';
import { NewIncident } from '../pages/incidents/NewIncident';

// Routes
import { RouteDetails } from '../pages/routes/RouteDetails';

// Vehicles
import { Vehicles } from '../pages/vehicles/Vehicles';
import { VehicleDetails } from '../pages/vehicles/VehicleDetails';

// Stations
import { Stations } from '../pages/stations/Stations';

// Predictions
import { Predictions } from '../pages/predictions/Predictions';

// Analytics
import { Analytics } from '../pages/analytics/Analytics';

// Notifications
import { Notifications } from '../pages/notifications/Notifications';

// Admin
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { Users } from '../pages/admin/Users';
import { VehicleManagement } from '../pages/admin/VehicleManagement';
import { StationManagement } from '../pages/admin/StationManagement';
import { AIConfiguration } from '../pages/admin/AIConfiguration';
import { APIConfiguration } from '../pages/admin/APIConfiguration';
import { SystemLogs } from '../pages/admin/SystemLogs';
import { SystemSettings } from '../pages/admin/SystemSettings';

// Settings
import { Settings } from '../pages/settings/Settings';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <ControlCenter />,
      },
      {
        path: 'emergencies',
        children: [
          { index: true, element: <ActiveEmergencies /> },
          { path: 'new', element: <NewEmergency /> },
          { path: ':id', element: <EmergencyDetails /> },
        ],
      },
      {
        path: 'incidents',
        children: [
          { index: true, element: <Incidents /> },
          { path: 'new', element: <NewIncident /> },
          { path: ':id', element: <IncidentDetails /> },
        ],
      },
      {
        path: 'routes',
        children: [
          { index: true, element: <RouteDetails /> },
          { path: ':id', element: <RouteDetails /> },
        ],
      },
      {
        path: 'vehicles',
        children: [
          { index: true, element: <Vehicles /> },
          { path: ':id', element: <VehicleDetails /> },
        ],
      },
      {
        path: 'stations',
        element: <Stations />,
      },
      {
        path: 'predictions',
        element: <Predictions />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'admin',
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'users', element: <Users /> },
          { path: 'vehicles', element: <VehicleManagement /> },
          { path: 'stations', element: <StationManagement /> },
          { path: 'ai', element: <AIConfiguration /> },
          { path: 'api', element: <APIConfiguration /> },
          { path: 'logs', element: <SystemLogs /> },
          { path: 'settings', element: <SystemSettings /> },
        ],
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
