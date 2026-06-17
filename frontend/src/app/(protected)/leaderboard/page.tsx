"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { TreePine, Shield, User, Users, Building, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLeaderboard } from "./actions";
import { useAuth } from "@clerk/nextjs";

const MOCK_TEAMS = [
  { id: "1", name: "Design Engineering", trees: 1420, trend: "+12%", rank: 1, isMe: true },
  { id: "2", name: "Product Operations", trees: 1150, trend: "+5%", rank: 2, isMe: false },
  { id: "3", name: "Marketing Cloud", trees: 980, trend: "-2%", rank: 3, isMe: false },
  { id: "4", name: "Data Science", trees: 840, trend: "+15%", rank: 4, isMe: false },
];

interface LeaderboardUser {
  id: string;
  name: string;
  trees: number;
  trend: string;
  rank: number;
  isMe: boolean;
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"individual" | "team" | "corporate">("individual");
  const [individuals, setIndividuals] = useState<LeaderboardUser[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    async function loadData() {
      // Token fetching removed as Supabase client is no longer instantiated here
      const { topUsers, totalPoints } = await getLeaderboard();
      
      const formattedUsers = topUsers.map((u, index) => ({
        id: u.id,
        name: u.email?.split("@")[0] || "Anonymous",
        trees: u.points || 0,
        trend: "+5%", // Mapped later
        rank: index + 1,
        isMe: u.id === userId
      }));

      setIndividuals(formattedUsers);
      setTotalPoints(totalPoints);
      setLoading(false);
    }
    loadData();
  }, []);

  const data = activeTab === "team" ? MOCK_TEAMS : individuals;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      
      {/* Header */}
      <div className="pt-8">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
          Collective Impact
        </h1>
        <p className="text-xl text-foreground/50 mt-3 font-medium tracking-wide">
          Your community’s real-world sustainability footprint.
        </p>
      </div>

      {/* Hero Impact Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-8 md:p-12 border-primary/20 bg-primary/5 text-center relative overflow-hidden group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-all duration-1000" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-primary/20 p-4 rounded-full mb-6">
              <TreePine className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-4">
              Corporate Milestone
            </h2>
            <h3 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground leading-tight max-w-2xl">
              This month, the community gained <span className="text-primary">{loading ? "..." : totalPoints} points</span>.
            </h3>
          </div>
        </GlassCard>
      </motion.div>

      {/* Tabs */}
      <div className="flex p-1 bg-foreground/5 rounded-2xl backdrop-blur-md w-fit mx-auto border border-foreground/10">
        {[
          { id: "individual", label: "Individual", icon: User },
          { id: "team", label: "Team", icon: Users },
          { id: "corporate", label: "Corporate", icon: Building },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "individual" | "team" | "corporate")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-foreground text-background shadow-md scale-100"
                : "text-foreground/50 hover:text-foreground/80 scale-95"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      <div className="space-y-4">
        {activeTab === "corporate" ? (
          <GlassCard className="p-16 text-center">
            <Shield className="w-16 h-16 text-foreground/20 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-foreground/80 mb-2">Global Ranking</h3>
            <p className="text-foreground/50 max-w-md mx-auto">
              Your corporation is currently in the top 5% of tech companies globally for carbon neutrality.
            </p>
          </GlassCard>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {data.map((item) => (
                <GlassCard 
                  key={item.id} 
                  className={`p-6 flex items-center justify-between transition-transform hover:scale-[1.01] ${
                    item.isMe ? "border-primary/50 bg-primary/5" : "border-foreground/10"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-8 text-center">
                      <span className={`text-2xl font-bold ${
                        item.rank === 1 ? "text-yellow-500" :
                        item.rank === 2 ? "text-slate-400" :
                        item.rank === 3 ? "text-amber-600" : "text-foreground/20"
                      }`}>
                        #{item.rank}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
                        {item.name}
                        {item.isMe && (
                          <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-primary/20 text-primary rounded-full">
                            You
                          </span>
                        )}
                      </h4>
                      <p className="text-sm font-medium text-foreground/50 mt-1 flex items-center gap-1">
                        <ArrowUp className="w-3 h-3 text-green-500" />
                        {item.trend} impact vs last month
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-2xl font-bold text-foreground">{item.trees}</span>
                      <TreePine className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-xs font-medium uppercase tracking-wider text-foreground/40 mt-1">
                      Points
                    </p>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

    </div>
  );
}
