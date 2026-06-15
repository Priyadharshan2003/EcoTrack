"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Car, MapPin, Zap, Utensils, ArrowRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useCarbonStore } from "@/lib/store";

export default function TrackPage() {
  const [inferredConfirmed, setInferredConfirmed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"transport" | "food" | "energy" | null>("transport");
  
  // Sliders state
  const [transportDistance, setTransportDistance] = useState(12);
  const [energyUsage, setEnergyUsage] = useState(150);

  const { addCredits } = useCarbonStore();

  const handleConfirmInferred = () => {
    setInferredConfirmed(true);
    addCredits(10); // Reward for logging
    toast.success("Activity logged automatically", {
      description: "12km commute added. Impact recorded.",
      icon: <CheckCircle2 className="h-4 w-4 text-primary" />,
    });
  };

  const handleManualLog = () => {
    toast.success("Activity recorded", {
      description: "Your impact has been updated.",
      icon: <CheckCircle2 className="h-4 w-4 text-primary" />,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-20">
      
      {/* Header - Apple Style Typography */}
      <div className="pt-8">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
          Your Impact
        </h1>
        <p className="text-xl text-foreground/50 mt-3 font-medium tracking-wide">
          Intelligence layer active.
        </p>
      </div>

      {/* Ambient Inference Engine */}
      <AnimatePresence>
        {!inferredConfirmed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassCard className="p-1 border-primary/20 bg-primary/5 overflow-hidden">
              <div className="p-6 relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Activity className="w-32 h-32 text-primary" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/20 p-2.5 rounded-full">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                      Auto-Inferred
                    </span>
                  </div>

                  <h3 className="text-2xl font-semibold text-foreground/90 leading-tight max-w-sm mb-6">
                    You likely traveled <span className="text-foreground">12km</span> via car today.
                  </h3>

                  <div className="flex items-center gap-4">
                    <Button 
                      size="lg" 
                      onClick={handleConfirmInferred}
                      className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all"
                    >
                      Confirm
                    </Button>
                    <button 
                      onClick={() => setInferredConfirmed(true)} 
                      className="text-foreground/40 hover:text-foreground/80 text-sm font-medium transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Refinement / Interaction Model */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground/80 tracking-tight">
          Refine Activity
        </h2>
        
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "transport", icon: Car, label: "Transport" },
            { id: "energy", icon: Zap, label: "Energy" },
            { id: "food", icon: Utensils, label: "Diet" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as "transport" | "energy" | "food")}
              className={`p-4 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                activeCategory === cat.id 
                  ? "bg-foreground/10 border-foreground/20 text-foreground scale-100 shadow-md" 
                  : "bg-transparent border-transparent text-foreground/40 hover:bg-foreground/5 hover:text-foreground/80 scale-95"
              } border`}
            >
              <cat.icon className="w-6 h-6" />
              <span className="text-sm font-medium">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Context Panel */}
        <AnimatePresence mode="wait">
          {activeCategory === "transport" && (
            <motion.div
              key="transport"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-8">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="text-lg font-medium text-foreground/60 mb-1">Distance</h3>
                    <div className="text-4xl font-semibold text-foreground">
                      {transportDistance} <span className="text-2xl text-foreground/40">km</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-400 mb-1">Est. Impact</p>
                    <p className="text-xl font-semibold text-foreground">{Math.round(transportDistance * 0.19)} kg CO₂</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={transportDistance}
                    onChange={(e) => setTransportDistance(parseInt(e.target.value))}
                    className="w-full h-2 bg-foreground/10 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  
                  <div className="flex justify-between">
                    <Button onClick={handleManualLog} className="w-full rounded-2xl py-6 font-medium text-lg">
                      Log Impact <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeCategory === "energy" && (
            <motion.div
              key="energy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-8">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="text-lg font-medium text-foreground/60 mb-1">Home Usage</h3>
                    <div className="text-4xl font-semibold text-foreground">
                      {energyUsage} <span className="text-2xl text-foreground/40">kWh</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-400 mb-1">Est. Impact</p>
                    <p className="text-xl font-semibold text-foreground">{Math.round(energyUsage * 0.4)} kg CO₂</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <input 
                    type="range" 
                    min="10" 
                    max="500" 
                    step="10"
                    value={energyUsage}
                    onChange={(e) => setEnergyUsage(parseInt(e.target.value))}
                    className="w-full h-2 bg-foreground/10 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  
                  <div className="flex justify-between">
                    <Button onClick={handleManualLog} className="w-full rounded-2xl py-6 font-medium text-lg">
                      Log Impact <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
          
          {activeCategory === "food" && (
            <motion.div
              key="food"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-8 text-center space-y-6">
                <div className="bg-foreground/5 p-6 rounded-3xl inline-block">
                  <Utensils className="w-12 h-12 text-foreground/40 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-foreground/90">Auto-Tracking Active</h3>
                <p className="text-foreground/50 max-w-md mx-auto">
                  Your diet preferences are already syncing with your profile. No manual logging required today.
                </p>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
