"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCarbonStore } from "@/store/useCarbonStore";
import { GlassCard } from "@/components/ui/glass-card";
import { Leaf, Car, Train, Salad, Pizza, ChevronRight } from "lucide-react";

const steps = [
  {
    id: "commute",
    title: "How do you usually commute?",
    options: [
      { id: "car_petrol", label: "Petrol/Diesel Car", icon: Car },
      { id: "car_ev", label: "Electric Vehicle", icon: Car },
      { id: "metro", label: "Metro / Train", icon: Train },
    ]
  },
  {
    id: "diet",
    title: "What best describes your diet?",
    options: [
      { id: "meat_heavy", label: "Meat Heavy", icon: Pizza },
      { id: "vegetarian", label: "Vegetarian", icon: Salad },
      { id: "vegan", label: "Vegan", icon: Leaf },
    ]
  },
  {
    id: "cabUsage",
    title: "How often do you take a cab?",
    options: [
      { id: "daily", label: "Daily", icon: Car },
      { id: "weekly", label: "A few times a week", icon: Car },
      { id: "rarely", label: "Rarely", icon: Car },
    ]
  }
];

export default function Onboarding() {
  const router = useRouter();
  const completeOnboarding = useCarbonStore((state) => state.completeOnboarding);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (optionId: string) => {
    const currentStepObj = steps[currentStep];
    if (!currentStepObj) return;
    const stepId = currentStepObj.id;
    setAnswers(prev => ({ ...prev, [stepId]: optionId }));
    
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setTimeout(() => {
        completeOnboarding({
          commuteType: answers.commute || optionId,
          dietType: answers.diet || optionId,
          cabUsageFrequency: answers.cabUsage || optionId,
        });
        router.push("/");
      }, 400);
    }
  };

  const step = steps[currentStep];

  if (!step) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
          <Leaf className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Welcome to EcoTrack</h1>
          <p className="text-foreground/60">Let&apos;s personalize your carbon tracking experience.</p>
        </div>

        <GlassCard className="p-8 relative min-h-[400px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <h2 className="text-xl font-semibold text-foreground/90 mb-6 text-center">
                {step.title}
              </h2>
              
              <div className="space-y-3">
                {step.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 hover:border-primary/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-black/20 p-2 rounded-lg text-primary">
                        <option.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                        {option.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-colors ${idx === currentStep ? 'bg-primary' : 'bg-foreground/20'}`} 
              />
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
