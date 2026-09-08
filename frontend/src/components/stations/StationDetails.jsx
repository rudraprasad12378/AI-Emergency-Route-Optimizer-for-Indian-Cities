import React from 'react';
import { Building2, Phone, MapPin, Truck, Shield } from 'lucide-react';
import { Card } from '../ui/Card';

export const StationDetails = ({ station }) => {
  if (!station) return null;

  return (
    <Card className="border-slate-800 bg-slate-900/90 space-y-4">
      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded">
            {station.type} Station
          </span>
          <h3 className="text-base font-extrabold text-white mt-1">{station.name}</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Radius: {station.coverageRadiusKm} km</span>
      </div>

      <div className="space-y-2 text-xs text-slate-300">
        <div className="flex items-start gap-2">
          <MapPin className="h-3.5 w-3.5 text-sky-400 shrink-0 mt-0.5" />
          <span>{station.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-sky-400 shrink-0" />
          <span className="font-mono">{station.contactNumber}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Available Ambulances</span>
          <span className="text-lg font-black text-emerald-400 font-mono">{station.availableAmbulances} / {station.totalAmbulances}</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Available Fire Tenders</span>
          <span className="text-lg font-black text-amber-400 font-mono">{station.availableFireTenders} / {station.totalFireTenders}</span>
        </div>
      </div>
    </Card>
  );
};

export default StationDetails;
