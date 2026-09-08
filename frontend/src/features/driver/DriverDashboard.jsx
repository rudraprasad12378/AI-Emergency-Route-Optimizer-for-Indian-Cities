import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Hospital,
  Phone,
  Clock,
  Zap,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Radio,
  Play,
  RotateCw,
  Flag,
} from 'lucide-react';
import { useEmergency } from '../../hooks/useEmergency';
import { useRoute } from '../../hooks/useRoute';
import { CityMap } from '../../components/map/CityMap';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DriverNavHeader } from './DriverNavHeader';

export const DriverDashboard = () => {
  const navigate = useNavigate();
  const {
    emergencies,
    activeEmergency,
    acceptMission,
    startJourney,
    triggerReroute,
    completeEmergency,
  } = useEmergency();
  const { selectedRoute } = useRoute();

  // Pick assigned emergency or first active emergency
  const mission =
    emergencies.find((e) => e.assignedVehicleCallSign === 'AMB-101' || e.status === 'EN_ROUTE' || e.status === 'ASSIGNED' || e.status === 'ACCEPTED') ||
    activeEmergency ||
    emergencies[0];

  const status = (mission?.status || 'ASSIGNED').toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans pb-6">
      <DriverNavHeader
        vehicleCallSign={mission?.assignedVehicleCallSign || 'AMB-101'}
        status={status.toLowerCase()}
        speed={status === 'EN_ROUTE' ? 54 : status === 'ARRIVED' ? 0 : 0}
        fuel={85}
      />

      <div className="flex-1 p-3 sm:p-5 max-w-7xl mx-auto w-full space-y-4">
        {/* Top Tactical Status Beacon */}
        <div className="flex items-center justify-between bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 p-3 rounded-2xl shadow-lg shadow-emerald-950/40">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Zap className="h-5 w-5 fill-emerald-400 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-black text-emerald-300 uppercase tracking-wide">
                Tactical Priority Corridor Active
              </p>
              <p className="text-[11px] text-slate-300">
                8 smart signals cleared along Janpath corridor · Preemption Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-right">
            <span className="font-mono text-xl font-black text-emerald-400">
              {mission?.etaMinutes || 0}m
            </span>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">
              Live ETA
            </span>
          </div>
        </div>

        {/* Main Grid: Mission HUD & Live Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Mission Controls */}
          <div className="lg:col-span-5 space-y-4">
            {/* Active Mission Card */}
            <Card className="p-5 bg-slate-900/95 border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                    status === 'COMPLETED'
                      ? 'bg-slate-800 text-slate-400 border-slate-700'
                      : status === 'ARRIVED'
                      ? 'bg-blue-950 text-blue-300 border-blue-500/40'
                      : 'bg-red-950/80 text-red-300 border-red-800/60'
                  }`}>
                    {status === 'ASSIGNED' ? '🚨 NEW MISSION ASSIGNED' : status}
                  </span>
                  <h2 className="text-lg font-black text-white mt-1.5">{mission?.emergencyNumber}</h2>
                  <p className="text-xs text-slate-400 capitalize font-medium">{mission?.type?.replace('_', ' ')}</p>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black text-primary-400 font-mono block">
                    {mission?.etaMinutes || 0} <span className="text-xs">MIN</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">ETA to AIIMS</span>
                </div>
              </div>

              {/* Waypoints */}
              <div className="space-y-3 text-xs">
                <div className="rounded-xl bg-slate-950/70 p-3 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-red-400" />
                    Pickup Incident Location
                  </span>
                  <p className="font-bold text-slate-200 text-sm">{mission?.pickupLocation?.address}</p>
                  <p className="text-[11px] text-slate-400">{mission?.pickupLocation?.landmark}</p>
                </div>

                <div className="rounded-xl bg-slate-950/70 p-3 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Hospital className="h-3.5 w-3.5 text-sky-400" />
                    Receiving Hospital
                  </span>
                  <p className="font-bold text-slate-200 text-sm">{mission?.destinationHospital?.name}</p>
                  <p className="text-[11px] text-slate-400">{mission?.destinationHospital?.address}</p>
                </div>
              </div>

              {/* Live Transit Progress Bar when En Route */}
              {(status === 'EN_ROUTE' || status === 'REROUTING' || status === 'ARRIVING') && (
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-400 font-sans font-semibold">Live Route Transit</span>
                    <span className="text-emerald-400 font-bold">{mission?.distanceRemainingKm || 0} km remaining</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-primary-400 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, mission?.simulationProgress || 5)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Next Navigation Turn Banner */}
              <div className="flex items-center gap-3 bg-primary-950/40 border border-primary-500/30 p-3 rounded-xl">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white font-black">
                  <Navigation className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {status === 'ARRIVED' ? 'Arrived at AIIMS Trauma Bay' : 'In 400m · Turn Left onto Janpath Expressway'}
                  </p>
                  <p className="text-[11px] text-primary-300">
                    {status === 'ARRIVED' ? 'Handover patient to Trauma team' : 'Corridor pre-cleared by smart signal control'}
                  </p>
                </div>
              </div>

              {/* Dynamic Action Buttons based on Lifecycle State */}
              <div className="pt-2 space-y-2">
                {status === 'REQUESTED' || status === 'TRIAGED' || status === 'ASSIGNED' ? (
                  <Button
                    size="lg"
                    variant="danger"
                    className="w-full py-4 text-sm font-black uppercase tracking-wider shadow-xl shadow-red-600/30"
                    onClick={() => acceptMission(mission.id)}
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    <span>Accept Mission</span>
                  </Button>
                ) : status === 'ACCEPTED' ? (
                  <Button
                    size="lg"
                    variant="success"
                    className="w-full py-4 text-sm font-black uppercase tracking-wider shadow-xl shadow-emerald-600/30"
                    onClick={() => startJourney(mission.id)}
                  >
                    <Play className="h-5 w-5 mr-2 fill-white" />
                    <span>Start Journey (Begin Transit)</span>
                  </Button>
                ) : status === 'EN_ROUTE' || status === 'REROUTING' || status === 'ARRIVING' ? (
                  <div className="space-y-2">
                    <Button
                      size="lg"
                      variant="primary"
                      className="w-full py-3 text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700"
                      onClick={() => triggerReroute(mission.id)}
                    >
                      <RotateCw className="h-4 w-4 mr-2 text-amber-400" />
                      <span>Simulate AI Traffic Reroute</span>
                    </Button>
                    <p className="text-center text-[11px] text-emerald-400 font-bold animate-pulse">
                      ● Ambulance GPS moving along live corridor...
                    </p>
                  </div>
                ) : status === 'ARRIVED' ? (
                  <Button
                    size="lg"
                    variant="success"
                    className="w-full py-4 text-sm font-black uppercase tracking-wider shadow-xl shadow-emerald-600/30"
                    onClick={() => completeEmergency(mission.id)}
                  >
                    <Flag className="h-5 w-5 mr-2" />
                    <span>Complete Emergency (Patient Handover)</span>
                  </Button>
                ) : (
                  <div className="text-center p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 font-bold">
                    ✅ Emergency Completed · Unit is Available
                  </div>
                )}
              </div>

              {/* Quick Communication Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <a
                  href={`tel:${mission?.callerPhone}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-800/90 border border-slate-700 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Call Caller</span>
                </a>
                <a
                  href="tel:+916742530101"
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-800/90 border border-slate-700 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <Radio className="h-3.5 w-3.5 text-primary-400" />
                  <span>Radio Dispatch</span>
                </a>
              </div>
            </Card>
          </div>

          {/* Right Column: Live Map Navigation Display */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="h-[460px] sm:h-[540px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
              <CityMap />
            </div>

            {/* Turn-by-Turn Route Preview */}
            <Card className="p-4 bg-slate-900/90 border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Pre-Empted Corridor Route Itinerary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-emerald-400 font-bold block">1. Origin</span>
                  <span className="text-slate-200 font-semibold truncate block">Master Canteen Sq</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-primary-400 font-bold block">2. Flyover Corridor</span>
                  <span className="text-slate-200 font-semibold truncate block">Siripur Smart Bypass</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-sky-400 font-bold block">3. Hospital Bay</span>
                  <span className="text-slate-200 font-semibold truncate block">AIIMS Trauma Center</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
