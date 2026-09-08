import React from 'react';

const variantClasses = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  safe: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  info: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  inactive: 'bg-slate-800 text-slate-400 border-slate-700',
};

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2.5 py-0.5 text-xs',
};

export const Badge = ({
  children,
  variant = 'info',
  size = 'md',
  icon,
  pulse = false,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-semibold rounded-full border
        ${variantClasses[variant] || variantClasses.info}
        ${sizeClasses[size] || sizeClasses.md}
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
