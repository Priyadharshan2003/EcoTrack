"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Car, Utensils, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { GlassCard } from "./ui/glass-card";
import { Button } from "./ui/button";
import { useCarbonStore } from "@/lib/store";
import { calculateTransportEmissions, calculateDietEmissions } from "@/lib/emissionFactors";
import { toast } from "sonner";

type Step = "intro" | "commute" | "food" | "additional" | "summary";

export function DailyInsightFlow() {
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState({
    commute: "",
    food: "",
    additional: ""
  });
  const [calculatedEmissions, setCalculatedEmissions] = useState(0);
  const { setEmissions, totalEmissions, addCredits } = useCarbonStore();

  const handleNext = (key: keyof typeof answers, value: string, nextStep: Step) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setStep(nextStep);
  };

  const handleFinish = () => {
    // Basic fallback calculation rule engine based on Gemini logic
    let dailyEmissions = 0;
    
    // Commute fallback calculation
    if (answers.commute === "Car") dailyEmissions += calculateTransportEmissions("car_petrol", 15);
    else if (answers.commute === "Metro") dailyEmissions += calculateTransportEmissions("metro", 15);
    else if (answers.commute === "Bike" || answers.commute === "Walk" || answers.commute === "Stayed home") dailyEmissions += 0;
    
    // Food fallback
    if (answers.food === "Ordered") dailyEmissions += calculateDietEmissions("meat_heavy");
    else if (answers.food === "Home-cooked") dailyEmissions += calculateDietEmissions("vegetarian");
    else if (answers.food === "Skipped") dailyEmissions += 0;

    // Additional
    if (answers.additional === "Cab") dailyEmissions += calculateTransportEmissions("car_petrol", 10);
    else if (answers.additional === "Flight") dailyEmissions += calculateTransportEmissions("flight_short_haul", 500);

    setCalculatedEmissions(parseFloat(dailyEmissions.toFixed(2)));
    
    // Update store
    setEmissions(totalEmissions + parseFloat(dailyEmissions.toFixed(2)));
    addCredits(10);
    
    setStep("summary");
  };

  const closeFlow = () => {
    toast.success("Daily impact recorded", {
      description: "Gemini has successfully updated your footprint.",
      icon: <CheckCircle2 className="h-4 w-4 text-primary" />,
    });
    setStep("intro"); // Reset or hide in a real app, keeping it visible for demo
  };

  return (
    <GlassCard className="p-6 overflow-hidden relative shadow-[0_0_30px_rgba(59,130,246,0.05)] border-primary/10">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Daily Intelligence</h3>
      </div>

      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-foreground/80 font-medium">
              Good evening. I&apos;m ready to process your day. Should we begin?
            </p>
            <Button onClick={() => setStep("commute")} className="w-full rounded-2xl">
              Start Flow <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {step === "commute" && (
          <motion.div
            key="commute"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-foreground/80 font-medium flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" /> How was your commute today?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {["Car", "Metro", "Bike", "Walk", "Stayed home"].map((opt) => (
                <Button 
                  key={opt} 
                  variant="outline" 
                  className="rounded-xl justify-start bg-foreground/5 hover:bg-foreground/10 border-transparent"
                  onClick={() => handleNext("commute", opt, "food")}
                >
                  {opt}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "food" && (
          <motion.div
            key="food"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-foreground/80 font-medium flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-500" /> Did you order food or cook?
            </p>
            <div className="flex flex-col gap-2">
              {["Ordered", "Home-cooked", "Skipped"].map((opt) => (
                <Button 
                  key={opt} 
                  variant="outline" 
                  className="rounded-xl justify-start bg-foreground/5 hover:bg-foreground/10 border-transparent"
                  onClick={() => handleNext("food", opt, "additional")}
                >
                  {opt}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "additional" && (
          <motion.div
            key="additional"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-foreground/80 font-medium flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" /> Any significant additional activity?
            </p>
            <div className="flex flex-col gap-2">
              {["Cab", "Flight", "Heavy usage", "None"].map((opt) => (
                <Button 
                  key={opt} 
                  variant="outline" 
                  className="rounded-xl justify-start bg-foreground/5 hover:bg-foreground/10 border-transparent"
                  onClick={() => {
                    setAnswers(prev => ({ ...prev, additional: opt }));
                    handleFinish();
                  }}
                >
                  {opt}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6 text-center py-4"
          >
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-foreground">+{calculatedEmissions} kg CO₂</h4>
              <p className="text-foreground/50 text-sm font-medium mt-1">Daily inference complete.</p>
            </div>
            <Button onClick={closeFlow} className="w-full rounded-2xl">
              Close
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
