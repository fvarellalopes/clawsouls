"use client";

import { Sparkles } from "lucide-react";
import { SoulPreset } from "@/store/soulStore";

interface PresetCardProps {
  preset: SoulPreset;
  index: number;
  onSelect: (preset: SoulPreset) => void;
  isSelected?: boolean;
}

export function PresetCard({ preset, index, onSelect, isSelected }: PresetCardProps) {
  return (
    <div
      onClick={() => onSelect(preset)}
      className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-200 ${
        isSelected
          ? "ring-2 ring-accent/60 shadow-lg"
          : "ring-1 ring-border hover:ring-primary/30 hover:shadow-md"
      }`}
    >
      <div className="relative p-5 bg-surface">
        {/* Emoji + Name */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
            {preset.emoji}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-lg text-fg truncate">
              {preset.name}
            </h3>
            <p className="text-xs text-muted-fg truncate">{preset.creature}</p>
          </div>
          {isSelected && (
            <div className="text-accent">
              <Sparkles className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-fg line-clamp-2 mb-3 leading-relaxed">
          {preset.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {preset.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase rounded-full bg-primary/5 text-muted-fg border border-border"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
