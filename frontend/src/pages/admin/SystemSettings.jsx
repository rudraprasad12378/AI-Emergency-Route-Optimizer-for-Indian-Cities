import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Save, CheckCircle2 } from 'lucide-react';

export const SystemSettings = () => {
  const [jurisdiction, setJurisdiction] = useState('Bhubaneswar Municipal Corporation (BMC)');
  const [language, setLanguage] = useState('en');
  const [backupProtocol, setBackupProtocol] = useState('automatic_fallback');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <PageContainer
      title="Global System Settings"
      subtitle="Configure city geofence, default language, and backup emergency protocols"
      actions={
        <Button size="sm" variant="primary" onClick={handleSave}>
          <Save className="h-4 w-4 mr-1.5" />
          Save Settings
        </Button>
      }
    >
      <div className="max-w-2xl space-y-4">
        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-3 text-xs text-emerald-300 font-bold">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Global system configuration saved successfully.</span>
          </div>
        )}

        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <Input
            label="City Zone Jurisdiction"
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
          />

          <Select
            label="Default Operational Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            options={[
              { label: 'English (Standard Command)', value: 'en' },
              { label: 'Odia (ଓଡ଼ିଆ)', value: 'or' },
              { label: 'Hindi (हिन्दी)', value: 'hi' },
            ]}
          />

          <Select
            label="Fallback Signal Preemption Protocol"
            value={backupProtocol}
            onChange={(e) => setBackupProtocol(e.target.value)}
            options={[
              { label: 'Automatic Cloud & Edge Failover', value: 'automatic_fallback' },
              { label: 'Local Station Radio Signal Priority', value: 'radio_priority' },
              { label: 'Manual Dispatcher Override Only', value: 'manual_override' },
            ]}
          />
        </Card>
      </div>
    </PageContainer>
  );
};

export default SystemSettings;
