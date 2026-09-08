import React from 'react';

export const VehicleStatus = ({ status = 'available', className = '' }) => {
  const styles = {
    available: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    en_route: 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse',
    on_scene: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    maintenance: 'bg-slate-800 text-slate-500 border-slate-700',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider
        ${styles[status] || styles.available} ${className}
      `}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.replace('_', ' ')}
    </span>
  );
};

export default VehicleStatus;
