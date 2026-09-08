import React from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';

const mockLogs = [
  { timestamp: '21:55:04', level: 'INFO', msg: 'Emergency EMG-2026-0893 created. Unit AMB-102 assigned.' },
  { timestamp: '21:50:18', level: 'AI_OPTIM', msg: 'Green Corridor activated for EMG-2026-0892 across 5 ITMS signals.' },
  { timestamp: '21:49:12', level: 'WARN', msg: 'Waterlogging threshold exceeded at Iskcon Underpass (Sensor #03).' },
  { timestamp: '21:42:00', level: 'INFO', msg: 'Emergency EMG-2026-0891 dispatched with priority Code Red.' },
];

export const SystemLogs = () => {
  return (
    <PageContainer
      title="Tactical System & Dispatch Audit Logs"
      subtitle="Raw event stream from vehicle GPS trackers, signal controllers, and AI engine"
    >
      <Card className="p-4 bg-slate-950 border-slate-800 font-mono text-xs space-y-2">
        {mockLogs.map((log, idx) => (
          <div key={idx} className="flex items-start gap-3 border-b border-slate-900 pb-2">
            <span className="text-slate-500 font-semibold">{log.timestamp}</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                log.level === 'WARN'
                  ? 'bg-amber-500/20 text-amber-400'
                  : log.level === 'AI_OPTIM'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-sky-500/20 text-sky-400'
              }`}
            >
              [{log.level}]
            </span>
            <span className="text-slate-300 flex-1">{log.msg}</span>
          </div>
        ))}
      </Card>
    </PageContainer>
  );
};

export default SystemLogs;
