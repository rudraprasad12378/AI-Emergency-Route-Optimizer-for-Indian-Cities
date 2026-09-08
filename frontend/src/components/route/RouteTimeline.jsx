import React from 'react';
import { MapPin, Navigation, Flag, CheckCircle } from 'lucide-react';

export const RouteTimeline = ({ route }) => {
  if (!route) return null;

  const waypoints = [
    { name: 'Incident Pickup Origin', distance: '0.0 km', eta: '0m', passed: true },
    { name: 'Janpath Express Corridor', distance: '3.2 km', eta: '4m', passed: true },
    { name: 'Siripur Smart Junction (Signal Cleared)', distance: '6.8 km', eta: '8m', passed: false },
    { name: 'Destination Hospital Trauma Bay', distance: `${route.distanceKm} km`, eta: `${route.estimatedDurationMin}m`, passed: false },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Route Waypoint Trajectory</h4>
      <div className="relative pl-6 space-y-4 border-l border-slate-800">
        {waypoints.map((wp, idx) => (
          <div key={idx} className="relative">
            <span
              className={`absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                wp.passed
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                  : 'border-slate-700 bg-slate-900 text-slate-500'
              }`}
            >
              {wp.passed ? <CheckCircle className="h-3 w-3" /> : <Navigation className="h-3 w-3" />}
            </span>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-200">{wp.name}</p>
                <p className="text-[10px] text-slate-500 font-mono">{wp.distance}</p>
              </div>
              <span className="font-mono text-xs font-bold text-primary-400">{wp.eta}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteTimeline;
