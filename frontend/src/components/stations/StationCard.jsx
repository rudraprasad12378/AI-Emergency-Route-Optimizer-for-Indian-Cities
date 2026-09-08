import React from 'react';
import { Building2, Phone, MapPin, Truck } from 'lucide-react';
import { Card } from '../ui/Card';

export const StationCard = ({ station, isSelected = false, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className={`
        cursor-pointer transition-all border-l-4 border-l-sky-500
        ${isSelected ? 'border-primary-500 bg-slate-800/80 shadow-lg' : 'hover:bg-slate-900/80'}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
            {station.type} Base
          </span>
          <h4 className="text-sm font-bold text-slate-100 mt-1.5">{station.name}</h4>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
          ● {station.status}
        </span>
      </div>

      <div className="mt-3 flex items-start gap-2 text-xs text-slate-400">
        <MapPin className="h-3.5 w-3.5 text-sky-400 shrink-0 mt-0.5" />
        <span className="truncate">{station.address}</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-2.5 text-xs text-slate-300">
        <div className="flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5 text-primary-400" />
          <span>Ambulances: <strong>{station.availableAmbulances}/{station.totalAmbulances}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5 text-red-400" />
          <span>Fire: <strong>{station.availableFireTenders}/{station.totalFireTenders}</strong></span>
        </div>
      </div>
    </Card>
  );
};

export default StationCard;
