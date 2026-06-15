"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Sparkles, Leaf, TrendingDown, Award } from "lucide-react";
import { motion } from "framer-motion";

const wrapData = [
  {
    id: 1,
    title: "Your Top Habit",
    description: "You cycled to work 4 times this week! That's a new personal record.",
    icon: <Leaf className="w-16 h-16 text-green-500 mb-4" />,
    color: "bg-green-500/10",
  },
  {
    id: 2,
    title: "Carbon Saved",
    description: "You saved 12.5 kg of CO2 compared to last week. Equivalent to planting 2 trees!",
    icon: <TrendingDown className="w-16 h-16 text-blue-500 mb-4" />,
    color: "bg-blue-500/10",
  },
  {
    id: 3,
    title: "Community Ranking",
    description: "You are in the top 5% of EcoTrackers in your city this week. Keep it up!",
    icon: <Award className="w-16 h-16 text-yellow-500 mb-4" />,
    color: "bg-yellow-500/10",
  },
];

export function WeeklyWrap() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Weekly Wrap</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            Your EcoWrap
          </DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <Carousel className="w-full max-w-xs mx-auto">
            <CarouselContent>
              {wrapData.map((item) => (
                <CarouselItem key={item.id}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`flex flex-col items-center justify-center p-6 text-center rounded-2xl h-64 ${item.color} border border-white/5`}
                  >
                    {item.icon}
                    <h3 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-[-2rem]" />
            <CarouselNext className="right-[-2rem]" />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
}
