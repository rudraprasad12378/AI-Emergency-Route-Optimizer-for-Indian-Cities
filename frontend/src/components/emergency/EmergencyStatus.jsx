import React from 'react';
import { EMERGENCY_STATUS_LABELS } from '../../constants/emergency';

export const EmergencyStatus = ({ status = 'REQUESTED', className = '' }) => {
  const normStatus = (status || '').toUpperCase();

  const styles = {
    REQUESTED: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse',
    PENDING: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    TRIAGED: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    ASSIGNED: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    ACCEPTED: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    DISPATCHED: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    EN_ROUTE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse',
    IN_PROGRESS: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse',
    REROUTING: 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-bounce',
    ARRIVING: 'bg-teal-500/20 text-teal-300 border-teal-500/40 animate-pulse',
    ARRIVED: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    ON_SCENE: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    COMPLETED: 'bg-slate-800 text-slate-400 border-slate-700',
    CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const label = EMERGENCY_STATUS_LABELS[normStatus] || EMERGENCY_STATUS_LABELS[status] || status.replace(/_/g, ' ');

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider
        ${styles[normStatus] || styles.REQUESTED} ${className}
      `}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
};

export default EmergencyStatus;
