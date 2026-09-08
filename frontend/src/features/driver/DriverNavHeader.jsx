import React from 'react';
import { Truck, Radio, BatteryCharging, Gauge, ArrowLeft, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const DriverNavHeader = ({ vehicleCallSign = 'AMB-101', status = 'en_route', speed = 48, fuel = 85 }) => {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white font-black shadow-lg shadow-red-600/30">
          🚑
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-white font-mono tracking-tight">{vehicleCallSign}</h1>
            <span className="rounded-full bg-red-500/20 border border-red-500/40 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-red-400 animate-pulse">
              Emergency Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium truncate">
            Pilot: {user?.name || 'Subhash Jena'} · Capital Response Hub
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
          <div className="flex items-center gap-1 text-slate-300">
            <Gauge className="h-3.5 w-3.5 text-primary-400" />
            <span>{speed} km/h</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1 text-emerald-400">
            <BatteryCharging className="h-3.5 w-3.5" />
            <span>{fuel}%</span>
          </div>
        </div>

        {/* Quick Role Switcher Button */}
        <button
          onClick={() => {
            switchRole('dispatcher');
            navigate('/');
          }}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
        >
          <span>Role: Driver</span>
          <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-400">Switch</span>
        </button>
      </div>
    </header>
  );
};

export default DriverNavHeader;
