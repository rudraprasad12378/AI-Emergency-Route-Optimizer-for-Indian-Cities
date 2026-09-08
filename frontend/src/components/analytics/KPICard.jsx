import React from 'react';
import { Card } from '../ui/Card';

export const KPICard = ({ title, value, unit, change, isPositive = true, icon: Icon, className = '' }) => {
  return (
    <Card className={`p-4 bg-slate-900/90 border-slate-800 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-primary-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-black text-white font-mono">{value}</span>
        {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
      </div>

      {change && (
        <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold">
          <span className={isPositive ? 'text-emerald-400' : 'text-red-400'}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
          <span className="text-slate-500">vs city baseline</span>
        </div>
      )}
    </Card>
  );
};

export default KPICard;
