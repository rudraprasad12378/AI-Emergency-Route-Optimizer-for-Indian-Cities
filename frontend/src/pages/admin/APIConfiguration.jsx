import React from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Database, CheckCircle2 } from 'lucide-react';

export const APIConfiguration = () => {
  return (
    <PageContainer
      title="External Telemetry & API Feeds"
      subtitle="Configure ITMS Smart City signals, CCTV AI processors, and Doppler radar feeds"
    >
      <div className="max-w-2xl space-y-4">
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-primary-400 font-bold text-xs uppercase tracking-wider">
            <Database className="h-4 w-4" />
            <span>Smart City ITMS Traffic Signal API</span>
          </div>

          <Input
            label="ITMS Gateway Endpoint"
            defaultValue="https://itms.bhubaneswar.smartcity.gov.in/v2/signals"
          />

          <Input
            label="API Auth Token"
            type="password"
            defaultValue="bscl_sec_token_9921471029148"
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
