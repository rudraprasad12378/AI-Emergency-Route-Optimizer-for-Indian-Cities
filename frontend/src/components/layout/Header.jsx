import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  Radio,
  Clock,
  CloudRain,
  ShieldAlert,
  Zap,
  Menu,
  ChevronDown,
  User,
  Truck,
  HeartHandshake,
  Hospital,
  Shield,
  Siren,
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useEmergency } from '../../hooks/useEmergency';
import { useAuth } from '../../hooks/useAuth';
import { weatherApi } from '../../services/weatherApi';

export const Header = ({ onToggleSidebar }) => {
  const { unreadCount } = useNotifications();
  const { activeEmergency } = useEmergency();
  const { user, role, switchRole } = useAuth();
  const navigate = useNavigate();

  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [weather, setWeather] = useState(null);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    weatherApi.getCurrentWeather().then(setWeather);
    return () => clearInterval(timer);
  }, []);

  const roles = [
    { id: 'dispatcher', label: 'Dispatcher Deck', path: '/', icon: Siren, color: 'text-red-400' },
    { id: 'driver', label: 'Ambulance Driver', path: '/driver', icon: Truck, color: 'text-amber-400' },
    { id: 'citizen', label: 'Citizen Portal', path: '/citizen', icon: HeartHandshake, color: 'text-pink-400' },
    { id: 'hospital', label: 'Hospital Trauma Bay', path: '/hospital', icon: Hospital, color: 'text-sky-400' },
    { id: 'admin', label: 'Admin Command', path: '/admin', icon: Shield, color: 'text-purple-400' },
  ];

  const handleRoleSelect = (roleItem) => {
    switchRole(roleItem.id);
    setRoleMenuOpen(false);
    navigate(roleItem.path);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 sm:px-6 backdrop-blur-xl">
      {/* Left items: Toggle & Active incident indicator */}
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
              Live AI Routing Engine
            </span>
          </div>

          {activeEmergency && (
            <div className="hidden md:flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1">
              <ShieldAlert className="h-3.5 w-3.5 text-red-400 animate-bounce" />
              <span className="text-[11px] font-semibold text-red-300">
                Active Priority: {activeEmergency.emergencyNumber} (ETA {activeEmergency.etaMinutes}m)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right telemetry & Role Switcher */}
      <div className="flex items-center gap-3">
        {weather && (
          <div className="hidden xl:flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
            <CloudRain className="h-3.5 w-3.5 text-sky-400" />
            <span>{weather.temperature}°C</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{weather.condition}</span>
          </div>
        )}

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-semibold text-slate-300 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
          <Clock className="h-3.5 w-3.5 text-primary-400" />
          <span>{time} IST</span>
        </div>

        {/* Dynamic Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <span className="h-2 w-2 rounded-full bg-primary-400" />
            <span className="capitalize">{role || 'Dispatcher'}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Switch Active Role
              </p>
              {roles.map((r) => {
                const Icon = r.icon;
                const isCurrent = role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleRoleSelect(r)}
                    className={`
                      flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors text-left
                      ${isCurrent ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30' : 'text-slate-300 hover:bg-slate-800'}
                    `}
                  >
                    <Icon className={`h-4 w-4 ${r.color}`} />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/notifications')}
          className="relative rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-lg">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
