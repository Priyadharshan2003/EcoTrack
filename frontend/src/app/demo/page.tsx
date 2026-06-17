"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Sparkles, Activity, Target, Leaf, ArrowLeft, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 overflow-x-hidden font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-foreground/10 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Preview Mode — No Login Required
          </div>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to EcoTrack</h1>
          <p className="text-muted-foreground font-medium mt-1">This is a preview of your future carbon dashboard.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: "Monthly Footprint", value: "420 kg", trend: "-12%", icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10" },
                { title: "Trees Equivalent", value: "24", trend: "+3", icon: Leaf, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                { title: "Target Progress", value: "85%", trend: "On Track", icon: Target, color: "text-purple-400", bg: "bg-purple-500/10" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-6 bg-card border-border">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-muted rounded-full text-muted-foreground">
                        {stat.trend}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.title}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Chart Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-6 bg-card border-border">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-semibold">Emissions Trend</h3>
                  <div className="flex gap-2">
                    {["1W", "1M", "1Y"].map(period => (
                      <button key={period} className={`text-xs px-3 py-1 rounded-full ${period === '1M' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="h-64 w-full flex items-end gap-2">
                  {[40, 55, 30, 80, 45, 60, 35, 90, 70, 50, 65, 45, 30].map((h, i) => (
                    <div key={i} className="flex-1 bg-muted rounded-t-sm relative group overflow-hidden">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: 0.5 + (i * 0.05), type: "spring" }}
                        className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-500/20 to-teal-400 rounded-t-sm opacity-80 group-hover:opacity-100 transition-opacity" 
                      />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Category Breakdown Mock */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold mb-6">Emissions by Category</h3>
                <div className="space-y-4">
                  {[
                    { label: "Transport", value: "45%", amount: "189 kg", color: "bg-blue-500" },
                    { label: "Energy", value: "30%", amount: "126 kg", color: "bg-amber-500" },
                    { label: "Food", value: "15%", amount: "63 kg", color: "bg-emerald-500" },
                    { label: "Shopping", value: "10%", amount: "42 kg", color: "bg-purple-500" },
                  ].map((cat, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium text-muted-foreground">{cat.label}</div>
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: cat.value }}
                          transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                          className={`h-full ${cat.color} rounded-full`} 
                        />
                      </div>
                      <div className="w-16 text-right text-sm font-bold">{cat.amount}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* AI Insights Mock */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="h-full"
            >
              <GlassCard className="p-6 h-full bg-card border-border flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div>
                    <h3 className="text-lg font-semibold">Gemini AI Insights</h3>
                    <p className="text-sm text-muted-foreground">Personalized coaching</p>
                  </div>
                  <div className="p-2 bg-blue-500/20 rounded-full">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                </div>

                <div className="space-y-4 relative z-10 flex-1">
                  {[
                    { title: "Commute Optimization", desc: <><span className="text-emerald-400 font-bold">-45kg CO₂/mo</span> by switching to transit twice a week.</>, icon: TrendingDown, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { title: "Energy Usage Spike", desc: <><span className="text-orange-400 font-bold">+15% heating</span> detected. Lower thermostat by 2° to save 12kg/mo.</>, icon: Activity, color: "text-orange-400", bg: "bg-orange-500/10" },
                    { title: "Dietary Adjustment", desc: <><span className="text-emerald-400 font-bold">-20kg CO₂/mo</span> achievable with 1 plant-based meal daily.</>, icon: Leaf, color: "text-emerald-400", bg: "bg-emerald-500/10" }
                  ].map((insight, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-card border border-border hover:bg-muted transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl ${insight.bg}`}>
                          <insight.icon className={`w-4 h-4 ${insight.color}`} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{insight.title}</div>
                          <div className="text-sm text-foreground/90 leading-relaxed font-medium">{insight.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <SignUpButton forceRedirectUrl="/dashboard">
                  <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl">
                    Sign up to unlock all insights
                  </Button>
                </SignUpButton>
              </GlassCard>
            </motion.div>

          </div>

        </div>
      </div>
    </div>
  );
}
