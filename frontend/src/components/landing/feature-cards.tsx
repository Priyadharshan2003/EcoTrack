"use client";

import { motion } from "framer-motion";
import { Leaf, Brain, LineChart } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const features = [
  {
    icon: <Leaf className="w-6 h-6 text-primary" />,
    title: "Ambient Tracking",
    description: "Syncs silently with Apple Health & Strava. We calculate your avoided emissions while you live your life."
  },
  {
    icon: <Brain className="w-6 h-6 text-purple-500" />,
    title: "AI-Powered Intelligence",
    description: "Gemini analyzes your footprint to give you highly personalized, actionable reduction strategies."
  },
  {
    icon: <LineChart className="w-6 h-6 text-blue-500" />,
    title: "Granular Analytics",
    description: "Understand your impact with beautifully visualized data, trends, and peer comparisons."
  }
];

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto z-10 px-4">
      {features.map((feat, idx) => (
        <motion.div
          key={feat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
        >
          <GlassCard className="p-8 h-full hover:scale-[1.02] transition-transform duration-300 flex flex-col items-start text-left border-white/10 bg-white/5">
            <div className="bg-white/10 p-3 rounded-2xl mb-6">
              {feat.icon}
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-white mb-3">
              {feat.title}
            </h3>
            <p className="text-white/60 font-medium leading-relaxed">
              {feat.description}
            </p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
