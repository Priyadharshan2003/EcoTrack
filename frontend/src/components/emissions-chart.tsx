"use client";

import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GlassCard } from "./ui/glass-card";

const data = [
  { name: "Jan", carbon: 400 },
  { name: "Feb", carbon: 300 },
  { name: "Mar", carbon: 200 },
  { name: "Apr", carbon: 278 },
  { name: "May", carbon: 189 },
  { name: "Jun", carbon: 239 },
];

export function EmissionsChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      <GlassCard className="p-6 h-full flex flex-col">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-foreground/90">Emission Trends</h3>
          <p className="text-sm text-foreground/50">Your carbon footprint over the last 6 months.</p>
        </div>
        
        <div className="flex-1 min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                stroke="#ffffff40" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#ffffff40" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}kg`} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
                itemStyle={{ color: '#10B981' }}
              />
              <Area 
                type="monotone" 
                dataKey="carbon" 
                stroke="#10B981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCarbon)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  );
}
