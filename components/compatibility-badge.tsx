"use client";

import { useMemo } from "react";
import { calculateCompatibility } from "@/lib/compatibility";
import { SoulState, SoulPreset } from "@/store/soulStore";
import { useTranslations } from "next-intl";

interface CompatibilityBadgeProps {
  currentSoul: SoulState["soul"];
  preset: SoulPreset;
  showBreakdown?: boolean;
}

export function CompatibilityBadge({ currentSoul, preset, showBreakdown = false }: CompatibilityBadgeProps) {
  const t = useTranslations("compatibility");
  const compatibility = useMemo(
    () => calculateCompatibility(currentSoul, preset),
    [currentSoul, preset]
  );

  const getColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-500/15 border-emerald-500/20";
    if (score >= 60) return "text-amber-400 bg-amber-500/15 border-amber-500/20";
    if (score >= 40) return "text-orange-400 bg-orange-500/15 border-orange-500/20";
    return "text-red-400 bg-red-500/15 border-red-500/20";
  };

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border animate-fade-in ${getColor(compatibility.overall)}`}
      >
        <span>{compatibility.overall}%</span>
        <span className="text-[10px] opacity-60">{t("match")}</span>
      </div>

      {showBreakdown && (
        <div className="text-[10px] text-muted-fg space-y-0.5">
          <div>{t("tone")}: {compatibility.breakdown.tone}%</div>
          <div>{t("personality")}: {compatibility.breakdown.personality}%</div>
          <div>{t("style")}: {compatibility.breakdown.style === 100 ? "✓" : "✗"}</div>
        </div>
      )}
    </div>
  );
}
