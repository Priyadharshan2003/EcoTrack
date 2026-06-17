"use client";

import { GlassCard } from '@/components/ui/glass-card';
import { Share2, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ScoreCard() {
  const [score, setScore] = useState(0);
  
  // Example score calculation
  // score = 100 - (userCO2 / globalAverage * 100)
  // Mocking it for now
  useEffect(() => {
    // animate to 85
    const timer = setTimeout(() => setScore(85), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My EcoScore',
        text: `I just scored ${score} on EcoTrack! I'm in the Top 15% for tracking better than average. Join me in reducing transport emissions!`,
        url: window.location.origin
      }).catch(console.error);
    }
  };

  return (
    <GlassCard className="p-6 flex flex-col justify-between h-full bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2.5 rounded-2xl">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <span className="font-semibold text-foreground/80">EcoScore</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 bg-primary/10 rounded-full text-primary">Top 15%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10" onClick={handleShare}>
            <Share2 className="w-4 h-4 text-primary" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center py-6">
        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-primary to-emerald-700 tracking-tighter">
          {score}
        </div>
        <p className="text-sm font-medium text-foreground/50 mt-2">Out of 100</p>
      </div>
      
      <p className="text-sm font-medium text-foreground/70 text-center mt-4">
        You are tracking better than average! Keep maintaining low transport emissions.
      </p>
    </GlassCard>
  );
}
