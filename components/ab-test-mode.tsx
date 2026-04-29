"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { presets } from "@/data/presets";
import { calculateCompatibility } from "@/lib/compatibility";
import { generateSoulMD } from "@/lib/soulGenerator";
import { SoulPreset } from "@/store/soulStore";
import {
  GitCompareArrows,
  Trophy,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowLeftRight,
} from "lucide-react";

// ─── Tone bar for attribute comparison ───
function CompareBar({
  label,
  valueA,
  valueB,
  nameA,
  nameB,
}: {
  label: string;
  valueA: number;
  valueB: number;
  nameA: string;
  nameB: string;
}) {
  const diff = Math.abs(valueA - valueB);
  const winner = valueA > valueB ? nameA : valueB > valueA ? nameB : null;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-fg font-medium">{label}</span>
        <span className="text-subtle-fg font-mono text-[10px]">
          {diff > 0 ? `±${diff}` : "="}
        </span>
      </div>
      <div className="relative h-6 flex items-center gap-2">
        <span className="text-accent/80 font-mono text-xs w-8 text-right">
          {valueA}
        </span>
        <div className="flex-1 h-2 rounded-full bg-primary/10 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${valueA}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full bg-accent opacity-50"
            initial={{ width: 0 }}
            animate={{ width: `${valueB}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          />
        </div>
        <span className="text-accent/80 font-mono text-xs w-8">
          {valueB}
        </span>
        {winner && (
          <span className="text-[10px] text-accent/60 w-12 truncate">
            {winner}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Preset selector card ───
function PresetSelector({
  side,
  selectedId,
  onSelect,
  t,
}: {
  side: "A" | "B";
  selectedId: string | null;
  onSelect: (id: string) => void;
  t: any;
}) {
  const preset = selectedId
    ? presets.find((p) => p.id === selectedId)
    : null;

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-fg/80 flex items-center gap-2">
        <span
          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
            side === "A"
              ? "bg-primary/15 text-muted-fg"
              : "bg-accent/15 text-accent"
          }`}
        >
          {side}
        </span>
        {side === "A" ? t("selectPresetA") : t("selectPresetB")}
      </label>

      <Select value={selectedId || ""} onValueChange={onSelect}>
        <SelectTrigger className="bg-surface border-border text-fg rounded-xl">
          <SelectValue placeholder={t("selectPreset")} />
        </SelectTrigger>
        <SelectContent className="bg-surface border-border max-h-72 rounded-xl">
          {presets.map((p) => (
            <SelectItem
              key={p.id}
              value={p.id}
              className="text-fg/80 focus:bg-primary/15 focus:text-fg rounded-lg"
            >
              <span className="flex items-center gap-2">
                <span>{p.emoji}</span>
                <span>{p.name}</span>
                <span className="text-subtle-fg text-xs">
                  {p.creature}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {preset && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-primary/5 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{preset.emoji}</span>
            <div>
              <p className="text-sm font-semibold text-fg">
                {preset.name}
              </p>
              <p className="text-xs text-muted-fg">{preset.creature}</p>
            </div>
          </div>
          <p className="text-xs text-muted-fg leading-relaxed line-clamp-3">
            {preset.vibe}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Diff viewer ───
function DiffViewer({
  contentA,
  contentB,
  nameA,
  nameB,
}: {
  contentA: string;
  contentB: string;
  nameA: string;
  nameB: string;
}) {
  const [showAll, setShowAll] = useState(false);

  const diffs = useMemo(() => {
    const linesA = contentA.split("\n");
    const linesB = contentB.split("\n");
    const maxLen = Math.max(linesA.length, linesB.length);
    const result: {
      lineA: string;
      lineB: string;
      same: boolean;
      index: number;
    }[] = [];

    for (let i = 0; i < maxLen; i++) {
      const a = linesA[i] || "";
      const b = linesB[i] || "";
      result.push({
        lineA: a,
        lineB: b,
        same: a === b,
        index: i,
      });
    }
    return result;
  }, [contentA, contentB]);

  const differentLines = diffs.filter((d) => !d.same);
  const sameLines = diffs.filter((d) => d.same);
  const displayLines = showAll ? diffs : differentLines;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-fg/80 flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4" />
          Differences
        </p>
        <div className="flex items-center gap-3 text-xs text-subtle-fg">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500/50" />
            {differentLines.length} changed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500/50" />
            {sameLines.length} same
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="text-muted-fg hover:text-fg"
        >
          {showAll ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" /> Show differences only
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" /> Show all lines
            </>
          )}
        </Button>
      </div>

      <div className="max-h-[400px] overflow-y-auto rounded-xl border border-border">
        <table className="w-full text-xs font-mono">
          <thead className="sticky top-0 bg-surface z-10">
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left text-subtle-fg w-8">#</th>
              <th className="px-3 py-2 text-left text-subtle-fg">
                {nameA}
              </th>
              <th className="px-3 py-2 text-left text-subtle-fg">
                {nameB}
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {displayLines.map((line) => (
                <motion.tr
                  key={line.index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`border-b border-border/50 ${
                    line.same
                      ? "bg-transparent"
                      : "bg-primary/5"
                  }`}
                >
                  <td className="px-3 py-1.5 text-subtle-fg align-top">
                    {line.index + 1}
                  </td>
                  <td
                    className={`px-3 py-1.5 whitespace-pre-wrap break-all align-top ${
                      !line.same
                        ? "text-red-400/70 bg-red-500/5"
                        : "text-muted-fg"
                    }`}
                  >
                    {line.lineA || <span className="text-subtle-fg/30 italic">—</span>}
                  </td>
                  <td
                    className={`px-3 py-1.5 whitespace-pre-wrap break-all align-top ${
                      !line.same
                        ? "text-green-400/70 bg-green-500/5"
                        : "text-muted-fg"
                    }`}
                  >
                    {line.lineB || <span className="text-subtle-fg/30 italic">—</span>}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main component ───
export function ABTestMode() {
  const t = useTranslations("compare");
  const [presetAId, setPresetAId] = useState<string | null>(null);
  const [presetBId, setPresetBId] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const presetA = presetAId
    ? presets.find((p) => p.id === presetAId)
    : null;
  const presetB = presetBId
    ? presets.find((p) => p.id === presetBId)
    : null;

  const compatibility = useMemo(() => {
    if (!presetA || !presetB) return null;
    return calculateCompatibility(presetA, presetB);
  }, [presetA, presetB]);

  const soulMDA = useMemo(
    () => (presetA ? generateSoulMD(presetA as any) : ""),
    [presetA]
  );
  const soulMDB = useMemo(
    () => (presetB ? generateSoulMD(presetB as any) : ""),
    [presetB]
  );

  const canCompare = presetA && presetB && presetA.id !== presetB.id;

  const toneAttrs = [
    { key: "humor", label: "Humor" },
    { key: "formality", label: "Formality" },
    { key: "emojiUsage", label: "Emoji" },
    { key: "verbosity", label: "Verbosity" },
    { key: "consciousness", label: "Consciousness" },
    { key: "questioning", label: "Questioning" },
  ] as const;

  const bigFive = [
    { key: "openness", label: "Openness" },
    { key: "conscientiousness", label: "Conscientiousness" },
    { key: "extraversion", label: "Extraversion" },
    { key: "agreeableness", label: "Agreeableness" },
    { key: "neuroticism", label: "Neuroticism" },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PresetSelector
          side="A"
          selectedId={presetAId}
          onSelect={setPresetAId}
          t={t}
        />
        <PresetSelector
          side="B"
          selectedId={presetBId}
          onSelect={setPresetBId}
          t={t}
        />
      </div>

      {/* Compare button */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowComparison(true)}
          disabled={!canCompare}
          className="bg-primary  text-primary-fg border-0 shadow-lg  rounded-xl px-8 py-3 text-base font-semibold disabled:opacity-30"
        >
          <GitCompareArrows className="mr-2 h-5 w-5" />
          {t("compare")}
        </Button>
      </div>

      {/* Comparison results */}
      <AnimatePresence>
        {showComparison && canCompare && compatibility && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Compatibility score */}
            <Card className="p-6 bg-surface border-border rounded-2xl">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-accent" />
                  <h3 className="text-lg font-display font-bold text-fg">
                    {t("similarity")}
                  </h3>
                </div>

                {/* Circular score */}
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="rgba(168,85,247,0.1)"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="url(#compatGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      animate={{
                        strokeDashoffset:
                          2 * Math.PI * 42 * (1 - compatibility.overall / 100),
                      }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient
                        id="compatGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className="text-3xl font-bold font-display text-primary font-display"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {compatibility.overall}%
                    </motion.span>
                    <span className="text-xs text-muted-fg">{t("match")}</span>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                  {[
                    { label: t("tone"), value: compatibility.breakdown.tone },
                    {
                      label: t("personality"),
                      value: compatibility.breakdown.personality,
                    },
                    { label: t("style"), value: compatibility.breakdown.style },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="text-center p-3 rounded-xl bg-primary/5"
                    >
                      <p className="text-xs text-subtle-fg mb-1">
                        {item.label}
                      </p>
                      <p className="text-lg font-bold text-fg">
                        {item.value}%
                      </p>
                    </div>
                  ))}
                </div>

                {/* Top similar / different */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {compatibility.topSimilar.length > 0 && (
                    <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400/70 border border-green-500/20">
                      Most similar: {compatibility.topSimilar.join(", ")}
                    </span>
                  )}
                  {compatibility.topDifferent.length > 0 && (
                    <span className="text-xs px-3 py-1 rounded-full bg-red-500/10 text-red-400/70 border border-red-500/20">
                      Most different: {compatibility.topDifferent.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </Card>

            {/* Attribute sliders comparison */}
            <Card className="p-6 bg-surface border-border rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-display font-semibold text-fg">
                  Attribute Comparison
                </h3>
                <span className="ml-auto text-xs text-subtle-fg flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {presetA.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    {presetB.name}
                  </span>
                </span>
              </div>

              <div className="space-y-6">
                {/* Tone attributes */}
                <div>
                  <p className="text-[10px] text-subtle-fg uppercase tracking-widest mb-3">
                    Tone
                  </p>
                  <div className="space-y-2">
                    {toneAttrs.map((attr) => (
                      <CompareBar
                        key={attr.key}
                        label={attr.label}
                        valueA={(presetA as any)[attr.key] ?? 50}
                        valueB={(presetB as any)[attr.key] ?? 50}
                        nameA={presetA.name}
                        nameB={presetB.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Big Five */}
                <div>
                  <p className="text-[10px] text-subtle-fg uppercase tracking-widest mb-3">
                    Personality (Big Five)
                  </p>
                  <div className="space-y-2">
                    {bigFive.map((trait) => (
                      <CompareBar
                        key={trait.key}
                        label={trait.label}
                        valueA={(presetA as any)[trait.key] ?? 50}
                        valueB={(presetB as any)[trait.key] ?? 50}
                        nameA={presetA.name}
                        nameB={presetB.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Side-by-side SOUL.md previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { preset: presetA, md: soulMDA },
                { preset: presetB, md: soulMDB },
              ].map(({ preset, md }) => (
                <Card
                  key={preset.id}
                  className="p-4 bg-surface border-border rounded-2xl"
                >
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                    <span className="text-xl">{preset.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-fg">
                        {preset.name}
                      </p>
                      <p className="text-xs text-subtle-fg">
                        SOUL.md Preview
                      </p>
                    </div>
                  </div>
                  <pre className="text-xs text-muted-fg whitespace-pre-wrap break-words max-h-64 overflow-y-auto font-body leading-relaxed">
                    {md}
                  </pre>
                </Card>
              ))}
            </div>

            {/* Diff viewer */}
            <Card className="p-6 bg-surface border-border rounded-2xl">
              <DiffViewer
                contentA={soulMDA}
                contentB={soulMDB}
                nameA={presetA.name}
                nameB={presetB.name}
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
