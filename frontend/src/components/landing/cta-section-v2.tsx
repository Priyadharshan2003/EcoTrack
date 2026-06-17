"use client";

import { motion } from "framer-motion";
import { GetStartedButton } from "./get-started-button";

export function CtaSectionV2() {
  return (
    <section className="py-32 relative overflow-hidden z-10">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto border border-border bg-card/80 backdrop-blur-xl rounded-3xl p-12 md:p-20 shadow-2xl shadow-emerald-900/20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-6">
            Ready to reach <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">net-zero?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Start reducing your footprint today. Join the movement of individuals taking control of their environmental impact.
          </p>
          
          <div className="flex justify-center">
            <GetStartedButton 
              className="px-10 h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.2)]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
