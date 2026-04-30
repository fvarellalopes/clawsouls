"use client";

import { useEffect, useState } from "react";

interface ExportAnimationProps {
  onComplete: () => void;
}

export function ExportAnimation({ onComplete }: ExportAnimationProps) {
  const [stage, setStage] = useState<"drawing" | "pulsing" | "done">("drawing");

  useEffect(() => {
    // Stage 1: Lines draw in (0 to 800ms)
    const t1 = setTimeout(() => setStage("pulsing"), 800);
    
    // Stage 2: Chip pulses (800ms to 1500ms)
    const t2 = setTimeout(() => {
      setStage("done");
      onComplete();
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#09090b]/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* SVG Circuit Lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          fill="none"
          stroke="rgba(250, 204, 21, 0.4)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Top lines */}
          <path d="M50 0 V35" className="animate-[draw_0.5s_ease-out_forwards]" strokeDasharray="50" strokeDashoffset="50" />
          <path d="M20 10 L40 30 V40" className="animate-[draw_0.6s_ease-out_forwards]" strokeDasharray="60" strokeDashoffset="60" />
          <path d="M80 10 L60 30 V40" className="animate-[draw_0.6s_ease-out_forwards]" strokeDasharray="60" strokeDashoffset="60" />
          
          {/* Bottom lines */}
          <path d="M50 100 V65" className="animate-[draw_0.5s_ease-out_forwards]" strokeDasharray="50" strokeDashoffset="50" />
          <path d="M20 90 L40 70 V60" className="animate-[draw_0.6s_ease-out_forwards]" strokeDasharray="60" strokeDashoffset="60" />
          <path d="M80 90 L60 70 V60" className="animate-[draw_0.6s_ease-out_forwards]" strokeDasharray="60" strokeDashoffset="60" />
          
          {/* Side lines */}
          <path d="M0 50 H35" className="animate-[draw_0.5s_ease-out_forwards]" strokeDasharray="50" strokeDashoffset="50" />
          <path d="M100 50 H65" className="animate-[draw_0.5s_ease-out_forwards]" strokeDasharray="50" strokeDashoffset="50" />
        </svg>

        {/* Center Chip */}
        <div 
          className={`relative z-10 w-20 h-20 bg-[#131315] border-2 border-[#facc15] flex items-center justify-center transition-all duration-300
            ${stage === "pulsing" ? "scale-110 shadow-[0_0_40px_rgba(250,204,21,0.6)]" : "scale-100 shadow-[0_0_15px_rgba(250,204,21,0.2)]"}
          `}
        >
          <div className="absolute inset-2 border border-[#facc15]/30" />
          <span className="text-[#facc15] font-mono font-bold tracking-widest text-sm" style={{ textShadow: "0 0 10px rgba(250,204,21,0.5)" }}>
            SOUL
          </span>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
      `}} />
    </div>
  );
}
