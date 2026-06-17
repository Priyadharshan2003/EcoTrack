"use client";

import { motion } from "framer-motion";

export function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="relative max-w-5xl mx-auto mt-16 p-[1px] rounded-t-2xl overflow-hidden z-10 hidden lg:block border-t border-l border-r border-white/10 bg-black/40 backdrop-blur-xl h-[400px] shadow-2xl"
    >
      <div className="absolute top-0 left-0 w-full h-12 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
      </div>
      <div className="pt-20 px-8 grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="h-40 bg-white/5 rounded-xl border border-white/5 animate-pulse" />
          <div className="grid grid-cols-2 gap-6">
            <div className="h-32 bg-white/5 rounded-xl border border-white/5 animate-pulse" />
            <div className="h-32 bg-white/5 rounded-xl border border-white/5 animate-pulse" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-64 bg-purple-500/10 rounded-xl border border-purple-500/20 animate-pulse" />
          <div className="h-24 bg-white/5 rounded-xl border border-white/5 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}
