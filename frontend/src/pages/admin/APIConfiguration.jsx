import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Database, CheckCircle2, Save } from 'lucide-react';

export const APIConfiguration = () => {
  const [endpoint, setEndpoint] = useState('https://itms.bhubaneswar.smartcity.gov.in/v2/signals');
  const [token, setToken] = useState('bscl_sec_token_9921471029148');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <PageContainer
      title="External Telemetry & API Feeds"
      subtitle="Configure ITMS Smart City signals, CCTV AI processors, and Doppler radar feeds"
      actions={
        <Button size="sm" variant="primary" onClick={handleSave}>
          <Save className="h-4 w-4 mr-1.5" />
          Save Feeds
        </Button>
      }
    >
      <div className="max-w-2xl space-y-4">
        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-3 text-xs text-emerald-300 font-bold">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>API endpoints and security tokens updated.</span>
          </div>
        )}

        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-primary-400 font-bold text-xs uppercase tracking-wider">
            <Database className="h-4 w-4" />
            <span>Smart City ITMS Traffic Signal API</span>
          </div>

          <Input
            label="ITMS Gateway Endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          />

          <Input
            label="API Auth Token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold pt-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Connected & Streaming (Latency: 28ms)</span>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default APIConfiguration;
