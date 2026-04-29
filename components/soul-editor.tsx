"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSoulStore, SoulPreset } from "@/store/soulStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Share2, Eye, Edit3, Palette, Settings, MessageSquare, Undo2, Redo2, Copy, Check, Save, Search, ArrowLeft, Sparkles, Wand2, X, Upload, FileJson, FileText, Plus, Trash2, Sun, Moon, ChevronDown, Zap, RotateCcw } from "lucide-react";
import { useAutoSaveStore } from "@/store/autoSaveStore";
import { usePresets } from "@/lib/usePresets";
import { attributeOptions } from "@/data/presets";
import { generateSoulMD } from "@/lib/soulGenerator";
import { exportYAML } from "@/lib/exportYAML";
import { useTranslations } from "next-intl";
import { SavePresetDialog } from "@/components/save-preset-dialog";
import { ParchmentPreview } from "@/components/parchment-preview";
import { ImportJsonDialog } from "@/components/import-json-dialog";
import { FillWithAIDialog } from "@/components/fill-with-ai-dialog";
import { useAchievementsStore } from "@/store/achievementsStore";

interface SoulEditorProps {
  locale: string;
  messages: Record<string, unknown>;
}

type Phase = "presets" | "editor";

// ─── Cyber Slider Component ──────────────────────────────────────────
function CyberSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  minLabel = "LOW",
  maxLabel = "HIGH",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="mono-data">{label}</span>
        <span style={{ color: "#facc15", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: "13px", fontWeight: 600 }}>
          {value}
        </span>
      </div>
      <input
        type="range"
        className="cyber-slider"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex justify-between text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

// ─── Cyber Toggle Component ──────────────────────────────────────────
function CyberToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="mono-data">{label}</span>
      <button
        type="button"
        className={`cyber-toggle ${checked ? "active" : ""}`}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
      />
    </div>
  );
}

