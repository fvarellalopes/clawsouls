"use client";

import React from "react";
import { SoulPreset } from "@/store/soulStore";
import { avatarUrl } from "@/lib/avatar";

interface PresetCardProps {
  preset: SoulPreset;
  index: number;
  onSelect: (preset: SoulPreset) => void;
  isSelected?: boolean;
}

export const PresetCard = React.memo(function PresetCard({
  preset,
  index,
  onSelect,
  isSelected,
}: PresetCardProps) {
  const archCode = `ARCH-${String(index + 1).padStart(2, "0")}`;

  return (
    <button
      type="button"
      onClick={() => onSelect(preset)}
      className={`relative group cursor-pointer w-full text-left overflow-hidden rounded-lg flex flex-col h-full transition-all duration-300 ${
        isSelected
          ? "bg-foreground/5 border-primary-container/60 shadow-[0_0_30px_rgba(250,204,21,0.1)]"
          : "bg-foreground/[0.02] border-border hover:border-primary-container/50 hover:shadow-[0_0_30px_rgba(250,204,21,0.05)]"
      } backdrop-blur-md border`}
      aria-label={`${preset.name} — ${preset.creature}`}
      aria-pressed={isSelected}
    >
      {/* Gold accent bar — top-left */}
      <div className="absolute top-0 left-0 w-8 h-[2px] bg-primary-container" />

      {/* Image / Emoji section */}
      <div className="relative p-4 border-b border-border/50 aspect-square overflow-hidden bg-background/50 flex items-center justify-center">
        <img
          src={avatarUrl(preset) || preset.avatar}
          alt={preset.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 rounded"
        />

        {/* Version badge — top-right */}
        <div className="absolute top-6 right-6 bg-background/80 backdrop-blur-sm border border-border px-2 py-1 rounded">
          <span className="font-label-caps text-label-caps text-foreground/80">
            v{preset.vibeStyle || "1.0"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-mono-data text-mono-data text-sm text-primary-container">
            {archCode}
          </span>
          <h3 className="font-display text-lg text-foreground">{preset.name}</h3>
        </div>

        <p className="font-body-sm text-body-sm text-muted-foreground flex-grow line-clamp-3 leading-relaxed">
          {preset.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {preset.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-[10px] font-medium tracking-wide rounded-full border border-border text-foreground/50 font-mono"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Load button */}
        <div className="mt-auto pt-2">
          <div className="w-full bg-transparent border border-border text-foreground font-label-caps text-label-caps py-3 rounded group-hover:bg-primary-container group-hover:border-primary-container group-hover:text-black transition-all duration-300 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            LOAD PRESET
          </div>
        </div>
      </div>
    </button>
  );
});
