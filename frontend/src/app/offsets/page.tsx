"use client";

import { motion } from "framer-motion";
import { useCarbonStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/glass-card";
import { TreePine, Wind, Sun, ShieldCheck } from "lucide-react";

const offsets = [
  {
    id: "amazon-reforest",
    title: "Amazon Reforestation",
    description: "Planting native tree species to restore biodiversity.",
    cost: 50,
    impact: "100kg CO₂",
    icon: TreePine,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    id: "wind-farm-india",
    title: "Wind Farm Development",
    description: "Funding renewable wind energy in rural India.",
    cost: 100,
    impact: "250kg CO₂",
    icon: Wind,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    id: "solar-pan-africa",
    title: "Solar Arrays in Kenya",
    description: "Installing solar panels for off-grid communities.",
    cost: 75,
    impact: "150kg CO₂",
    icon: Sun,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  }
];

export default function OffsetsMarketplace() {
  const { carbonCredits, addCredits, setOffsets, offsetsPurchased } = useCarbonStore();

  const handlePurchase = (cost: number, impact: number) => {
    if (carbonCredits >= cost) {
      addCredits(-cost);
      setOffsets(offsetsPurchased + impact);
      alert(`Successfully purchased offset for ${impact}kg CO2!`);
    } else {
      alert("Not enough credits!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Offset Marketplace</h1>
          <p className="text-foreground/60">Redeem your Carbon Credits for real-world environmental impact.</p>
        </div>
        <GlassCard className="px-6 py-4 flex items-center gap-4 border-primary/30 bg-primary/5">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground/60">Available Balance</p>
            <p className="text-2xl font-bold text-foreground">{carbonCredits} <span className="text-primary text-lg">Credits</span></p>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offsets.map((offset, idx) => (
          <motion.div
            key={offset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <GlassCard className="p-6 h-full flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
              <div>
                <div className={`p-3 rounded-xl w-fit mb-6 ${offset.bg}`}>
                  <offset.icon className={`w-6 h-6 ${offset.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground/90 mb-2">{offset.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed mb-6">
                  {offset.description}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-y border-foreground/10">
                  <span className="text-foreground/60 text-sm">Carbon Impact</span>
                  <span className="font-semibold text-foreground">{offset.impact}</span>
                </div>
                
                <button
                  onClick={() => handlePurchase(offset.cost, parseInt(offset.impact))}
                  disabled={carbonCredits < offset.cost}
                  className="w-full py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Redeem {offset.cost} Credits
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
