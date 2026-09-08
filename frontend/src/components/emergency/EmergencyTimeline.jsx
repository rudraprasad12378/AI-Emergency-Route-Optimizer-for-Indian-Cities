import React from 'react';
import { CheckCircle2, Clock, MapPin, Truck, Flag } from 'lucide-react';

export const EmergencyTimeline = ({ emergency }) => {
  const steps = [
    { label: 'Call Logged & Triaged', time: '21:42', completed: true, icon: CheckCircle2 },
    { label: 'Unit Assigned (AMB-101)', time: '21:44', completed: true, icon: Truck },
    { label: 'Green Corridor Signal Sync', time: '21:45', completed: emergency?.greenCorridorActive, icon: Flag },
    { label: 'En Route to Scene', time: '21:48', completed: emergency?.status !== 'assigned', icon: MapPin },
    { label: 'Hospital Handover', time: 'ETA +6m', completed: emergency?.status === 'completed', icon: Clock },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Operations Timeline</h4>
      <div className="relative pl-6 space-y-4 border-l border-slate-800">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative">
              <span
                className={`absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                  step.completed
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                    : 'border-slate-700 bg-slate-900 text-slate-500'
                }`}
              >
                <Icon className="h-3 w-3" />
              </span>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${step.completed ? 'text-slate-200' : 'text-slate-500'}`}>
                  {step.label}
                </span>
                <span className="font-mono text-[11px] text-slate-500">{step.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmergencyTimeline;
