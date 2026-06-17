"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { CheckCircle2, Zap, Leaf } from "lucide-react";
import { motion } from "framer-motion";

const historyData = [
  { id: 1, type: "action", title: "Cycled to Work", impact: "-2.4 kg", date: "Today", icon: <Leaf className="w-5 h-5 text-primary" /> },
  { id: 2, type: "insight", title: "Insight Applied", impact: "-15 kg", date: "Yesterday", icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
  { id: 3, type: "snapshot", title: "Weekly Snapshot", impact: "Top 10%", date: "3 days ago", icon: <Zap className="w-5 h-5 text-amber-500" /> }
];

export function Timeline() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold tracking-tight text-foreground/90">History & Progress</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <GlassCard className="p-6 border-primary/20 bg-primary/5">
          <p className="text-sm font-medium text-foreground/50">Progress Trend</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">-12%</span>
            <span className="text-sm font-medium text-foreground/70">vs last month</span>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6 border-blue-500/20 bg-blue-500/5">
          <p className="text-sm font-medium text-foreground/50">Snapshot Compare</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-500">Better</span>
            <span className="text-sm font-medium text-foreground/70">than 85% of users</span>
          </div>
        </GlassCard>
      </div>

      <div className="relative border-l border-white/10 ml-4 space-y-8 pb-4">
        {historyData.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative pl-8"
          >
            <div className="absolute -left-[20px] top-1 bg-background p-1 rounded-full border border-white/10">
              <div className="bg-white/5 p-1.5 rounded-full">
                {item.icon}
              </div>
            </div>
            <GlassCard className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground/90">{item.title}</p>
                <p className="text-xs font-medium text-foreground/50 mt-1">{item.date}</p>
              </div>
              <div className="font-bold text-primary">{item.impact}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
