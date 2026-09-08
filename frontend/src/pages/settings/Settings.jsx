import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { User, Bell, Shield, Save } from 'lucide-react';

export const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || 'Dispatcher Officer');
  const [email, setEmail] = useState(user?.email || 'dispatcher@bhubaneswar.gov.in');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PageContainer
      title="Operator Profile & System Preferences"
      subtitle="Customize tactical map views, audio alerts, and officer credentials"
    >
      <div className="max-w-3xl space-y-6">
        <form onSubmit={handleSave}>
          <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-primary-400 font-bold text-xs uppercase tracking-wider">
              <User className="h-4 w-4" />
              <span>Officer Profile</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Official Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {saved && <span className="text-xs text-emerald-400 font-bold">Preferences saved!</span>}
              <Button type="submit" size="sm" variant="primary" className="ml-auto">
                <Save className="h-4 w-4 mr-1.5" />
                Update Profile
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};

export default Settings;
