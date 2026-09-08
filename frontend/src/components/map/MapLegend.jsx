import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Info } from 'lucide-react';

export const MapLegend = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute bottom-6 right-4 z-[400] max-w-xs rounded-xl bg-slate-900/90 border border-slate-700/80 p-3 shadow-2xl backdrop-blur-md text-xs">
      <div
        className="flex items-center justify-between gap-4 cursor-pointer font-bold text-slate-200 uppercase tracking-wider text-[11px]"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-primary-400" />
          <span>GIS Tactical Overlay</span>
        </div>
        <button className="text-slate-400 hover:text-white">
          {collapsed ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-2.5 space-y-2 border-t border-slate-800 pt-2 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50" />
              Green Corridor (Preempted)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
              Active Emergency Vehicle
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
              Bottleneck / Risk Zone
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-500/50" />
              Station / Trauma Hospital
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLegend;
