import React from 'react';

export const EmergencyStatus = ({ status = 'pending', className = '' }) => {
  const styles = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    assigned: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    dispatched: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    in_progress: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    completed: 'bg-slate-800 text-slate-400 border-slate-700',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider
        ${styles[status] || styles.pending} ${className}
      `}
    >
      {status.replace('_', ' ')}
    </span>
  );
};

export default EmergencyStatus;
