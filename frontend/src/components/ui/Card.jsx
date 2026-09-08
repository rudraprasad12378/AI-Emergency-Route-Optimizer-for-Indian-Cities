import React from 'react';

const glowClasses = {
  critical: 'emergency-glow-critical',
  high: 'emergency-glow-high',
  warning: 'emergency-glow-warning',
  safe: 'emergency-glow-safe',
  none: '',
};

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = ({
  children,
  className = '',
  glow = 'none',
  padding = 'md',
  onClick,
  hoverable = false,
}) => {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      className={`
        bg-slate-900/90 border border-slate-800 rounded-xl
        ${glowClasses[glow] || ''}
        ${paddingClasses[padding] || 'p-4'}
        ${hoverable || onClick ? 'hover:bg-slate-800/80 hover:border-slate-700 cursor-pointer transition-colors duration-150' : ''}
        ${onClick ? 'text-left w-full' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
};

export default Card;
