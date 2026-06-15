"use client";

import { DashboardHero } from "@/components/dashboard-hero";
import { AIInsightsPanel } from "@/components/ai-insights-panel";
import { DailyInsightFlow } from "@/components/daily-insight-flow";
import { GlassCard } from "@/components/ui/glass-card";
import { Leaf, Zap, Flame, HeartPulse, Bike, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCarbonStore } from "@/lib/store";
import { usePassiveSuggestions } from "@/hooks/usePassiveSuggestions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const router = useRouter();
  const { profile, currentStreak } = useCarbonStore();
  const { suggestions, confirmSuggestion, dismissSuggestion } = usePassiveSuggestions();

  useEffect(() => {
    if (typeof window !== "undefined" && !profile.hasCompletedOnboarding) {
      router.push("/onboarding");
    }
  }, [profile.hasCompletedOnboarding, router]);

  if (!profile.hasCompletedOnboarding) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Invisible Header & Streak Continuum */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Overview</h1>
          <p className="text-foreground/50 font-medium mt-1">Your personal sustainability ecosystem.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-foreground text-lg">{currentStreak} Day</span>
            </div>
            <span className="text-xs text-foreground/40 font-semibold uppercase tracking-wider">Top 5% in City</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Impact & Integrations */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          <DashboardHero />

          {/* Passive Suggestions Section */}
          {suggestions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground/80 tracking-tight mb-4 px-2">Passive Suggestions</h3>
              <div className="grid grid-cols-1 gap-4">
                {suggestions.map((sug) => (
                  <motion.div
                    key={sug.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <GlassCard className="p-4 flex items-center justify-between border-primary/20 bg-primary/5">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/20 p-2.5 rounded-full">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground/90">{sug.message}</p>
                          <p className="text-xs font-medium text-foreground/50 mt-1">Est. Impact: {sug.impact} kg CO₂</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => dismissSuggestion(sug.id)}>
                          Dismiss
                        </Button>
                        <Button size="sm" onClick={() => confirmSuggestion(sug.id)}>
                          Confirm
                        </Button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Ambient Tracking Apple Style */}
          <div>
            <h3 className="text-lg font-semibold text-foreground/80 tracking-tight mb-4 px-2">Ambient Tracking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <GlassCard className="p-6 flex flex-col justify-between h-full hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-500/10 p-2.5 rounded-2xl">
                        <HeartPulse className="w-6 h-6 text-red-500" />
                      </div>
                      <span className="font-semibold text-foreground/80">Apple Health</span>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-foreground/5 rounded-full text-foreground/50">Synced Just Now</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-semibold text-foreground">8,432</span>
                      <span className="text-foreground/50 font-medium">steps today</span>
                    </div>
                    <p className="text-sm font-medium text-primary bg-primary/10 inline-flex px-3 py-1 rounded-lg">
                      Avoided 1.2 kg CO₂ vs driving
                    </p>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <GlassCard className="p-6 flex flex-col justify-between h-full hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#FC4C02]/10 p-2.5 rounded-2xl">
                        <Bike className="w-6 h-6 text-[#FC4C02]" />
                      </div>
                      <span className="font-semibold text-foreground/80">Strava</span>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-foreground/5 rounded-full text-foreground/50">Synced 2h ago</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-semibold text-foreground">12.4</span>
                      <span className="text-foreground/50 font-medium">km cycling</span>
                    </div>
                    <p className="text-sm font-medium text-primary bg-primary/10 inline-flex px-3 py-1 rounded-lg">
                      Avoided 2.3 kg CO₂ vs driving
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Column - Intelligence Layer */}
        <div className="flex flex-col gap-8">
          {/* Gemini Daily Flow */}
          <DailyInsightFlow />

          <div className="flex-1 min-h-[300px]">
            <AIInsightsPanel />
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-foreground/80 tracking-tight mb-6">Recent Impact</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="bg-primary/10 p-3 rounded-2xl">
                    <Leaf className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground/90">Tree Planted</p>
                    <p className="text-foreground/50 text-sm font-medium">Amazon Reforestation</p>
                  </div>
                  <div className="font-semibold text-primary">-100 kg</div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="bg-accent/10 p-3 rounded-2xl">
                    <Zap className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground/90">Smart Thermostat</p>
                    <p className="text-foreground/50 text-sm font-medium">Inferred via API</p>
                  </div>
                  <div className="font-semibold text-accent">-12 kg</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
