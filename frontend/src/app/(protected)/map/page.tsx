"use client";

import dynamic from "next/dynamic";
import { Leaf } from "lucide-react";

// Dynamically import the map component to avoid SSR issues with Leaflet
const LiveHeatMap = dynamic(() => import("@/components/map/live-heat-map"), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-muted animate-pulse rounded-xl" />,
});

export default function MapPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Leaf className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Pulse</h1>
          <p className="text-muted-foreground mt-1">
            Real-time heat map showing local carbon emissions and reduction hotspots.
          </p>
        </div>
      </div>

      <div className="relative">
        <LiveHeatMap />
        
        {/* Overlay for aesthetic */}
        <div className="absolute top-4 right-4 z-[400] bg-background/80 backdrop-blur-md border border-border/50 rounded-lg p-4 shadow-xl">
          <h3 className="font-semibold text-sm mb-2">Legend</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>High Emissions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Low Emissions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
