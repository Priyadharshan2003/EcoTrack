"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassCard } from '@/components/ui/glass-card';

const data = [
  { name: 'Mon', emissions: 12 },
  { name: 'Tue', emissions: 19 },
  { name: 'Wed', emissions: 15 },
  { name: 'Thu', emissions: 10 },
  { name: 'Fri', emissions: 14 },
  { name: 'Sat', emissions: 22 },
  { name: 'Sun', emissions: 18 },
];

export function EmissionsTrend() {
  return (
    <GlassCard className="p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-foreground/80 tracking-tight mb-6" id="trend-chart-title">Weekly Trend</h3>
      <figure aria-labelledby="trend-chart-title" className="flex-1 min-h-[300px]" role="figure">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis dataKey="name" stroke="currentColor" opacity={0.5} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="currentColor" opacity={0.5} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line type="monotone" dataKey="emissions" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </figure>
    </GlassCard>
  );
}
