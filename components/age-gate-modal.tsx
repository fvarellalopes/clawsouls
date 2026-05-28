"use client";

import { useState, useEffect, useRef } from "react";
import { useNsfwStore } from "@/store/nsfwStore";

interface AgeGateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgeGateModal({ isOpen, onClose }: AgeGateModalProps) {
  const { confirmAge } = useNsfwStore();
  const [typedText, setTypedText] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const fullText = "ACESSO RESTRITO // VERIFICAÇÃO DE IDADE NECESSÁRIA";
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  // Typing effect
  useEffect(() => {
    if (!isOpen) {
      setTypedText("");
      setShowButtons(false);
      return;
    }

    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(intervalRef.current);
        setTimeout(() => setShowButtons(true), 300);
      }
    }, 40);

    return () => clearInterval(intervalRef.current);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    confirmAge();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full mx-4 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glitch border effect */}
        <div className="absolute inset-0 border-2 border-red-500/60 animate-pulse" />
        <div className="absolute inset-1 border border-red-500/30" />

        {/* Scan lines overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.1) 2px, rgba(255,0,0,0.1) 4px)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Warning icon */}
          <div className="text-6xl mb-6">🔞</div>

          {/* Typing text */}
          <div className="font-mono text-red-500 text-sm mb-2 h-6 tracking-wider">
            {typedText}
            <span className="animate-pulse">█</span>
          </div>

          {/* Subtitle */}
          <p className="text-muted-foreground text-xs mt-4 mb-8 font-mono">
            {">"} Este conteúdo é destinado a maiores de 18 anos.
            <br />
            {">"} Confirme sua idade para continuar.
          </p>

          {/* Buttons */}
          <div
            className="flex flex-col gap-3 transition-opacity duration-500"
            style={{ opacity: showButtons ? 1 : 0 }}
          >
            <button
              onClick={handleConfirm}
              disabled={!showButtons}
              className="w-full py-3 px-6 bg-red-500/20 border border-red-500 text-red-400 font-mono text-sm uppercase tracking-wider hover:bg-red-500/30 hover:text-red-300 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {"["}CONFIRMAR 18+{"]"}
            </button>
            <button
              onClick={onClose}
              disabled={!showButtons}
              className="w-full py-3 px-6 bg-foreground/5 border border-border text-muted-foreground font-mono text-sm uppercase tracking-wider hover:bg-foreground/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {"["}SAIR{"]"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
