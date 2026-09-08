import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Radio,
  Clock,
  CloudRain,
  ShieldAlert,
  Zap,
  Menu,
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useEmergency } from '../../hooks/useEmergency';
import { weatherApi } from '../../services/weatherApi';

export const Header = ({ onToggleSidebar }) => {
  const { unreadCount } = useNotifications();
  const { activeEmergency } = useEmergency();
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    weatherApi.getCurrentWeather().then(setWeather);
    return () => clearInterval(timer);
  }, []);

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

      {/* Right telemetry indicators */}
      <div className="flex items-center gap-4">
        {weather && (
          <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
            <CloudRain className="h-3.5 w-3.5 text-sky-400" />
            <span>{weather.temperature}°C</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{weather.condition}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-300 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
          <Clock className="h-3.5 w-3.5 text-primary-400" />
          <span>{time} IST</span>
        </div>

        <button
          onClick={() => window.location.href = '/notifications'}
          className="relative rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100"
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
