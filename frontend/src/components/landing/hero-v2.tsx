"use client";

import { motion } from "framer-motion";
import { GetStartedButton } from "./get-started-button";
import { Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function HeroV2() {
  const router = useRouter();
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-600/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border mb-8 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-muted-foreground tracking-wide">NEW: Gemini AI Engine</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.1] mb-6"
            >
              Your personal <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">carbon intelligence</span>
              <br className="hidden lg:block" /> system.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg lg:text-xl text-muted-foreground max-w-2xl lg:max-w-xl mb-10 leading-relaxed font-light"
            >
              Understand, track, and reduce your emissions with AI-driven insights. Designed for a zero-carbon future.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto"
            >
              <GetStartedButton 
                className="w-full sm:w-auto rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 h-12"
              />
              <button 
                onClick={() => router.push("/demo")}
                className="group flex w-full sm:w-auto items-center justify-center gap-2 px-8 h-12 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors cursor-pointer"
              >
                View Demo Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Right Content: Dashboard Mock */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            className="flex-1 w-full relative perspective-1000"
          >
            <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-xl overflow-hidden shadow-2xl shadow-emerald-500/10">
              {/* Fake UI Header */}
              <div className="h-12 border-b border-border flex items-center px-4 gap-2 bg-muted/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
              </div>
              {/* Fake UI Body */}
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-2 h-32 rounded-xl bg-gradient-to-r from-emerald-500/20 to-transparent border border-emerald-500/20 flex flex-col justify-end p-4">
                  <div className="text-sm text-emerald-400 mb-1 font-medium">Monthly Footprint</div>
                  <div className="text-3xl font-semibold text-foreground">420 kg <span className="text-base text-muted-foreground font-normal">CO₂e</span></div>
                </div>
                <div className="h-24 rounded-xl border border-border bg-muted p-4 flex flex-col justify-between">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div className="w-full h-1 bg-foreground/10 rounded-full mt-2 overflow-hidden">
                    <div className="w-[60%] h-full bg-blue-500 rounded-full" />
                  </div>
                </div>
                <div className="h-24 rounded-xl border border-border bg-muted p-4 flex flex-col justify-between">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                  </div>
                  <div className="w-full h-1 bg-foreground/10 rounded-full mt-2 overflow-hidden">
                    <div className="w-[40%] h-full bg-orange-500 rounded-full" />
                  </div>
                </div>
              </div>
              
              {/* Subtle glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-foreground/5 to-transparent pointer-events-none" />
            </div>
            
            {/* Floating elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 p-4 rounded-xl border border-border bg-card/90 backdrop-blur-xl shadow-xl"
            >
              <div className="text-xs text-muted-foreground mb-1">AI Suggestion</div>
              <div className="text-sm font-medium text-emerald-400">Opt for train travel</div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
