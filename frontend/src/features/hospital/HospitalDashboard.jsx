import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Hospital,
  Heart,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  User,
  Bed,
  Phone,
  ShieldAlert,
  Navigation,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useEmergency } from '../../hooks/useEmergency';
import { CityMap } from '../../components/map/CityMap';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const HospitalDashboard = () => {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const { emergencies, completeEmergency } = useEmergency();

  const [bayReady, setBayReady] = useState(true);
  const [cardioReady, setCardioReady] = useState(true);
  const [bloodReady, setBloodReady] = useState(true);

  // Incoming emergencies destined for AIIMS or actively in transit
  const incomingList = emergencies.filter(
    (e) => e.status !== 'COMPLETED' && e.status !== 'CANCELLED'
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans pb-8">
      {/* Hospital Command Header */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/30">
            <Hospital className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white">AIIMS Bhubaneswar · Emergency Trauma Deck</h1>
            <p className="text-[11px] text-slate-400 truncate">
              Dr. Anuradha Mishra · Receiving Hub Lead
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>3 Trauma Bays Operational</span>
          </div>

          {/* Role Switcher */}
          <button
            onClick={() => {
              switchRole('dispatcher');
              navigate('/');
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all"
          >
            <span>Role: Hospital</span>
            <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-400">Switch</span>
          </button>
        </div>
      </header>

      <div className="flex-1 p-3 sm:p-5 max-w-7xl mx-auto w-full space-y-5">
        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-3.5 bg-slate-900/90 border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Incoming Ambulances</span>
            <span className="text-2xl font-black text-white font-mono">{incomingList.length}</span>
          </Card>

          <Card className="p-3.5 bg-slate-900/90 border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Critical Code Red</span>
            <span className="text-2xl font-black text-red-400 font-mono">
              {incomingList.filter((e) => e.severity === 'critical').length}
            </span>
          </Card>

          <Card className="p-3.5 bg-slate-900/90 border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fastest Inbound ETA</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {incomingList[0]?.etaMinutes || 0} mins
            </span>
          </Card>

          <Card className="p-3.5 bg-slate-900/90 border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trauma Bay 1</span>
            <span className="text-sm font-black text-sky-400 block mt-1">
              {bayReady ? '✓ Prepped & Ready' : 'Standby'}
            </span>
          </Card>
        </div>

        {/* Main Grid: Incoming Queue & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Incoming Emergencies List & Bay Readiness */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Inbound Emergency Triage Feed ({incomingList.length})
            </h2>

            <div className="space-y-3">
              {incomingList.length === 0 ? (
                <Card className="p-6 bg-slate-900/60 border-slate-800 text-center text-xs text-slate-400">
                  No active inbound emergency transports at this moment. Trauma bays on standby.
                </Card>
              ) : (
                incomingList.map((emg) => {
                  const isArrived = emg.status === 'ARRIVED';
                  const isArriving = emg.status === 'ARRIVING';
                  const isEnRoute = emg.status === 'EN_ROUTE' || emg.status === 'REROUTING';

                  return (
                    <Card
                      key={emg.id}
                      className={`p-4 bg-slate-900/90 border-l-4 space-y-3 ${
                        isArrived
                          ? 'border-l-blue-500 bg-blue-950/20'
                          : isArriving
                          ? 'border-l-emerald-400 bg-emerald-950/20 animate-pulse'
                          : 'border-l-red-500'
                      }`}
                    >
                      {/* Arrival Alert Banner */}
                      {isArrived && (
                        <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 p-2 rounded-lg text-xs font-extrabold text-blue-300">
                          <CheckCircle2 className="h-4 w-4 text-blue-400" />
                          <span>AMBULANCE ARRIVED AT DESTINATION · TRAUMA BAY 1 DOCKED</span>
                        </div>
                      )}

                      {isArriving && (
                        <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 p-2 rounded-lg text-xs font-extrabold text-emerald-300">
                          <Zap className="h-4 w-4 text-emerald-400 fill-emerald-400" />
                          <span>🚑 {emg.assignedVehicleCallSign || 'AMB-101'} ARRIVING SOON · ETA 2 MIN</span>
                        </div>
                      )}

                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-white">{emg.emergencyNumber}</span>
                            <span className="rounded bg-red-950/80 border border-red-800/60 px-2 py-0.2 text-[10px] font-extrabold uppercase text-red-300">
                              {emg.type.replace('_', ' ')}
                            </span>
                            <span className="rounded bg-slate-800 px-2 py-0.2 text-[10px] font-bold text-slate-300 uppercase">
                              Status: {emg.status}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-200 mt-1">
                            Assigned Unit: <strong className="text-white font-mono">{emg.assignedVehicleCallSign || 'Awaiting Unit'}</strong>
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-2xl font-black text-red-400 font-mono block">
                            {emg.etaMinutes || 0}m
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated Arrival</span>
                        </div>
                      </div>

                      {/* Live transit progress bar */}
                      {(isEnRoute || isArriving) && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-slate-400">
                            <span>Corridor Transit</span>
                            <span className="text-emerald-400 font-bold">{emg.distanceRemainingKm || 0} km remaining</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-primary-400 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(5, emg.simulationProgress || 10)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800 text-xs space-y-1">
                        <p className="text-slate-300">
                          <strong>Triage Description:</strong> {emg.description || 'Cardiac distress requiring immediate resuscitation.'}
                        </p>
                        <p className="text-slate-400"><strong>Pickup Origin:</strong> {emg.pickupLocation?.address}</p>
                      </div>

                      {/* Bay Preparation Toggles */}
                      <div className="border-t border-slate-800 pt-3 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Trauma Bay Checklist & Preparation:
                        </span>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <button
                            onClick={() => setBayReady(!bayReady)}
                            className={`p-2 rounded-lg border text-center font-bold transition-all ${
                              bayReady ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-500'
                            }`}
                          >
                            ✓ Bay 1 Ready
                          </button>

                          <button
                            onClick={() => setCardioReady(!cardioReady)}
                            className={`p-2 rounded-lg border text-center font-bold transition-all ${
                              cardioReady ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-500'
                            }`}
                          >
                            ✓ Cardio Team
                          </button>

                          <button
                            onClick={() => setBloodReady(!bloodReady)}
                            className={`p-2 rounded-lg border text-center font-bold transition-all ${
                              bloodReady ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-500'
                            }`}
                          >
                            {bloodReady ? '✓ O- Blood Prepped' : '+ Prep Blood'}
                          </button>
                        </div>
                      </div>

                      {/* Reception Handover */}
                      <div className="pt-2 flex items-center justify-between">
                        <a
                          href="tel:+919437011223"
                          className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>Call Paramedic</span>
                        </a>

                        <Button
                          size="sm"
                          variant={isArrived ? 'success' : 'primary'}
                          onClick={() => completeEmergency(emg.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1.5" />
                          {isArrived ? 'Confirm Patient Arrival & Handover' : 'Record Handover'}
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Live Approach Map */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Inbound Ambulance Route Approach
            </h2>
            <div className="h-[460px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <CityMap />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
