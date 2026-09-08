import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Siren, Shield, Lock, Mail, User } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', badgeNumber: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-white">Operator Registration</h1>
          <p className="text-xs text-slate-400">Register new field or control center operator</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            icon={User}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Official Email"
            type="email"
            required
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Badge / Employee ID"
            required
            icon={Shield}
            value={formData.badgeNumber}
            onChange={(e) => setFormData({ ...formData, badgeNumber: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            required
            icon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <Button type="submit" size="lg" className="w-full">
            Submit Registration Request
          </Button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-xs text-primary-400 hover:underline">
            Already have credentials? Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
