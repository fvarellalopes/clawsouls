"use client";

import React from "react";
import { SoulPreset } from "@/store/soulStore";
import { avatarUrl } from "@/lib/avatar";
import { useRatingsStore } from "@/store/ratingsStore";
import { calculateKarma } from "@/lib/karma";
import { useTranslations } from "next-intl";

interface PresetCardProps {
  preset: SoulPreset;
  index: number;
  onSelect: (preset: SoulPreset) => void;
  isSelected?: boolean;
}

function KarmaBadge({ preset }: { preset: SoulPreset }) {
  const { getAggregate } = useRatingsStore();
  const agg = getAggregate(preset.id);
  const karma = calculateKarma(preset, agg.likes, agg.dislikes, agg.avgStars);
  return (
    <div
      className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold font-mono"
      style={{
        background: karma.score > 60 ? "color-mix(in srgb, var(--color-accent) 15%, transparent)" : karma.score > 30 ? "color-mix(in srgb, var(--primary) 15%, transparent)" : "color-mix(in srgb, var(--destructive) 15%, transparent)",
        color: karma.score > 60 ? "var(--color-accent)" : karma.score > 30 ? "var(--primary)" : "var(--destructive)",
        border: `1px solid ${karma.score > 60 ? "color-mix(in srgb, var(--color-accent) 30%, transparent)" : karma.score > 30 ? "color-mix(in srgb, var(--primary) 30%, transparent)" : "color-mix(in srgb, var(--destructive) 30%, transparent)"}`,
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: "10px" }}>
        {karma.icon}
      </span>
      {karma.score}
    </div>
  );
}

function StarRating({ presetId, compact }: { presetId: string; compact?: boolean }) {
  const { getStars, setStars } = useRatingsStore();
  const stars = getStars(presetId);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setStars(presetId, star === stars ? 0 : star);
          }}
          className="cursor-pointer hover:scale-125 transition-transform"
          style={{ lineHeight: 0 }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: compact ? "12px" : "14px",
              color: star <= stars ? "var(--primary)" : "var(--muted-fg)",
              fontVariationSettings: star <= stars ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            star
          </span>
        </button>
      ))}
    </div>
  );
}

function LikeButton({ presetId }: { presetId: string }) {
  const t = useTranslations("karma");
  const { getLike, toggleLike, getAggregate } = useRatingsStore();
  const liked = getLike(presetId);
  const agg = getAggregate(presetId);

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleLike(presetId);
        }}
        className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono transition-all hover:scale-105 cursor-pointer"
        style={{
          background: liked === true ? "color-mix(in srgb, var(--primary) 15%, transparent)" : "transparent",
          color: liked === true ? "var(--primary)" : "var(--muted-fg)",
          border: `1px solid ${liked === true ? "color-mix(in srgb, var(--primary) 30%, transparent)" : "var(--border)"}`,
        }}
        aria-label={liked === true ? t("liked") : t("like")}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: "13px",
            fontVariationSettings: liked === true ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          thumb_up
        </span>
        {agg.likes > 0 && (
          <span className="text-[10px] font-mono">{agg.likes}</span>
        )}
      </button>
    </div>
  );
}

export const PresetCard = React.memo(function PresetCard({
  preset,
  index,
  onSelect,
  isSelected,
}: PresetCardProps) {
  const tEditor = useTranslations("editor");

  return (
    <button
      type="button"
      onClick={() => onSelect(preset)}
      className={`relative group cursor-pointer w-full text-left overflow-hidden rounded-lg flex flex-col h-full transition-all duration-300 ${
        isSelected
          ? "bg-foreground/5 border-primary-container/60 shadow-lg shadow-primary/10"
          : "bg-foreground/[0.02] border-border hover:border-primary-container/50 hover:shadow-md hover:shadow-primary/5"
      } backdrop-blur-md border`}
      aria-label={`${preset.name} — ${preset.creature}`}
      aria-pressed={isSelected}
    >
      {/* Gold accent bar — top-left */}
      <div className="absolute top-0 left-0 w-8 h-[2px] bg-primary-container" />

      {/* Karma badge — top-right */}
      <div className="absolute top-3 right-3 z-10">
        <KarmaBadge preset={preset} />
      </div>

      {/* Image / Emoji section */}
      <div className="relative p-4 border-b border-border/50 aspect-square overflow-hidden bg-background/50 flex items-center justify-center">
        <img
          src={avatarUrl(preset) || preset.avatar}
          alt={preset.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 rounded"
        />

        {/* Version badge — top-left of image */}
        <div className="absolute top-6 left-6 bg-background/80 backdrop-blur-sm border border-border px-2 py-1 rounded">
          <span className="font-label-caps text-label-caps text-foreground/80">
            {tEditor(`vibeStyles.${preset.vibeStyle || "balanced"}`)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow gap-3">
        <div className="flex flex-col gap-1">
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

        {/* Rating row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <StarRating presetId={preset.id} compact />
          <LikeButton presetId={preset.id} />
        </div>

        {/* Load button */}
        <div className="mt-auto pt-2">
          <div className="w-full bg-transparent border border-border text-foreground font-label-caps text-label-caps py-3 rounded group-hover:bg-primary-container group-hover:border-primary-container group-hover:text-primary-foreground transition-all duration-300 flex items-center justify-center gap-2">
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
