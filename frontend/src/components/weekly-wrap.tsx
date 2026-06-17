"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, X, ArrowRight, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

// Mock Data Engine
const breakdownData = [
  { name: "Transport", value: 45, color: "#10b981" }, // emerald-500
  { name: "Food", value: 30, color: "#3b82f6" },      // blue-500
  { name: "Energy", value: 25, color: "#eab308" },    // yellow-500
];

export function WeeklyWrap() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button variant="outline" size="sm" className="gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Impact Breakdown</span>
          </Button>
        } 
      />
      <DialogContent 
        className="sm:max-w-[720px] w-full p-0 bg-card border border-border shadow-2xl rounded-xl overflow-hidden" 
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Impact Breakdown
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setOpen(false)}
            className="rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col items-center">
          <div className="text-center mb-6">
            <p className="text-muted-foreground text-lg">Where your emissions came from this week</p>
          </div>

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-[400px] h-[280px] relative"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  animationDuration={1000}
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)'
                  }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Graphic/Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <TrendingDown className="w-8 h-8 text-emerald-500 mb-1" />
              <span className="text-3xl font-bold text-foreground">-18%</span>
            </div>
          </motion.div>

          {/* Legend */}
          <div className="w-full max-w-md mt-6 flex flex-col gap-2">
            {breakdownData.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-all cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-foreground text-lg">{item.name}</span>
                </div>
                <span className="font-bold text-foreground text-lg">{item.value}%</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/30 px-6 py-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground">
            You saved <span className="font-medium text-foreground">18.5 kg CO₂</span> compared to last week.
          </p>
          <Button onClick={() => setOpen(false)} className="gap-2 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white">
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
