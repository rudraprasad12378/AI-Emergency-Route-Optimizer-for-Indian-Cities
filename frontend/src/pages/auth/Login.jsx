import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Siren,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  Truck,
  HeartHandshake,
  Hospital,
  Users,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const Login = () => {
  const [email, setEmail] = useState('dispatcher@ero.gov.in');
  const [password, setPassword] = useState('emergency2026');
  const { login, switchRole, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const roleProfiles = [
    {
      role: 'dispatcher',
      title: 'Dispatcher',
      desc: 'Control Center & Multi-route AI engine',
      icon: Siren,
      color: 'from-red-600 to-amber-600',
      borderColor: 'border-red-500/40',
      path: '/',
    },
    {
      role: 'driver',
      title: 'Ambulance Driver',
      desc: 'Pilot HUD, turn navigation & green corridor',
      icon: Truck,
      color: 'from-amber-600 to-emerald-600',
      borderColor: 'border-amber-500/40',
      path: '/driver',
    },
    {
      role: 'citizen',
      title: 'Citizen',
      desc: '1-tap 108 SOS emergency request & live tracker',
      icon: HeartHandshake,
      color: 'from-rose-600 to-pink-600',
      borderColor: 'border-rose-500/40',
      path: '/citizen',
    },
    {
      role: 'hospital',
      title: 'Hospital Staff',
      desc: 'Incoming patient triage & trauma bay allocation',
      icon: Hospital,
      color: 'from-sky-600 to-indigo-600',
      borderColor: 'border-sky-500/40',
      path: '/hospital',
    },
    {
      role: 'admin',
      title: 'Admin',
      desc: 'Fleet assets, ITMS signals & system parameters',
      icon: Shield,
      color: 'from-purple-600 to-indigo-600',
      borderColor: 'border-purple-500/40',
      path: '/admin',
    },
  ];

  const handleQuickRoleSelect = (roleItem) => {
    switchRole(roleItem.role);
    navigate(roleItem.path);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success && res.user) {
      if (res.user.role === 'driver') navigate('/driver');
      else if (res.user.role === 'citizen') navigate('/citizen');
      else if (res.user.role === 'hospital') navigate('/hospital');
      else if (res.user.role === 'admin') navigate('/admin');
      else navigate('/');
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-950 p-4 relative overflow-y-auto font-sans py-10">
      {/* Background ambient glow */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary-600/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-2xl space-y-6 rounded-3xl border border-slate-800/80 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-amber-600 shadow-lg shadow-red-500/20">
            <Siren className="h-7 w-7 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            AERO Command & Multi-Role Gateway
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            AI Emergency Route Optimizer for Indian Cities · Select your designated operational role
          </p>
        </div>

        {/* 1-Click Role Selector Cards */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-center">
            Instant 1-Click Role Access (Development / Testing)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {roleProfiles.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.role}
                  onClick={() => handleQuickRoleSelect(item)}
                  className={`
                    flex flex-col text-left p-3.5 rounded-2xl border bg-slate-950/70 hover:bg-slate-800/90 transition-all duration-150 group cursor-pointer
                    ${item.borderColor} hover:scale-102
                  `}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-xs font-black text-white group-hover:text-primary-300">{item.title}</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{item.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center border-t border-slate-800 pt-4">
          <span className="absolute bg-slate-900 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Or Sign In with Credentials
          </span>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Officer Email / Tactical ID"
            type="email"
            required
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Secure Access PIN / Password"
            type="password"
            required
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
            <span>Authenticate to Tactical Portal</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>

        <div className="border-t border-slate-800/80 pt-3 text-center">
          <p className="text-[10px] text-slate-500">
            Odisha State Disaster Management Authority & Emergency Medical Services Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
