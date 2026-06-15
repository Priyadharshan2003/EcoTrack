"use client";

import { motion } from "framer-motion";
import { TreePine, Zap } from "lucide-react";
import { GlassCard } from "./ui/glass-card";

export function DashboardHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <GlassCard className="p-8 md:p-10 relative overflow-hidden group bg-gradient-hero border-none shadow-[0_0_40px_rgba(16,185,129,0.1)]">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all duration-700 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-accent/10 blur-3xl group-hover:bg-accent/20 transition-all duration-700 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div className="space-y-6 max-w-lg">
            <h2 className="text-sm font-semibold tracking-widest text-primary uppercase">
              Monthly Impact
            </h2>
            
            <div className="space-y-2">
              <motion.h3 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]"
              >
                You offset emissions equal to planting <span className="text-primary">42 trees</span>.
              </motion.h3>
              <p className="text-lg text-foreground/50 font-medium">
                And saved energy equivalent to powering a home for 6 days.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            <div className="flex items-center gap-4 bg-foreground/5 backdrop-blur-md p-4 rounded-2xl border border-foreground/10">
              <div className="bg-primary/20 p-2.5 rounded-full">
                <TreePine className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-foreground/50 font-medium uppercase tracking-wider mb-0.5">Offset</p>
                <span className="text-lg font-bold text-foreground">500 kg CO₂</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-foreground/5 backdrop-blur-md p-4 rounded-2xl border border-foreground/10">
              <div className="bg-accent/20 p-2.5 rounded-full">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-foreground/50 font-medium uppercase tracking-wider mb-0.5">Avoided</p>
                <span className="text-lg font-bold text-foreground">124 kg CO₂</span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
