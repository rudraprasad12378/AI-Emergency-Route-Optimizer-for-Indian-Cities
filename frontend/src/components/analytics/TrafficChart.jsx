import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

const defaultTrafficTrend = [
  { hour: '06:00', congestion: 20 },
  { hour: '09:00', congestion: 85 },
  { hour: '12:00', congestion: 45 },
  { hour: '15:00', congestion: 50 },
  { hour: '18:00', congestion: 92 },
  { hour: '21:00', congestion: 65 },
  { hour: '23:00', congestion: 25 },
];

export const TrafficChart = ({ data = defaultTrafficTrend }) => {
  return (
    <Card className="p-4 bg-slate-900/90 border-slate-800 space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
        Citywide Peak Congestion Trajectory (%)
      </h4>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCongest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="congestion" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCongest)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TrafficChart;
