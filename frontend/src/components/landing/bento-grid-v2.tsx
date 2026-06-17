"use client";

import { motion } from "framer-motion";
import { Sparkles, Activity, PieChart, Zap, TrendingDown, Target } from "lucide-react";

const cards = [
  {
    title: "Real-time CO₂ Tracking",
    description: "Monitor your emissions as they happen with sub-second latency.",
    icon: <Activity className="w-5 h-5 text-emerald-400" />,
    className: "md:col-span-2 md:row-span-2",
    content: (
      <div className="mt-4 flex items-end gap-1 h-24 opacity-80">
        {[40, 70, 45, 90, 65, 30, 85].map((h, i) => (
          <motion.div 
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex-1 bg-gradient-to-t from-emerald-500/20 to-emerald-400/60 rounded-t-sm"
          />
        ))}
      </div>
    )
  },
  {
    title: "AI Reduction Engine",
    description: "Powered by Gemini to analyze and suggest actionable reductions.",
    icon: <Sparkles className="w-5 h-5 text-blue-400" />,
    className: "md:col-span-1 md:row-span-1",
    content: (
      <div className="mt-4 flex items-center justify-center">
        <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Sparkles className="w-3 h-3" />
          Gemini Powered
        </div>
      </div>
    )
  },
  {
    title: "Behavioral Analytics",
    description: "Understand the 'why' behind your footprint.",
    icon: <PieChart className="w-5 h-5 text-purple-400" />,
    className: "md:col-span-1 md:row-span-1",
    content: (
      <div className="mt-4 flex gap-2">
        <div className="w-12 h-12 rounded-full border-4 border-purple-500/30 border-t-purple-500" />
        <div className="w-8 h-8 rounded-full border-4 border-border border-t-foreground/40 mt-2" />
      </div>
    )
  },
  {
    title: "Instant Insights",
    description: "Get notified when you hit milestones.",
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    className: "md:col-span-1 md:row-span-2 group relative overflow-hidden",
    content: (
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    )
  },
  {
    title: "Progress Over Time",
    description: "Visualize your journey to net-zero.",
    icon: <TrendingDown className="w-5 h-5 text-teal-400" />,
    className: "md:col-span-2 md:row-span-1",
    content: (
      <div className="mt-4 w-full h-12 relative">
        <svg viewBox="0 0 100 20" className="w-full h-full preserve-3d" preserveAspectRatio="none">
          <motion.path 
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            d="M0,20 Q25,5 50,15 T100,5" 
            fill="none" 
            stroke="rgba(45,212,191,0.5)" 
            strokeWidth="2" 
          />
        </svg>
      </div>
    )
  },
  {
    title: "Personalized Targets",
    description: "Set goals that match your lifestyle.",
    icon: <Target className="w-5 h-5 text-orange-400" />,
    className: "md:col-span-1 md:row-span-1",
    content: null
  }
];

export function BentoGridV2() {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            Everything you need. <span className="text-muted-foreground">Nothing you don't.</span>
          </h2>
          <p className="text-muted-foreground text-lg">A perfectly balanced toolset for modern sustainability.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`
                ${card.className}
                relative group rounded-3xl p-6 flex flex-col
                bg-card border border-border
                hover:bg-muted transition-all duration-500 overflow-hidden
              `}
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                <div className="mt-auto">
                  {card.content}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
