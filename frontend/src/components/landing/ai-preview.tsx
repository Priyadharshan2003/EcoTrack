"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function AiPreview() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative max-w-3xl mx-auto mt-20 p-[1px] rounded-2xl overflow-hidden z-10 hidden md:block"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-purple-500/30 to-blue-500/30 blur-xl" />
      <div className="relative bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-500/20 p-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Gemini Insights</h4>
            <p className="text-xs text-white/50">Analyzing your footprint...</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse" />
          <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse" />
        </div>
        <div className="mt-6 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
          <p className="text-sm font-medium text-purple-200">
            "Switching your commute to cycling tomorrow could save 4.2 kg CO₂, keeping you in the top 5% of eco-savers in your city."
          </p>
        </div>
      </div>
    </motion.div>
  );
}
