"use client";

import { motion } from "framer-motion";

export function SocialProofV2() {
  return (
    <section className="py-24 border-y border-foreground/5 dark:border-white/5 bg-foreground/[0.01] dark:bg-white/[0.01] relative z-10">
      <div className="container mx-auto px-6 max-w-6xl text-center">
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-4xl md:text-6xl font-bold text-foreground dark:text-white mb-2">10,000+</div>
            <div className="text-foreground/50 dark:text-white/50 text-lg uppercase tracking-wider text-sm font-medium">Users tracking emissions</div>
          </motion.div>
          
          <div className="hidden md:block w-px h-16 bg-foreground/10 dark:bg-white/10" />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 mb-2">2.3M kg</div>
            <div className="text-foreground/50 dark:text-white/50 text-lg uppercase tracking-wider text-sm font-medium">CO₂ Reduced</div>
          </motion.div>
        </div>

        <div className="pt-8 border-t border-foreground/5 dark:border-white/5">
          <p className="text-sm text-foreground/50 dark:text-white/30 mb-8 uppercase tracking-widest font-semibold">Trusted by forward-thinking teams</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale">
            {/* Logo placeholders */}
            {["Acme Corp", "GlobalTech", "EcoInnovate", "NextGen", "Stark Ind"].map((logo, i) => (
              <div key={i} className="text-xl font-bold font-serif tracking-tighter text-foreground dark:text-white">
                {logo}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
