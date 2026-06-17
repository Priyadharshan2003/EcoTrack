"use client";

import { useEffect, useRef } from "react";

export function GradientMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.005;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width;
      canvas.height = height;

      // Create a premium gradient mesh effect
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, `hsla(140, 60%, 15%, 1)`); // Deep green
      gradient.addColorStop(0.5, `hsla(150, 40%, 10%, 1)`); // Darker green
      gradient.addColorStop(1, `hsla(220, 30%, 8%, 1)`); // Deep slate

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add animated orbs
      const drawOrb = (x: number, y: number, r: number, hue: number, opacity: number) => {
        const radgrad = ctx.createRadialGradient(x, y, 0, x, y, r);
        radgrad.addColorStop(0, `hsla(${hue}, 80%, 40%, ${opacity})`);
        radgrad.addColorStop(1, `hsla(${hue}, 80%, 40%, 0)`);
        
        ctx.fillStyle = radgrad;
        ctx.fillRect(0, 0, width, height);
      };

      drawOrb(
        width * 0.5 + Math.sin(time) * width * 0.2, 
        height * 0.3 + Math.cos(time * 0.8) * height * 0.2, 
        width * 0.4, 
        142, // Green
        0.15
      );
      
      drawOrb(
        width * 0.8 + Math.cos(time * 1.2) * width * 0.2, 
        height * 0.7 + Math.sin(time * 0.5) * height * 0.2, 
        width * 0.3, 
        160, // Emerald
        0.1
      );

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <canvas ref={canvasRef} className="w-full h-full opacity-60" />
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[100px]" />
    </div>
  );
}
