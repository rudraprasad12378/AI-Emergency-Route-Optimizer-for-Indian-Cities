import React from 'react';
import { Layers, Eye, RefreshCw, ZoomIn, ZoomOut, Navigation } from 'lucide-react';
import { useMapStore } from '../../store/mapStore';

export const MapControls = () => {
  const { layers, toggleLayer, mapTheme, setMapTheme, setCenter } = useMapStore();

  const resetToBhubaneswar = () => {
    setCenter([20.2961, 85.8245]);
  };

  return (
    <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
      {/* Quick Recenter */}
      <button
        onClick={resetToBhubaneswar}
        title="Recenter City Command"
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 shadow-xl backdrop-blur-md transition-all hover:bg-slate-800 hover:text-white"
      >
        <Navigation className="h-4 w-4" />
      </button>

      {/* Layer Visibility Toggles */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-700/80 p-1.5 shadow-xl backdrop-blur-md space-y-1">
        <button
          onClick={() => toggleLayer('greenCorridors')}
          title="Toggle Green Corridors"
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all ${
            layers.greenCorridors
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'text-slate-500 hover:bg-slate-800'
          }`}
        >
          GC
        </button>

        <button
          onClick={() => toggleLayer('trafficHeatmap')}
          title="Toggle Traffic Congestion"
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all ${
            layers.trafficHeatmap
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'text-slate-500 hover:bg-slate-800'
          }`}
        >
          TF
        </button>

        <button
          onClick={() => toggleLayer('riskZones')}
          title="Toggle Waterlogging & Hazard Risk Zones"
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all ${
            layers.riskZones
              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
              : 'text-slate-500 hover:bg-slate-800'
          }`}
        >
          RZ
        </button>
      </div>
    </div>
  );
};

export default MapControls;
