import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

const defaultPerfData = [
  { day: 'Mon', compliance: 92, timeSavedMin: 6.2 },
  { day: 'Tue', compliance: 95, timeSavedMin: 7.1 },
  { day: 'Wed', compliance: 91, timeSavedMin: 5.9 },
  { day: 'Thu', compliance: 94, timeSavedMin: 6.8 },
  { day: 'Fri', compliance: 96, timeSavedMin: 7.4 },
  { day: 'Sat', compliance: 97, timeSavedMin: 8.1 },
  { day: 'Sun', compliance: 94, timeSavedMin: 6.9 },
];

export const RoutePerformanceChart = ({ data = defaultPerfData }) => {
  return (
    <Card className="p-4 bg-slate-900/90 border-slate-800 space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
        Weekly Green Corridor Success Rate (%)
      </h4>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis domain={[80, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
            />
            <Line type="monotone" dataKey="compliance" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: '#0284c7' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RoutePerformanceChart;
