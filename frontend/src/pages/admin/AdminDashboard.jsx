import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Truck, Building2, BrainCircuit, Terminal, Settings as SettingsIcon, Database } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminModules = [
    { title: 'User & Role Access', desc: 'Manage operators, dispatchers, and field medics', path: '/admin/users', icon: Users },
    { title: 'Fleet Assets', desc: 'Vehicle configuration, GPS devices, maintenance logs', path: '/admin/vehicles', icon: Truck },
    { title: 'Station Infrastructure', desc: 'Manage base hubs, contact numbers, coverage zones', path: '/admin/stations', icon: Building2 },
    { title: 'AI Model Tuning', desc: 'Configure rerouting thresholds, congestion weights', path: '/admin/ai', icon: BrainCircuit },
    { title: 'API Integrations', desc: 'City CCTV feeds, Google Traffic, Weather APIs', path: '/admin/api', icon: Database },
    { title: 'System Logs', desc: 'Audit trails, telemetry payloads, security events', path: '/admin/logs', icon: Terminal },
  ];

  return (
    <PageContainer
      title="Admin Command & Infrastructure"
      subtitle="System configurations, user management, and AI engine parameters"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminModules.map((mod, idx) => {
          const Icon = mod.icon;
          return (
            <Card
              key={idx}
              onClick={() => navigate(mod.path)}
              className="cursor-pointer hover:border-primary-500 hover:bg-slate-900/80 transition-all p-5 space-y-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-primary-400">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{mod.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{mod.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
};

export default AdminDashboard;
