import React from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const SystemSettings = () => {
  return (
    <PageContainer
      title="Global System Settings"
      subtitle="Configure city geofence, default language, and backup emergency protocols"
    >
      <Card className="p-6 bg-slate-900/90 border-slate-800 max-w-2xl space-y-4">
        <h3 className="text-sm font-bold text-white">City Zone Geofence</h3>
        <p className="text-xs text-slate-400">Default operational jurisdiction: Bhubaneswar Municipal Corporation (BMC)</p>
        <Button size="sm" variant="primary">
          Save Settings
        </Button>
      </Card>
    </PageContainer>
  );
};

export default SystemSettings;
