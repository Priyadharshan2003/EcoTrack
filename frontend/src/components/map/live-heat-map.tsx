"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";

// Function to generate dynamic dummy data around a given center
function generatePoints(center: [number, number], count: number = 30): [number, number, number][] {
  return Array.from({ length: count }).map(() => {
    // Random offset within roughly ~5km
    const latOffset = (Math.random() - 0.5) * 0.08;
    const lngOffset = (Math.random() - 0.5) * 0.08;
    // Intensity between 0.3 and 1.0
    const intensity = 0.3 + Math.random() * 0.7;
    return [center[0] + latOffset, center[1] + lngOffset, intensity];
  });
}

function HeatmapLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    // @ts-expect-error - leaflet.heat adds this to L
    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 12,
      max: 1.0,
      gradient: {
        0.4: "blue",
        0.6: "cyan",
        0.7: "lime",
        0.8: "yellow",
        1.0: "red",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}

export default function LiveHeatMap() {
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [points, setPoints] = useState<[number, number, number][]>([]);

  useEffect(() => {
    // Fix Leaflet's default icon paths issue
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    // Determine user location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: [number, number] = [position.coords.latitude, position.coords.longitude];
          setCenter(loc);
          setPoints(generatePoints(loc, 50));
        },
        (error) => {
          console.warn("Geolocation failed or denied, using fallback location:", error.message);
          const defaultLoc: [number, number] = [37.7749, -122.4194]; // SF Fallback
          setCenter(defaultLoc);
          setPoints(generatePoints(defaultLoc, 30));
        },
        { timeout: 8000 }
      );
    } else {
      const defaultLoc: [number, number] = [37.7749, -122.4194];
      setTimeout(() => {
        setCenter(defaultLoc);
        setPoints(generatePoints(defaultLoc, 30));
      }, 0);
    }
  }, []);

  if (!center) {
    return (
      <div className="w-full h-[600px] bg-muted animate-pulse rounded-xl flex items-center justify-center border border-border">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <span className="text-muted-foreground font-medium animate-pulse">Locating your community...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg border border-border">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <HeatmapLayer points={points} />
      </MapContainer>
    </div>
  );
}
