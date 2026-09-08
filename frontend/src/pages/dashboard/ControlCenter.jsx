import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Siren,
  Plus,
  AlertTriangle,
  Zap,
  Radio,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useEmergency } from '../../hooks/useEmergency';
import { useIncidents } from '../../hooks/useIncidents';
import { useRoute } from '../../hooks/useRoute';
import { useVehicleTracking } from '../../hooks/useVehicleTracking';

import { CityMap } from '../../components/map/CityMap';
import { EmergencyCard } from '../../components/emergency/EmergencyCard';
import { EmergencySummary } from '../../components/emergency/EmergencySummary';
import { RouteExplanation } from '../../components/route/RouteExplanation';
import { RouteMetrics } from '../../components/route/RouteMetrics';
import { RerouteDialog } from '../../components/route/RerouteDialog';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const ControlCenter = () => {
  const navigate = useNavigate();
  const { emergencies, activeEmergency, setActiveEmergencyId, toggleGreenCorridor } = useEmergency();
  const { incidents } = useIncidents();
  const { routes, selectedRoute, calculateAlternativeRoute, isRerouting } = useRoute();
  const { vehicles } = useVehicleTracking();

  const [isRerouteOpen, setIsRerouteOpen] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);

  const handleTriggerReroute = async () => {
    if (activeEmergency) {
      await calculateAlternativeRoute(activeEmergency.id);
      setIsRerouteOpen(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-3 sm:p-5 gap-4">
      {/* Top Tactical Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
        <Card className="p-3 bg-slate-900/80 border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Dispatches</span>
            <span className="text-xl font-black text-red-400 font-mono">{emergencies.length}</span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400">
            <Siren className="h-4 w-4 animate-pulse" />
          </div>
        </Card>

        <Card className="p-3 bg-slate-900/80 border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Green Corridors</span>
            <span className="text-xl font-black text-emerald-400 font-mono">
              {emergencies.filter((e) => e.greenCorridorActive).length} Active
            </span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
            <Zap className="h-4 w-4" />
          </div>
        </Card>

        <Card className="p-3 bg-slate-900/80 border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fleet Ready</span>
            <span className="text-xl font-black text-primary-400 font-mono">
              {vehicles.filter((v) => v.status === 'available').length} / {vehicles.length}
            </span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-primary-950/60 border border-primary-800/50 flex items-center justify-center text-primary-400">
            <Radio className="h-4 w-4" />
          </div>
        </Card>

        <div className="flex items-center gap-2">
          <Button
            size="lg"
            variant="danger"
            className="w-full h-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-500/20"
            onClick={() => navigate('/emergencies/new')}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Emergency
          </Button>
        </div>
      </div>

      {/* Main Command Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Left Feed: Live Incidents & Emergencies (hidden if map expanded) */}
        {!mapExpanded && (
          <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto pr-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Priority Incident Queue ({emergencies.length})
              </h3>
            </div>

            <div className="space-y-2.5">
              {emergencies.map((emg) => (
                <EmergencyCard
                  key={emg.id}
                  emergency={emg}
                  isSelected={emg.id === activeEmergency?.id}
                  onClick={() => setActiveEmergencyId(emg.id)}
                />
              ))}
            </div>

            {/* AI Selected Route Rationale */}
            {selectedRoute && (
              <div className="mt-2">
                <RouteExplanation route={selectedRoute} />
              </div>
            )}
          </div>
        )}

        {/* Center / Right: Live GIS Map + Active Mission Controls */}
        <div className={`${mapExpanded ? 'lg:col-span-12' : 'lg:col-span-8'} flex flex-col gap-3 min-h-[450px]`}>
          {/* Map Container */}
          <div className="relative flex-1 rounded-2xl overflow-hidden min-h-[360px]">
            <CityMap
              onVehicleClick={(veh) => navigate(`/vehicles/${veh.id}`)}
              onIncidentClick={(inc) => navigate(`/incidents/${inc.id}`)}
            />

            {/* Expand / Collapse Button */}
            <button
              onClick={() => setMapExpanded(!mapExpanded)}
              title={mapExpanded ? 'Split View' : 'Expand Map'}
              className="absolute top-4 left-4 z-[400] flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 shadow-xl backdrop-blur-md hover:text-white"
            >
              {mapExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>

          {/* Active Mission Dashboard Strip */}
          {activeEmergency && (
            <div className="shrink-0">
              <EmergencySummary
                emergency={activeEmergency}
                onToggleGreenCorridor={() => toggleGreenCorridor(activeEmergency.id)}
                onReroute={() => setIsRerouteOpen(true)}
              />
            </div>
          )}

          {/* Selected Route Quick Metrics */}
          {selectedRoute && (
            <div className="shrink-0">
              <RouteMetrics route={selectedRoute} />
            </div>
          )}
        </div>
      </div>

      {/* Dynamic AI Reroute Confirmation Modal */}
      <RerouteDialog
        isOpen={isRerouteOpen}
        onClose={() => setIsRerouteOpen(false)}
        onConfirm={handleTriggerReroute}
        isCalculating={isRerouting}
      />
    </div>
  );
};

export default ControlCenter;
