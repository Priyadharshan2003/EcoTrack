"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

const mockups = [
  {
    title: "Activity Tracking",
    content: (
      <div className="h-full w-full bg-background/80 dark:bg-black/80 rounded-2xl p-6 border border-foreground/10 dark:border-white/10 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="font-semibold text-foreground dark:text-white">Today's Footprint</div>
          <div className="text-emerald-500 dark:text-emerald-400 text-sm font-medium">-12% vs avg</div>
        </div>
        <div className="flex-1 flex items-end gap-2">
          {[40, 55, 30, 80, 45, 60, 35].map((h, i) => (
            <div key={i} className="flex-1 bg-foreground/10 dark:bg-white/10 rounded-t-md relative group">
              <div 
                className="absolute bottom-0 w-full bg-emerald-500/80 rounded-t-md transition-all duration-300 group-hover:bg-emerald-400" 
                style={{ height: `${h}%` }} 
              />
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    title: "AI Insights",
    content: (
      <div className="h-full w-full bg-background/80 dark:bg-black/80 rounded-2xl p-6 border border-foreground/10 dark:border-white/10 flex flex-col gap-4">
        <div className="font-semibold text-foreground dark:text-white mb-2">Gemini Analysis</div>
        {[
          { text: "Your commute accounts for 40% of emissions.", color: "bg-blue-500/20 text-blue-300" },
          { text: "Switching to EV would save 2.4 tons/year.", color: "bg-emerald-500/20 text-emerald-300" },
          { text: "Heating usage spiked this week.", color: "bg-orange-500/20 text-orange-300" }
        ].map((item, i) => (
          <div key={i} className={`p-4 rounded-xl text-sm font-medium ${item.color}`}>
            {item.text}
          </div>
        ))}
      </div>
    )
  },
  {
    title: "Breakdown",
    content: (
      <div className="h-full w-full bg-background/80 dark:bg-black/80 rounded-2xl p-6 border border-foreground/10 dark:border-white/10 flex flex-col items-center justify-center relative">
        <div className="w-32 h-32 rounded-full border-[12px] border-foreground/5 dark:border-white/5 border-t-emerald-500 border-r-blue-500 border-b-purple-500 relative flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-bold text-foreground dark:text-white">100%</div>
            <div className="text-[10px] text-foreground/50 dark:text-white/50">Total</div>
          </div>
        </div>
        <div className="w-full mt-8 flex justify-between px-4 text-xs text-foreground/50 dark:text-white/50">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Home</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Travel</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500" /> Food</div>
        </div>
      </div>
    )
  }
];

export function DashboardCarouselV2() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground dark:text-white tracking-tight">
          A dashboard that feels <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">like the future.</span>
        </h2>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-8 px-6 pb-12 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="min-w-[10vw] md:min-w-[20vw] shrink-0" />
        {mockups.map((mockup, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="snap-center shrink-0 w-[85vw] md:w-[60vw] lg:w-[40vw] h-[400px] perspective-1000"
          >
            <motion.div 
              whileHover={{ rotateY: i % 2 === 0 ? 2 : -2, rotateX: 2, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-full h-full p-2 rounded-3xl bg-gradient-to-br from-foreground/10 to-foreground/5 dark:from-white/10 dark:to-white/5 backdrop-blur-md shadow-2xl shadow-emerald-500/5 relative"
            >
              {mockup.content}
            </motion.div>
          </motion.div>
        ))}
        <div className="min-w-[10vw] md:min-w-[20vw] shrink-0" />
      </div>
    </section>
  );
}