export function SoulEditor({ locale, messages }: SoulEditorProps) {
  const t = useTranslations("editor");
  const tPresets = useTranslations("presetsPage");
  const { soul, setSoul, resetSoul, loadPreset, undo, redo, canUndo, canRedo, isDarkMode, setIsDarkMode } = useSoulStore();
  const { lastSaved, isSaving } = useAutoSaveStore();
  const { incrementExport, incrementShare, addLanguageUsed } = useAchievementsStore();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const presetsMessages = (messages as any)?.presets as Record<string, Record<string, string>> | undefined;
  const { presets, loading } = usePresets(presetsMessages);
  const [newCoreTruth, setNewCoreTruth] = useState("");
  const [newBoundary, setNewBoundary] = useState("");
  const [newSignaturePhrase, setNewSignaturePhrase] = useState("");
  const [fillWithAIOpen, setFillWithAIOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [quickStartDismissed, setQuickStartDismissed] = useState(false);
  const [previewFormat, setPreviewFormat] = useState<"soulmd" | "yaml">("soulmd");
  const [activeTab, setActiveTab] = useState("personality");

  // Phase: presets selection or editor
  const [phase, setPhase] = useState<Phase>("presets");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // Track language usage for achievements
  useEffect(() => {
    addLanguageUsed(locale);
  }, [locale, addLanguageUsed]);

  // Filter presets
  const filteredPresets = useMemo(() => {
    if (!searchQuery.trim()) return presets;
    const q = searchQuery.toLowerCase();
    return presets.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.creature.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
    );
  }, [presets, searchQuery]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    const handleLoadPreset = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail) {
        setSoul(custom.detail);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("load-soul-preset", handleLoadPreset);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("load-soul-preset", handleLoadPreset);
    };
  }, [undo, redo, setSoul]);

  // Close export dropdown on outside click
  useEffect(() => {
    if (!exportDropdownOpen) return;
    const handleClick = () => setExportDropdownOpen(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [exportDropdownOpen]);

  const handleAttributeChange = (attr: keyof typeof soul, value: any) => {
    setSoul({ [attr]: value });
    if (!quickStartDismissed && soul.name) {
      setQuickStartDismissed(true);
    }
  };

  const handleCoreTruthChange = (key: keyof typeof soul.coreTruths, value: boolean) => {
    setSoul({ coreTruths: { ...soul.coreTruths, [key]: value } });
  };

  const handleBoundaryChange = (key: keyof typeof soul.boundaries, value: boolean) => {
    setSoul({ boundaries: { ...soul.boundaries, [key]: value } });
  };

  const handleExport = () => {
    const content = generateSoulMD(soul);
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${soul.name.replace(/\s+/g, "-").toLowerCase()}-SOUL.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    incrementExport();
  };

  const handleShare = async () => {
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soul }),
      });
      if (res.ok) {
        const { id } = await res.json();
        const shareUrl = `${window.location.origin}/share/${id}`;
        await navigator.clipboard.writeText(shareUrl);
        setShareUrl(shareUrl);
        incrementShare();
      } else {
        const params = new URLSearchParams();
        params.set("data", btoa(JSON.stringify(soul)));
        const fallbackUrl = `${window.location.origin}/share?${params.toString()}`;
        await navigator.clipboard.writeText(fallbackUrl);
        setShareUrl(fallbackUrl);
      }
    } catch {
      const params = new URLSearchParams();
      params.set("data", btoa(JSON.stringify(soul)));
      const fallbackUrl = `${window.location.origin}/share?${params.toString()}`;
      await navigator.clipboard.writeText(fallbackUrl);
      setShareUrl(fallbackUrl);
    }
    setShareDialogOpen(true);
  };

  const handleExportJSON = () => {
    const exportData = {
      name: soul.name,
      creature: soul.creature,
      vibe: soul.vibe,
      emoji: soul.emoji,
      avatar: soul.avatar,
      coreTruths: soul.coreTruths,
      boundaries: soul.boundaries,
      customCoreTruths: soul.customCoreTruths,
      customBoundaries: soul.customBoundaries,
      vibeStyle: soul.vibeStyle,
      humor: soul.humor,
      formality: soul.formality,
      emojiUsage: soul.emojiUsage,
      verbosity: soul.verbosity,
      consciousness: soul.consciousness,
      questioning: soul.questioning,
      openness: soul.openness,
      conscientiousness: soul.conscientiousness,
      extraversion: soul.extraversion,
      agreeableness: soul.agreeableness,
      neuroticism: soul.neuroticism,
      communicationMode: soul.communicationMode,
      knowledgeDomains: soul.knowledgeDomains,
      signaturePhrases: soul.signaturePhrases,
      emotionalRange: soul.emotionalRange,
      speechPatterns: soul.speechPatterns,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${soul.name.replace(/\s+/g, "-").toLowerCase() || "soul"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    incrementExport();
  };

  const handleExportYAML = () => {
    const content = exportYAML(soul);
    const blob = new Blob([content], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${soul.name.replace(/\s+/g, "-").toLowerCase() || "soul"}.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    incrementExport();
  };

  const addCustomCoreTruth = () => {
    if (newCoreTruth.trim()) {
      setSoul({ customCoreTruths: [...(soul.customCoreTruths || []), newCoreTruth.trim()] });
      setNewCoreTruth("");
    }
  };

  const removeCustomCoreTruth = (index: number) => {
    const updated = [...(soul.customCoreTruths || [])];
    updated.splice(index, 1);
    setSoul({ customCoreTruths: updated });
  };

  const addCustomBoundary = () => {
    if (newBoundary.trim()) {
      setSoul({ customBoundaries: [...(soul.customBoundaries || []), newBoundary.trim()] });
      setNewBoundary("");
    }
  };

  const removeCustomBoundary = (index: number) => {
    const updated = [...(soul.customBoundaries || [])];
    updated.splice(index, 1);
    setSoul({ customBoundaries: updated });
  };

  const handleSelectPreset = (preset: SoulPreset) => {
    loadPreset(preset);
    setSelectedPresetId(preset.id);
    setTimeout(() => setPhase("editor"), 300);
  };

  const handleStartFromScratch = () => {
    resetSoul();
    setSelectedPresetId(null);
    setPhase("editor");
    setQuickStartDismissed(false);
  };

  const handleLoadPresetFromQuickStart = () => {
    setPhase("presets");
  };

  const soulMD = useMemo(() => generateSoulMD(soul), [soul]);
  const yamlContent = useMemo(() => exportYAML(soul), [soul]);

  const vibeStyles = useMemo(() => [
    { value: "concise", label: t("vibeStyles.concise") },
    { value: "expressive", label: t("vibeStyles.expressive") },
    { value: "sharp", label: t("vibeStyles.sharp") },
    { value: "verbose", label: t("vibeStyles.verbose") },
    { value: "minimal", label: t("vibeStyles.minimal") },
    { value: "dramatic", label: t("vibeStyles.dramatic") },
    { value: "poetic", label: t("vibeStyles.poetic") },
    { value: "technical", label: t("vibeStyles.technical") },
    { value: "casual", label: t("vibeStyles.casual") },
    { value: "formal", label: t("vibeStyles.formal") },
    { value: "balanced", label: t("vibeStyles.balanced") },
  ], [t]);

  const showQuickStart = !quickStartDismissed && !soul.name;

  // ─── PHASE 1: PRESET SELECTION ────────────────────────────────────────
  if (phase === "presets") {
    return (
      <div className="min-h-screen py-8 px-4" style={{ background: "#0a0a0f" }}>
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12" style={{ animation: "fadeInUp 0.4s ease-out" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8" style={{ background: "#facc15" }} />
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "#facc15", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", letterSpacing: "0.08em" }}>
                  Terminal Session_01
                </h1>
                <p className="mono-data" style={{ color: "rgba(255,255,255,0.4)" }}>
                  STATUS: SELECTING PRESET // TARGET: SOUL.MD
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-10" style={{ animation: "fadeInUp 0.4s ease-out 0.15s both" }}>
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2" style={{ fontSize: "18px", color: "rgba(255,255,255,0.3)" }}>
              search
            </span>
            <label htmlFor="preset-search" className="sr-only">{tPresets("searchPlaceholder")}</label>
            <input
              id="preset-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tPresets("searchPlaceholder")}
              className="cyber-input pl-11"
              aria-label={tPresets("searchPlaceholder")}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
                style={{ color: "rgba(255,255,255,0.3)" }}
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
              </button>
            )}
          </div>

          {/* Start from scratch */}
          <div style={{ animation: "fadeInUp 0.4s ease-out 0.2s both" }}>
            <button
              type="button"
              onClick={handleStartFromScratch}
              className="w-full max-w-md mb-10 p-5 cursor-pointer transition-all group text-left cyber-glass hover:border-[rgba(250,204,21,0.2)]"
              aria-label={t("startFromScratch")}
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined" style={{ color: "#facc15", fontSize: "28px" }}>auto_awesome</span>
                <div>
                  <p className="mono-data" style={{ color: "rgba(255,255,255,0.85)" }}>{t("startFromScratch")}</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{t("startFromScratchDesc")}</p>
                </div>
              </div>
            </button>
          </div>

          {/* Presets grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPresets.map((preset) => (
              <PresetCardSimple
                key={preset.id}
                preset={preset}
                onSelect={handleSelectPreset}
                isSelected={selectedPresetId === preset.id}
              />
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 mono-data" style={{ color: "rgba(255,255,255,0.4)" }}>{t("saving")}</div>
          ) : filteredPresets.length === 0 ? (
            <div className="text-center py-20">
              <p className="mono-data" style={{ color: "rgba(255,255,255,0.4)" }}>{t("noPresetsFound", { query: searchQuery })}</p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  // ─── PHASE 2: CYBER TERMINAL EDITOR ───────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
      {/* ─── TOP ACTIONS BAR ─── */}
      <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }}>
        <div className="container mx-auto max-w-[1400px] flex items-center justify-between gap-4">
          {/* Left: Title + Status */}
          <div className="flex items-center gap-3">
            <div className="w-1 h-8" style={{ background: "#facc15" }} />
            <div>
              <h1 className="text-lg font-bold" style={{ color: "#facc15", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", letterSpacing: "0.06em" }}>
                Terminal Session_01
              </h1>
              <p className="mono-data" style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px" }}>
                STATUS: CONFIGURING // TARGET: SOUL.MD
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => setPhase("presets")} className="cyber-btn" style={{ padding: "6px 12px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_back</span>
              <span className="hidden sm:inline">{t("presets")}</span>
            </button>
            <div className="w-px h-6" style={{ background: "rgba(255,255,255,0.1)" }} />
            <button onClick={undo} disabled={!canUndo()} className="cyber-btn" style={{ padding: "6px 10px" }} title={t("undoTitle")}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>undo</span>
            </button>
            <button onClick={redo} disabled={!canRedo()} className="cyber-btn" style={{ padding: "6px 10px" }} title={t("redoTitle")}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>redo</span>
            </button>
            <div className="w-px h-6" style={{ background: "rgba(255,255,255,0.1)" }} />
            <button onClick={handleShare} className="cyber-btn" style={{ padding: "6px 12px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>share</span>
              <span className="hidden sm:inline">{t("share")}</span>
            </button>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExportDropdownOpen(!exportDropdownOpen);
                }}
                className="cyber-btn-gold"
                style={{ padding: "6px 16px" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>download</span>
                <span className="hidden sm:inline">Export SOUL.md</span>
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>expand_more</span>
              </button>
              {exportDropdownOpen && (
                <div
                  className="absolute top-full right-0 mt-2 min-w-[180px] z-50 cyber-glass overflow-hidden"
                  role="menu"
                  style={{ animation: "fadeInUp 0.15s ease-out" }}
                >
                  <button
                    role="menuitem"
                    onClick={() => { handleExport(); setExportDropdownOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>description</span>
                    {t("exportDropdown.soulmd")}
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => { handleExportJSON(); setExportDropdownOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>data_object</span>
                    {t("exportDropdown.json")}
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => { handleExportYAML(); setExportDropdownOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>code</span>
                    {t("exportDropdown.yaml")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT: 7/5 SPLIT ─── */}
      <div className="px-6 py-6">
        <div className="container mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ─── LEFT COLUMN (7 cols) — Editor ─── */}
            <div className="lg:col-span-7 space-y-6">
              {/* Tabs */}
              <div className="flex gap-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {[
                  { id: "personality", label: t("tabsPersonality") || "PERSONALITY" },
                  { id: "essentials", label: t("tabsEssentials") || "BASIC INFO" },
                  { id: "style", label: t("tabsStyle") || "TONE ATTRIBUTES" },
                  { id: "advanced", label: t("tabsAdvanced") || "ADVANCED" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`cyber-tab ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ─── TAB: PERSONALITY (Big Five + Core Truths + Boundaries) ─── */}
              {activeTab === "personality" && (
                <div style={{ animation: "fadeInUp 0.25s ease-out" }}>
                  {/* Cognitive Parameters — Big Five */}
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "rgba(250,204,21,0.6)" }}>psychology</span>
                      Cognitive Parameters
                    </h3>
                    <div className="space-y-6">
                      {[
                        { key: "openness", label: t("bigFiveTraits.openness") || "OPENNESS" },
                        { key: "conscientiousness", label: t("bigFiveTraits.conscientiousness") || "CONSCIENTIOUSNESS" },
                        { key: "extraversion", label: t("bigFiveTraits.extraversion") || "EXTRAVERSION" },
                        { key: "agreeableness", label: t("bigFiveTraits.agreeableness") || "AGREEABLENESS" },
                        { key: "neuroticism", label: t("bigFiveTraits.neuroticism") || "NEUROTICISM" },
                      ].map(({ key, label }) => (
                        <CyberSlider
                          key={key}
                          label={label}
                          value={(soul as any)[key] ?? 50}
                          onChange={(v) => handleAttributeChange(key as any, v)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Core Truths */}
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "rgba(250,204,21,0.6)" }}>verified</span>
                      {t("coreTruths") || "Core Truths"}
                    </h3>
                    <div className="space-y-1">
                      {Object.entries(soul.coreTruths).map(([key, value]) => (
                        <CyberToggle
                          key={key}
                          label={t(`coreTruths.${key}`) || key}
                          checked={value}
                          onChange={(checked) => handleCoreTruthChange(key as any, checked)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Boundaries */}
                  <div className="cyber-glass p-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "rgba(250,204,21,0.6)" }}>shield</span>
                      {t("boundaries") || "Boundaries"}
                    </h3>
                    <div className="space-y-1">
                      {Object.entries(soul.boundaries).map(([key, value]) => (
                        <CyberToggle
                          key={key}
                          label={t(`boundaries.${key}`) || key}
                          checked={value}
                          onChange={(checked) => handleBoundaryChange(key as any, checked)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB: BASIC INFO (Essentials) ─── */}
              {activeTab === "essentials" && (
                <div style={{ animation: "fadeInUp 0.25s ease-out" }}>
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "rgba(250,204,21,0.6)" }}>badge</span>
                      {t("tabsEssentials") || "Basic Info"}
                    </h3>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="mono-data">{t("nameLabel") || "NAME"}</label>
                          <input
                            value={soul.name}
                            onChange={(e) => handleAttributeChange("name", e.target.value)}
                            placeholder="Nexo"
                            className="cyber-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="mono-data">{t("creatureLabel") || "CREATURE"}</label>
                          <input
                            value={soul.creature}
                            onChange={(e) => handleAttributeChange("creature", e.target.value)}
                            placeholder="AI / Ghost in the machine"
                            className="cyber-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="mono-data">{t("emojiLabel") || "EMOJI"}</label>
                          <input
                            value={soul.emoji}
                            onChange={(e) => handleAttributeChange("emoji", e.target.value)}
                            placeholder="👁️"
                            className="cyber-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="mono-data">{t("avatarLabel") || "AVATAR"}</label>
                          <input
                            value={soul.avatar || ""}
                            onChange={(e) => handleAttributeChange("avatar", e.target.value || undefined)}
                            placeholder="https://..."
                            className="cyber-input"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="mono-data">{t("vibeLabel") || "VIBE"}</label>
                          <button
                            onClick={() => setFillWithAIOpen(true)}
                            className="cyber-btn"
                            style={{ padding: "4px 10px", fontSize: "10px" }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>auto_awesome</span>
                            <span>{t("fillWithAI") || "FILL WITH AI"}</span>
                          </button>
                        </div>
                        <textarea
                          value={soul.vibe}
                          onChange={(e) => handleAttributeChange("vibe", e.target.value)}
                          placeholder="e.g., Strong opinions, weakly held. I don't hedge..."
                          rows={3}
                          className="cyber-textarea"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="mono-data">{t("vibeStyleLabel") || "VIBE STYLE"}</label>
                        <select
                          value={soul.vibeStyle}
                          onChange={(e) => handleAttributeChange("vibeStyle", e.target.value)}
                          className="cyber-input"
                          style={{ cursor: "pointer" }}
                        >
                          {vibeStyles.map((style) => (
                            <option key={style.value} value={style.value} style={{ background: "#0a0a0f", color: "#fff" }}>
                              {style.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  {showQuickStart && (
                    <div className="cyber-glass p-6" style={{ animation: "fadeInUp 0.3s ease-out" }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="mono-data" style={{ color: "#facc15" }}>
                          <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle" }}>bolt</span>
                          {t("quickStart.title") || "QUICK START"}
                        </h3>
                        <button
                          onClick={() => setQuickStartDismissed(true)}
                          className="text-xs hover:underline transition-colors mono-data"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          {t("dismissQuickStart") || "DISMISS"}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          onClick={() => { resetSoul(); setQuickStartDismissed(true); }}
                          className="p-4 text-left transition-all hover:scale-[1.02] cyber-glass"
                        >
                          <span className="material-symbols-outlined block mb-2" style={{ color: "rgba(255,255,255,0.5)", fontSize: "20px" }}>restart_alt</span>
                          <p className="mono-data text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>{t("quickStart.scratch")}</p>
                          <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{t("quickStart.scratchDesc")}</p>
                        </button>
                        <button
                          onClick={handleLoadPresetFromQuickStart}
                          className="p-4 text-left transition-all hover:scale-[1.02] cyber-glass"
                        >
                          <span className="material-symbols-outlined block mb-2" style={{ color: "rgba(255,255,255,0.5)", fontSize: "20px" }}>auto_awesome</span>
                          <p className="mono-data text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>{t("quickStart.preset")}</p>
                          <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{t("quickStart.presetDesc")}</p>
                        </button>
                        <button
                          onClick={() => { setQuickStartDismissed(true); setFillWithAIOpen(true); }}
                          className="p-4 text-left transition-all hover:scale-[1.02] cyber-glass"
                        >
                          <span className="material-symbols-outlined block mb-2" style={{ color: "rgba(255,255,255,0.5)", fontSize: "20px" }}>wand_stars</span>
                          <p className="mono-data text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>{t("quickStart.ai")}</p>
                          <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{t("quickStart.aiDesc")}</p>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ─── TAB: TONE ATTRIBUTES (Style) ─── */}
              {activeTab === "style" && (
                <div style={{ animation: "fadeInUp 0.25s ease-out" }}>
                  {/* Syntactic Tone Profile */}
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "rgba(250,204,21,0.6)" }}>tune</span>
                      Syntactic Tone Profile
                    </h3>
                    <div className="space-y-6">
                      {/* Verbosity + Humor sliders */}
                      <CyberSlider
                        label={t("attributes.verbosity") || "VERBOSITY"}
                        value={soul.verbosity ?? 50}
                        onChange={(v) => handleAttributeChange("verbosity", v)}
                        minLabel="TERSE"
                        maxLabel="VERBOSE"
                      />
                      <CyberSlider
                        label={t("attributes.humor") || "HUMOR"}
                        value={soul.humor ?? 50}
                        onChange={(v) => handleAttributeChange("humor", v)}
                        minLabel="SERIOUS"
                        maxLabel="PLAYFUL"
                      />
                      <CyberSlider
                        label={t("attributes.formality") || "FORMALITY"}
                        value={soul.formality ?? 50}
                        onChange={(v) => handleAttributeChange("formality", v)}
                        minLabel="CASUAL"
                        maxLabel="FORMAL"
                      />
                      <CyberSlider
                        label={t("attributes.emojiUsage") || "EMOJI USAGE"}
                        value={soul.emojiUsage ?? 50}
                        onChange={(v) => handleAttributeChange("emojiUsage", v)}
                        minLabel="NONE"
                        maxLabel="HEAVY"
                      />
                      <CyberSlider
                        label={t("attributes.consciousness") || "CONSCIOUSNESS"}
                        value={soul.consciousness ?? 50}
                        onChange={(v) => handleAttributeChange("consciousness", v)}
                        minLabel="REFLEXIVE"
                        maxLabel="DELIBERATE"
                      />
                      <CyberSlider
                        label={t("attributes.questioning") || "QUESTIONING"}
                        value={soul.questioning ?? 50}
                        onChange={(v) => handleAttributeChange("questioning", v)}
                        minLabel="DECLARATIVE"
                        maxLabel="INQUISITIVE"
                      />
                    </div>
                  </div>

                  {/* Communication Mode */}
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "rgba(250,204,21,0.6)" }}>forum</span>
                      {t("communicationMode") || "Communication Mode"}
                    </h3>
                    <select
                      value={soul.communicationMode || "direct"}
                      onChange={(e) => handleAttributeChange("communicationMode", e.target.value)}
                      className="cyber-input"
                      style={{ cursor: "pointer" }}
                    >
                      <option value="direct" style={{ background: "#0a0a0f", color: "#fff" }}>{t("commModes.direct")}</option>
                      <option value="socratic" style={{ background: "#0a0a0f", color: "#fff" }}>{t("commModes.socratic")}</option>
                      <option value="diagnostic" style={{ background: "#0a0a0f", color: "#fff" }}>{t("commModes.diagnostic")}</option>
                      <option value="encouraging" style={{ background: "#0a0a0f", color: "#fff" }}>{t("commModes.encouraging")}</option>
                      <option value="challenging" style={{ background: "#0a0a0f", color: "#fff" }}>{t("commModes.challenging")}</option>
                      <option value="flirty" style={{ background: "#0a0a0f", color: "#fff" }}>{t("commModes.flirty")}</option>
                    </select>
                  </div>

                  {/* Emotional Range */}
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "rgba(250,204,21,0.6)" }}>mood</span>
                      {t("emotionalRange") || "Emotional Range"}
                    </h3>
                    <CyberSlider
                      label={t("emotionalRange") || "RANGE"}
                      value={soul.emotionalRange ?? 50}
                      onChange={(v) => handleAttributeChange("emotionalRange", v)}
                      minLabel={t("emotionalLabels.stoic") || "STOIC"}
                      maxLabel={t("emotionalLabels.dramatic") || "DRAMATIC"}
                    />
                  </div>

                  {/* Knowledge Domains */}
                  <div className="cyber-glass p-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "rgba(250,204,21,0.6)" }}>school</span>
                      {t("knowledgeDomains") || "Knowledge Domains"}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "tech", label: t("domains.tech") },
                        { value: "philosophy", label: t("domains.philosophy") },
                        { value: "pop-culture", label: t("domains.popCulture") },
                        { value: "science", label: t("domains.science") },
                        { value: "history", label: t("domains.history") },
                        { value: "arts", label: t("domains.arts") },
                        { value: "sports", label: t("domains.sports") },
                        { value: "business", label: t("domains.business") },
                        { value: "psychology", label: t("domains.psychology") },
                        { value: "literature", label: t("domains.literature") },
                      ].map((domain) => {
                        const isSelected = (soul.knowledgeDomains || []).includes(domain.value);
                        return (
                          <button
                            key={domain.value}
                            type="button"
                            onClick={() => {
                              const current = soul.knowledgeDomains || [];
                              const updated = isSelected
                                ? current.filter((d) => d !== domain.value)
                                : [...current, domain.value];
                              handleAttributeChange("knowledgeDomains", updated);
                            }}
                            className="p-2.5 text-xs text-left transition-all rounded"
                            style={{
                              background: isSelected ? "rgba(250,204,21,0.1)" : "rgba(255,255,255,0.02)",
                              border: `1px solid ${isSelected ? "rgba(250,204,21,0.3)" : "rgba(255,255,255,0.06)"}`,
                              color: isSelected ? "#facc15" : "rgba(255,255,255,0.5)",
                              fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                            }}
                          >
                            {domain.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB: ADVANCED ─── */}
              {activeTab === "advanced" && (
                <div style={{ animation: "fadeInUp 0.25s ease-out" }}>
                  {/* Speech Patterns */}
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "rgba(250,204,21,0.6)" }}>record_voice_over</span>
                      {t("speechPatterns") || "Speech Patterns"}
                    </h3>
                    <div className="space-y-5">
                      <CyberToggle
                        label={t("alliteration") || "ALLITERATION"}
                        checked={soul.speechPatterns?.alliteration ?? false}
                        onChange={(checked) =>
                          handleAttributeChange("speechPatterns", {
                            ...soul.speechPatterns,
                            alliteration: checked,
                          })
                        }
                      />
                      {[
                        { key: "rhymeTendency", label: t("rhymeTendency") || "RHYME TENDENCY", default: 10 },
                        { key: "metaphorFrequency", label: t("metaphorFrequency") || "METAPHOR FREQUENCY", default: 30 },
                        { key: "technicalJargon", label: t("technicalJargon") || "TECHNICAL JARGON", default: 40 },
                        { key: "slangUsage", label: t("slangUsage") || "SLANG USAGE", default: 20 },
                      ].map(({ key, label, default: defaultVal }) => (
                        <CyberSlider
                          key={key}
                          label={label}
                          value={(soul.speechPatterns as any)?.[key] ?? defaultVal}
                          onChange={(v) =>
                            handleAttributeChange("speechPatterns", {
                              ...soul.speechPatterns,
                              [key]: v,
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Custom Core Truths */}
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "rgba(250,204,21,0.6)" }}>add_circle</span>
                      {t("customCoreTruths") || "Custom Core Truths"}
                    </h3>
                    <div className="space-y-2 mb-4">
                      {(soul.customCoreTruths || []).map((truth, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <span className="flex-1 text-xs" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>{truth}</span>
                          <button
                            onClick={() => removeCustomCoreTruth(i)}
                            className="cyber-btn"
                            style={{ padding: "4px", border: "none" }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "rgba(255,100,100,0.6)" }}>delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={newCoreTruth}
                        onChange={(e) => setNewCoreTruth(e.target.value)}
                        placeholder={t("customCoreTruthsPlaceholder") || "Add a core truth..."}
                        className="cyber-input flex-1"
                        onKeyDown={(e) => e.key === "Enter" && addCustomCoreTruth()}
                      />
                      <button onClick={addCustomCoreTruth} className="cyber-btn" style={{ padding: "8px" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
                      </button>
                    </div>
                  </div>

                  {/* Custom Boundaries */}
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "rgba(250,204,21,0.6)" }}>add_circle</span>
                      {t("customBoundaries") || "Custom Boundaries"}
                    </h3>
                    <div className="space-y-2 mb-4">
                      {(soul.customBoundaries || []).map((boundary, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <span className="flex-1 text-xs" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>{boundary}</span>
                          <button
                            onClick={() => removeCustomBoundary(i)}
                            className="cyber-btn"
                            style={{ padding: "4px", border: "none" }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "rgba(255,100,100,0.6)" }}>delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={newBoundary}
                        onChange={(e) => setNewBoundary(e.target.value)}
                        placeholder={t("customBoundariesPlaceholder") || "Add a boundary..."}
                        className="cyber-input flex-1"
                        onKeyDown={(e) => e.key === "Enter" && addCustomBoundary()}
                      />
                      <button onClick={addCustomBoundary} className="cyber-btn" style={{ padding: "8px" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
                      </button>
                    </div>
                  </div>

                  {/* Signature Phrases */}
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "rgba(250,204,21,0.6)" }}>format_quote</span>
                      {t("signaturePhrases") || "Signature Phrases"}
                    </h3>
                    <div className="space-y-2 mb-4">
                      {(soul.signaturePhrases || []).map((phrase, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <span className="flex-1 text-xs italic" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>"{phrase}"</span>
                          <button
                            onClick={() => {
                              const updated = [...(soul.signaturePhrases || [])];
                              updated.splice(i, 1);
                              handleAttributeChange("signaturePhrases", updated);
                            }}
                            className="cyber-btn"
                            style={{ padding: "4px", border: "none" }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "rgba(255,100,100,0.6)" }}>delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                    {(soul.signaturePhrases || []).length >= 5 ? (
                      <p className="mono-data text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {t("signaturePhrasesMaxReached") || "Maximum 5 phrases reached"}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              value={newSignaturePhrase}
                              onChange={(e) => setNewSignaturePhrase(e.target.value.slice(0, 50))}
                              placeholder={t("signaturePhrasesPlaceholder") || "Add a phrase..."}
                              maxLength={50}
                              className="cyber-input pr-12"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && newSignaturePhrase.trim()) {
                                  handleAttributeChange("signaturePhrases", [...(soul.signaturePhrases || []), newSignaturePhrase.trim()]);
                                  setNewSignaturePhrase("");
                                }
                              }}
                            />
                            <span
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] tabular-nums"
                              style={{ color: newSignaturePhrase.length >= 45 ? "rgba(255,100,100,0.6)" : "rgba(255,255,255,0.25)", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
                            >
                              {newSignaturePhrase.length}/50
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              if (newSignaturePhrase.trim()) {
                                handleAttributeChange("signaturePhrases", [...(soul.signaturePhrases || []), newSignaturePhrase.trim()]);
                                setNewSignaturePhrase("");
                              }
                            }}
                            disabled={!newSignaturePhrase.trim()}
                            className="cyber-btn"
                            style={{ padding: "8px" }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
                          </button>
                        </div>
                        <p className="mono-data text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                          {t("signaturePhrasesCounter", { count: (soul.signaturePhrases || []).length }) || `${(soul.signaturePhrases || []).length}/5`}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="cyber-glass p-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "rgba(250,204,21,0.6)" }}>settings</span>
                      {t("customize") || "Actions"}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setPhase("presets")}
                        className="cyber-btn"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>auto_awesome</span>
                        {t("switchPreset") || "Switch Preset"}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(t("resetConfirm") || "Reset all fields?")) {
                            resetSoul();
                            setQuickStartDismissed(false);
                          }
                        }}
                        className="cyber-btn"
                        style={{ borderColor: "rgba(255,100,100,0.3)", color: "rgba(255,100,100,0.7)" }}
                      >
                        {t("reset") || "Reset"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ─── RIGHT COLUMN (5 cols) — Live Preview ─── */}
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <ParchmentPreview
                  content={soulMD}
                  name={soul.name}
                  emoji={soul.emoji}
                  toneAttributes={{
                    humor: soul.humor,
                    formality: soul.formality,
                    emojiUsage: soul.emojiUsage,
                    verbosity: soul.verbosity,
                    consciousness: soul.consciousness,
                    questioning: soul.questioning,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent style={{ background: "#111118", borderColor: "rgba(255,255,255,0.1)" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#facc15", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", letterSpacing: "0.06em" }}>
              {t("shareLink") || "Share Link"}
            </DialogTitle>
            <DialogDescription style={{ color: "rgba(255,255,255,0.5)" }}>
              {t("shareDesc") || "Share this link with others"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <input
              readOnly
              value={shareUrl}
              className="cyber-input"
            />
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{t("shareTip") || "Link copied to clipboard"}</p>
          </div>
          <DialogFooter>
            <button onClick={() => setShareDialogOpen(false)} className="cyber-btn-gold">
              {t("close") || "Close"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fill with AI Dialog */}
      <FillWithAIDialog
        open={fillWithAIOpen}
        onOpenChange={setFillWithAIOpen}
        currentSoul={soul}
        onApply={(values) => {
          setSoul(values);
          setQuickStartDismissed(true);
        }}
      />
    </div>
  );
}

// ─── Cyber Preset Card ───────────────────────────────────────────────
function PresetCardSimple({ preset, onSelect, isSelected }: { preset: SoulPreset; onSelect: (p: SoulPreset) => void; isSelected: boolean }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(preset)}
      className="p-5 cursor-pointer w-full text-left transition-all duration-200 ease-out cyber-glass hover:border-[rgba(250,204,21,0.2)]"
      style={{
        borderColor: isSelected ? "rgba(250,204,21,0.3)" : undefined,
        boxShadow: isSelected ? "0 0 15px rgba(250,204,21,0.1)" : undefined,
      }}
      aria-label={`${preset.name} — ${preset.creature}`}
      aria-pressed={isSelected}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">{preset.emoji || "✨"}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", letterSpacing: "0.04em" }}>
            {preset.name}
          </h3>
          <p className="text-[10px] mt-0.5 mono-data" style={{ color: "rgba(255,255,255,0.35)" }}>{preset.creature}</p>
          <p className="text-xs mt-2 line-clamp-2" style={{ color: "rgba(255,255,255,0.4)" }}>{preset.description}</p>
          {preset.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {preset.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[9px] rounded"
                  style={{
                    background: "rgba(250,204,21,0.08)",
                    color: "rgba(250,204,21,0.6)",
                    border: "1px solid rgba(250,204,21,0.15)",
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
