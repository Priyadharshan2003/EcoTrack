"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GlassCard } from '@/components/ui/glass-card';

const data = [
  { name: 'Transport', value: 45 },
  { name: 'Energy', value: 30 },
  { name: 'Food', value: 15 },
  { name: 'Shopping', value: 10 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

export function CategoryChart() {
  return (
    <GlassCard className="p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-foreground/80 tracking-tight mb-6" id="category-chart-title">Category Breakdown</h3>
      <figure aria-labelledby="category-chart-title" className="flex-1 min-h-[300px]" role="figure">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </figure>
    </GlassCard>
  );
}
