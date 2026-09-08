import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Siren,
  PhoneCall,
  MapPin,
  Heart,
  Flame,
  Car,
  Baby,
  Activity,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useEmergency } from '../../hooks/useEmergency';
import { CityMap } from '../../components/map/CityMap';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const CitizenDashboard = () => {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const { emergencies, activeEmergency, createEmergency } = useEmergency();

  const [selectedType, setSelectedType] = useState('cardiac_arrest');
  const [currentAddress, setCurrentAddress] = useState('Master Canteen Square, Railway Station Area, Bhubaneswar');
  const [description, setDescription] = useState('Severe chest pain and sudden shortness of breath');

  // Check if there is an active emergency associated with citizen or created recently
  const activeSosEmergency = emergencies.find(
    (e) => e.status !== 'COMPLETED' && e.status !== 'CANCELLED'
  );

  const emergencyTypes = [
    { id: 'cardiac_arrest', label: 'Heart / Stroke / Medical', icon: Heart, color: 'text-red-400 bg-red-950/60 border-red-800/60' },
    { id: 'road_accident', label: 'Severe Road Crash', icon: Car, color: 'text-amber-400 bg-amber-950/60 border-amber-800/60' },
    { id: 'building_fire', label: 'Fire / Burn Emergency', icon: Flame, color: 'text-orange-400 bg-orange-950/60 border-orange-800/60' },
    { id: 'maternity_emergency', label: 'Maternity / Acute Labor', icon: Baby, color: 'text-sky-400 bg-sky-950/60 border-sky-800/60' },
  ];

  const handleTriggerSos = () => {
    createEmergency({
      type: selectedType,
      severity: 'critical',
      callerName: user?.name || 'Ramesh Mohanty',
      callerPhone: user?.phone || '+91 98610 23411',
      patientCount: 1,
      description,
      pickupAddress: currentAddress,
      pickupLocation: {
        address: currentAddress,
        landmark: 'Near Railway Station Exit Gate 1',
        coordinates: { lat: 20.2648, lng: 85.8402 },
      },
      destinationHospital: {
        id: 'hosp-001',
        name: 'AIIMS Bhubaneswar',
        address: 'Sijua, Patrapada, Bhubaneswar',
        coordinates: { lat: 20.2312, lng: 85.7766 },
        distanceKm: 11.2,
        estimatedTimeMin: 14,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans pb-8">
      {/* Citizen Header */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/30">
            <Siren className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white">108 Odisha Emergency Help</h1>
            <p className="text-[11px] text-slate-400 truncate">Citizen Portal · Bhubaneswar City</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:108"
            className="flex items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-1.5 text-xs font-black text-white hover:bg-red-500 shadow-md shadow-red-600/30"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>Call 108</span>
          </a>

          {/* Role Switcher */}
          <button
            onClick={() => {
              switchRole('dispatcher');
              navigate('/');
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all"
          >
            <span>Role: Citizen</span>
            <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-400">Switch</span>
          </button>
        </div>
      </header>

      <div className="flex-1 p-3 sm:p-5 max-w-4xl mx-auto w-full space-y-5">
        {!activeSosEmergency ? (
          /* SOS Request Intake Mode */
          <div className="space-y-6">
            {/* GPS Location Pin Card */}
            <Card className="p-4 bg-slate-900/90 border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-red-400" />
                  Your Current GPS Incident Location
                </span>
                <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  GPS High Accuracy (±4m)
                </span>
              </div>
              <p className="text-sm font-bold text-slate-100">{currentAddress}</p>
            </Card>

            {/* Select Emergency Category */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Select Emergency Category (1-Tap):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {emergencyTypes.map((t) => {
                  const Icon = t.icon;
                  const isSelected = selectedType === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className={`
                        flex flex-col items-center justify-center text-center p-4 rounded-2xl border transition-all duration-150
                        ${isSelected ? 'border-red-500 bg-red-950/40 shadow-lg shadow-red-950/50 scale-102' : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'}
                      `}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border mb-2 ${t.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-200">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Emergency Description Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Emergency Notes / Symptoms:
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe patient condition or location landmarks..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-primary-500"
              />
            </div>

            {/* Giant Red SOS Trigger Button */}
            <div className="text-center pt-2">
              <button
                onClick={handleTriggerSos}
                className="w-full max-w-md mx-auto py-7 px-8 rounded-3xl bg-gradient-to-br from-red-600 via-red-500 to-amber-600 text-white font-black text-xl sm:text-2xl uppercase tracking-wider shadow-2xl shadow-red-600/40 hover:scale-101 active:scale-98 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer border-4 border-red-400/30"
              >
                <div className="flex items-center gap-3">
                  <Siren className="h-8 w-8 animate-bounce" />
                  <span>REQUEST EMERGENCY</span>
                </div>
                <span className="text-xs font-medium text-red-100 uppercase tracking-widest">
                  Dispatches Nearest Unit & Activates Green Corridor
                </span>
              </button>
            </div>

            {/* Quick Helpline Numbers */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <a
                href="tel:108"
                className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl text-center hover:border-slate-700 transition-colors"
              >
                <span className="text-lg font-black text-red-400 font-mono block">108</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Ambulance</span>
              </a>
              <a
                href="tel:101"
                className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl text-center hover:border-slate-700 transition-colors"
              >
                <span className="text-lg font-black text-amber-400 font-mono block">101</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Fire Rescue</span>
              </a>
              <a
                href="tel:112"
                className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl text-center hover:border-slate-700 transition-colors"
              >
                <span className="text-lg font-black text-sky-400 font-mono block">112</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">National Police</span>
              </a>
            </div>
          </div>
        ) : (
          /* Live Connected SOS Tracking Mode */
          <div className="space-y-4">
            {/* Urgent Status Card */}
            <Card className="p-5 bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-900 border-red-500/50 shadow-2xl space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white font-black text-xl shadow-lg shadow-red-600/30">
                    🚑
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      Status: {activeSosEmergency.status}
                    </span>
                    <h2 className="text-lg font-black text-white">
                      {activeSosEmergency.assignedVehicleCallSign
                        ? `Unit ${activeSosEmergency.assignedVehicleCallSign}`
                        : 'Awaiting Vehicle Assignment'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Emergency Code: <strong className="text-slate-200">{activeSosEmergency.emergencyNumber}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black text-red-400 font-mono block">
                    {activeSosEmergency.etaMinutes || 0} <span className="text-xs">MIN</span>
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated Arrival</span>
                </div>
              </div>

              {/* Green Corridor Badge */}
              <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-xl text-xs text-emerald-300">
                <Zap className="h-4 w-4 fill-emerald-400 shrink-0" />
                <span>
                  {activeSosEmergency.status === 'REQUESTED'
                    ? 'Emergency request logged. Control center is triaging and assigning nearest vehicle.'
                    : activeSosEmergency.status === 'ASSIGNED'
                    ? 'Vehicle assigned. Awaiting driver dispatch acknowledge.'
                    : activeSosEmergency.status === 'ACCEPTED'
                    ? 'Driver accepted mission. Ambulance transit starting now.'
                    : activeSosEmergency.status === 'EN_ROUTE' || activeSosEmergency.status === 'ARRIVING'
                    ? `Ambulance is moving with Green Corridor signal priority. Remaining distance: ${activeSosEmergency.distanceRemainingKm || 0} km.`
                    : activeSosEmergency.status === 'ARRIVED'
                    ? 'Ambulance has arrived at destination/scene.'
                    : 'Emergency completed.'}
                </span>
              </div>

              {/* Progress bar when en route */}
              {(activeSosEmergency.status === 'EN_ROUTE' || activeSosEmergency.status === 'ARRIVING') && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Transit Progress</span>
                    <span className="text-emerald-400 font-bold">{activeSosEmergency.simulationProgress || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-primary-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, activeSosEmergency.simulationProgress || 5)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href="tel:+919437011223"
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-colors"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Call Ambulance Driver</span>
                </a>

                <button
                  onClick={() => {
                    navigate('/');
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  <span>View in Control Center</span>
                </button>
              </div>
            </Card>

            {/* Live Map Tracking */}
            <div className="h-[380px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <CityMap />
            </div>

            {/* First Aid Emergency Advice Card */}
            <Card className="p-4 bg-slate-900/90 border-slate-800 space-y-2 text-xs">
              <h3 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Activity className="h-4 w-4" />
                Emergency First Aid While Ambulance Approaches
              </h3>
              <ul className="space-y-1.5 text-slate-300 pl-4 list-disc text-xs leading-relaxed">
                <li>Keep the patient calm and in a comfortable, seated or recovery position.</li>
                <li>Ensure clear road access for the ambulance at Master Canteen exit gate.</li>
                <li>Do not administer solid food or unprescribed medication while awaiting paramedics.</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
