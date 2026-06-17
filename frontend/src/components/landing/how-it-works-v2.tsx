"use client";

import { motion } from "framer-motion";
import { User, Cpu, Leaf } from "lucide-react";

const steps = [
  {
    title: "Input Lifestyle",
    description: "Connect your apps or manually log your habits in seconds.",
    icon: <User className="w-6 h-6 text-emerald-400" />,
    color: "emerald"
  },
  {
    title: "AI Analysis",
    description: "Our Gemini engine breaks down your footprint with high precision.",
    icon: <Cpu className="w-6 h-6 text-blue-400" />,
    color: "blue"
  },
  {
    title: "Reduction Plan",
    description: "Get a personalized, step-by-step roadmap to reduce emissions.",
    icon: <Leaf className="w-6 h-6 text-teal-400" />,
    color: "teal"
  }
];

export function HowItWorksV2() {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground dark:text-white tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-foreground/50 dark:text-white/50 text-lg">Three steps to a lighter footprint.</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-foreground/0 via-foreground/10 to-foreground/0 dark:from-white/0 dark:via-white/10 dark:to-white/0 z-0" />

          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="flex-1 flex flex-col items-center text-center relative z-10 mb-12 md:mb-0 w-full"
            >
              {/* Connector Line (Mobile) */}
              {i !== steps.length - 1 && (
                <div className="md:hidden absolute top-24 bottom-[-3rem] left-1/2 w-0.5 -ml-[1px] bg-gradient-to-b from-foreground/10 dark:from-white/10 to-transparent z-0" />
              )}

              <div className="w-24 h-24 rounded-full bg-background dark:bg-black border border-foreground/10 dark:border-white/10 flex items-center justify-center mb-6 relative group shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-foreground/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Glowing ring */}
                <div className={`absolute inset-[-1px] rounded-full border border-${step.color}-500/30 opacity-0 group-hover:opacity-100 scale-110 transition-all duration-500 blur-sm`} />
                
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">{step.title}</h3>
              <p className="text-foreground/50 dark:text-white/50 max-w-[250px] leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
