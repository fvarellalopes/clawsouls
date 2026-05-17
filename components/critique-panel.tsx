"use client";

import { useState, useCallback } from "react";
import { SoulPreset } from "@/store/soulStore";
import { calculateKarma } from "@/lib/karma";
import { useTranslations } from "next-intl";

interface CritiquePanelProps {
  preset: SoulPreset;
  likes?: number;
  dislikes?: number;
  avgStars?: number;
}

export function CritiquePanel({ preset, likes = 0, dislikes = 0, avgStars = 0 }: CritiquePanelProps) {
  const t = useTranslations("karma");
  const karma = calculateKarma(preset, likes, dislikes, avgStars);
  const [critique, setCritique] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const generateCritique = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/critique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preset: {
            name: preset.name,
            creature: preset.creature,
            vibe: preset.vibe,
            description: preset.description,
            tags: preset.tags,
            openness: preset.openness,
            conscientiousness: preset.conscientiousness,
            extraversion: preset.extraversion,
            agreeableness: preset.agreeableness,
            neuroticism: preset.neuroticism,
            humor: preset.humor,
            formality: preset.formality,
            signaturePhrases: preset.signaturePhrases,
            knowledgeDomains: preset.knowledgeDomains,
          },
          karmaScore: karma.score,
          issues: karma.issues,
        }),
      });
      const data = await res.json();
      setCritique(data.critique || "Unable to generate critique.");
    } catch {
      setCritique("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  }, [preset, karma]);

  if (karma.score >= 35) return null;

  return (
    <div
      className="rounded-lg border overflow-hidden transition-all duration-300"
      style={{
        borderColor: "var(--destructive)",
        background: "color-mix(in srgb, var(--destructive) 5%, var(--surface))",
      }}
    >
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer hover:bg-foreground/5 transition-colors"
      >
        <span className="material-symbols-outlined text-lg" style={{ color: "var(--destructive)" }}>
          psychiatry
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm" style={{ color: "var(--destructive)" }}>
              {t("critiqueTitle")}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono"
              style={{
                background: "var(--destructive)",
                color: "var(--bg)",
              }}
            >
              {t("karmaScore", { score: karma.score })}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-fg)" }}>
            {t("critiqueSubtitle")}
          </p>
        </div>
        <span
          className="material-symbols-outlined text-sm transition-transform duration-200"
          style={{
            color: "var(--muted-fg)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          expand_more
        </span>
      </button>

      {/* Body — expanded */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Issues list */}
          <div className="space-y-1">
            {karma.issues.map((issue) => (
              <div key={issue} className="flex items-center gap-2 text-xs" style={{ color: "var(--muted-fg)" }}>
                <span className="material-symbols-outlined text-sm" style={{ color: "var(--destructive)" }}>
                  error
                </span>
                {t(`issues.${issue}`)}
              </div>
            ))}
          </div>

          {/* Score breakdown */}
          <div className="grid grid-cols-4 gap-2">
            {(["personality", "vibe", "completeness", "community"] as const).map((key) => {
              const maxVal = key === "personality" ? 30 : key === "vibe" ? 25 : key === "completeness" ? 25 : 20;
              const val = karma.breakdown[key];
              const pct = (val / maxVal) * 100;
              return (
                <div key={key} className="flex flex-col items-center gap-1">
                  <div className="w-full h-1.5 rounded-full bg-foreground/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: pct > 60 ? "rgb(34,197,94)" : pct > 30 ? "var(--primary)" : "var(--destructive)",
                      }}
                    />
                  </div>
                  <span className="text-[9px] font-mono uppercase" style={{ color: "var(--muted-fg)" }}>
                    {t(`breakdown.${key}`)} {val}/{maxVal}
                  </span>
                </div>
              );
            })}
          </div>

          {/* LLM Critique */}
          {!critique && (
            <button
              type="button"
              onClick={generateCritique}
              disabled={loading}
              className="w-full py-2 px-4 rounded border text-sm font-mono flex items-center justify-center gap-2 transition-all hover:opacity-80 disabled:opacity-50 cursor-pointer"
              style={{
                borderColor: "var(--destructive)",
                color: "var(--destructive)",
                background: "transparent",
              }}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  {t("analyzing")}
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                  {t("generateCritique")}
                </>
              )}
            </button>
          )}

          {critique && (
            <div
              className="rounded p-3 text-sm leading-relaxed"
              style={{
                background: "var(--bg)",
                color: "var(--fg)",
                border: "1px solid var(--border)",
              }}
            >
              <span className="material-symbols-outlined text-xs mr-1" style={{ color: "var(--primary)" }}>
                auto_awesome
              </span>
              {critique}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
