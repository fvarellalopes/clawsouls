"use client";

import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.04,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(preset)}
      className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
        isSelected
          ? "ring-2 ring-amber-400/60 shadow-lg shadow-amber-500/20"
          : "ring-1 ring-purple-500/20 hover:ring-purple-400/40"
      }`}
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-purple-600/0 to-amber-600/0 group-hover:from-purple-600/10 group-hover:via-transparent group-hover:to-amber-600/5 transition-all duration-500" />

      {/* Top highlight line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/0 to-transparent group-hover:via-purple-500/50 transition-all duration-500" />

      <div className="relative p-5 bg-[#140d24]/80 backdrop-blur-sm">
        {/* Emoji + Name */}
        <div className="flex items-center gap-3 mb-3">
          <motion.span
            className="text-3xl"
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
          >
            {preset.emoji}
          </motion.span>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-lg text-purple-100 truncate tracking-wide">
              {preset.name}
            </h3>
            <p className="text-xs text-purple-400/60 truncate">{preset.creature}</p>
          </div>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-amber-400"
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-purple-200/50 line-clamp-2 mb-3 leading-relaxed">
          {preset.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {preset.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase rounded-full bg-purple-500/10 text-purple-300/60 border border-purple-500/10 group-hover:border-purple-500/20 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
