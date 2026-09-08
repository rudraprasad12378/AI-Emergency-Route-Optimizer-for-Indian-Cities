import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

const mockPredData = [
  { time: '17:00', risk: 30, capacity: 80 },
  { time: '18:00', risk: 65, capacity: 80 },
  { time: '19:00', risk: 92, capacity: 80 },
  { time: '20:00', risk: 88, capacity: 80 },
  { time: '21:00', risk: 55, capacity: 80 },
  { time: '22:00', risk: 35, capacity: 80 },
];

export const PredictionChart = ({ data = mockPredData }) => {
  return (
    <Card className="p-4 bg-slate-900/90 border-slate-800 space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
        Projected Congestion Index vs Corridor Capacity Threshold
      </h4>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRisk)" />
            <Area type="monotone" dataKey="capacity" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={0} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PredictionChart;
