import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Siren, Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const Login = () => {
  const [email, setEmail] = useState('dispatcher@bhubaneswar.gov.in');
  const [password, setPassword] = useState('emergency2026');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-slate-950 p-4 relative overflow-hidden font-sans">
      {/* Background ambient glow */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary-600/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md space-y-6 rounded-2xl border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-amber-600 shadow-lg shadow-red-500/20">
            <Siren className="h-7 w-7 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">AERO Operations</h1>
          <p className="text-xs text-slate-400">
            AI Emergency Route Optimizer & Intelligence Platform
          </p>
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

          <Button type="submit" size="lg" className="w-full mt-2" isLoading={isLoading}>
            <span>Authenticate to Command Deck</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>

        <div className="border-t border-slate-800/80 pt-4 text-center">
          <p className="text-[11px] text-slate-500">
            Authorized Personnel Only · Odisha State Disaster & EMS Gateway
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
