import React from 'react';

export const EmergencyPriorityBadge = ({ severity = 'medium', className = '' }) => {
  const styles = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse',
    high: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider
        ${styles[severity] || styles.medium} ${className}
      `}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {severity} Priority
    </span>
  );
};

export default EmergencyPriorityBadge;
