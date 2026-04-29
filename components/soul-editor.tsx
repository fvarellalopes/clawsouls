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
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12" style={{ animation: "fadeInUp 0.4s ease-out" }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <Sparkles className="h-4 w-4" style={{ color: "hsl(var(--accent))" }} />
              <span className="text-sm font-display tracking-wider" style={{ color: "hsl(var(--foreground-muted))" }}>{t("chooseYourBeginning")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary font-display tracking-wider mb-4">
              {t("pickASoul")}
            </h1>
            <p className="text-lg max-w-xl mx-auto font-body" style={{ color: "hsl(var(--foreground-muted))" }}>
              {t("pickASoulDesc")}
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-10" style={{ animation: "fadeInUp 0.4s ease-out 0.15s both" }}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "hsl(var(--foreground-muted))" }} aria-hidden="true" />
            <label htmlFor="preset-search" className="sr-only">{tPresets("searchPlaceholder")}</label>
            <Input
              id="preset-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tPresets("searchPlaceholder")}
              className="pl-11 rounded-xl h-12"
              style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              aria-label={tPresets("searchPlaceholder")}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
                style={{ color: "hsl(var(--foreground-muted))" }}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Start from scratch button */}
          <div style={{ animation: "fadeInUp 0.4s ease-out 0.2s both" }}>
            <button
              type="button"
              onClick={handleStartFromScratch}
              className="max-w-md mx-auto mb-10 p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all group text-center hover:border-opacity-60 w-full"
              style={{ borderColor: "hsl(var(--border))", background: "transparent" }}
              aria-label={t("startFromScratch")}
            >
              <Wand2 className="h-8 w-8 mx-auto mb-2 transition-colors group-hover:scale-110" style={{ color: "hsl(var(--foreground-muted))" }} aria-hidden="true" />
              <p className="font-display tracking-wide transition-colors" style={{ color: "hsl(var(--foreground))" }}>
                {t("startFromScratch")}
              </p>
              <p className="text-xs mt-1" style={{ color: "hsl(var(--foreground-muted))" }}>{t("startFromScratchDesc")}</p>
            </button>
          </div>

          {/* Presets grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPresets.map((preset, i) => (
              <PresetCardSimple
                key={preset.id}
                preset={preset}
                onSelect={handleSelectPreset}
                isSelected={selectedPresetId === preset.id}
              />
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12" style={{ color: "hsl(var(--foreground-muted))" }}>{t("saving")}</div>
          ) : filteredPresets.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-body" style={{ color: "hsl(var(--foreground-muted))" }}>{t("noPresetsFound", { query: searchQuery })}</p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  // ─── PHASE 2: SPLIT-PANE EDITOR ───────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .editor-tab-content {
          animation: fadeInUp 0.25s ease-out;
        }
        .export-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 4px;
          min-width: 160px;
          border-radius: 8px;
          overflow: hidden;
          z-index: 50;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          animation: fadeInUp 0.15s ease-out;
        }
        .export-dropdown button {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 12px;
          text-align: left;
          font-size: 0.875rem;
          transition: background 0.15s;
          cursor: pointer;
        }
      `}</style>
      <div className="min-h-screen py-6 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* ─── SIMPLIFIED TOOLBAR ─── */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* Left: Back, Undo, Redo, Auto-save */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPhase("presets")}
                style={{ color: "hsl(var(--foreground-muted))" }}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t("presets")}
              </Button>
              <div className="h-5 w-px" style={{ background: "hsl(var(--border))" }} />
              <div className="flex items-center gap-1">
                <Button onClick={undo} variant="ghost" size="icon" disabled={!canUndo()} title={t("undoTitle")} aria-label={t("undoTitle")}>
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button onClick={redo} variant="ghost" size="icon" disabled={!canRedo()} title={t("redoTitle")} aria-label={t("redoTitle")}>
                  <Redo2 className="h-4 w-4" />
                </Button>
              </div>
              {isSaving && (
                <span className="text-sm flex items-center" role="status" aria-live="polite" style={{ color: "hsl(var(--foreground-muted))" }}>
                  <Save className="h-3 w-3 mr-1 animate-pulse" /> {t("saving")}
                </span>
              )}
              {!isSaving && lastSaved && (
                <span className="text-xs" aria-live="off" style={{ color: "hsl(var(--foreground-muted))" }}>
                  {t("savedTime", { time: new Date(lastSaved).toLocaleTimeString() })}
                </span>
              )}
            </div>

            {/* Right: Theme, Import, Export dropdown, Share, Save Preset */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
                title={isDarkMode ? t("switchToLight") : t("switchToDark")}
                aria-label={isDarkMode ? t("switchToLight") : t("switchToDark")}
                style={{ color: "hsl(var(--foreground-muted))" }}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <div className="h-5 w-px" style={{ background: "hsl(var(--border))" }} />

              {/* Import */}
              <ImportJsonDialog />

              {/* Export Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExportDropdownOpen(!exportDropdownOpen);
                  }}
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("exportDropdown.title")}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
                {exportDropdownOpen && (
                  <div
                    className="export-dropdown"
                    role="menu"
                    style={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }}
                  >
                    <button
                      role="menuitem"
                      onClick={() => { handleExport(); setExportDropdownOpen(false); }}
                      style={{ color: "hsl(var(--foreground))" }}
                      className="hover:bg-[hsl(var(--accent)/0.1)]"
                    >
                      <FileText className="h-4 w-4" aria-hidden="true" />
                      {t("exportDropdown.soulmd")}
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => { handleExportJSON(); setExportDropdownOpen(false); }}
                      style={{ color: "hsl(var(--foreground))" }}
                      className="hover:bg-[hsl(var(--accent)/0.1)]"
                    >
                      <FileJson className="h-4 w-4" aria-hidden="true" />
                      {t("exportDropdown.json")}
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => { handleExportYAML(); setExportDropdownOpen(false); }}
                      style={{ color: "hsl(var(--foreground))" }}
                      className="hover:bg-[hsl(var(--accent)/0.1)]"
                    >
                      <FileText className="h-4 w-4" aria-hidden="true" />
                      {t("exportDropdown.yaml")}
                    </button>
                  </div>
                )}
              </div>

              {/* Share */}
              <Button onClick={handleShare} variant="outline" size="sm" style={{ borderColor: "hsl(var(--border))" }}>
                <Share2 className="mr-2 h-4 w-4" />
                {t("share")}
              </Button>

              {/* Save Preset */}
              <SavePresetDialog />
            </div>
          </div>

          {/* ─── QUICK START (conditional) ─── */}
          {showQuickStart && (
            <div className="mb-6 rounded-xl p-5 transition-all" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", animation: "fadeInUp 0.3s ease-out" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display tracking-wider text-base" style={{ color: "hsl(var(--foreground))" }}>
                  <Zap className="inline h-4 w-4 mr-2" style={{ color: "hsl(var(--accent))" }} />
                  {t("quickStart.title")}
                </h3>
                <button
                  onClick={() => setQuickStartDismissed(true)}
                  className="text-xs hover:underline transition-colors"
                  style={{ color: "hsl(var(--foreground-muted))" }}
                >
                  {t("dismissQuickStart")}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => { resetSoul(); setQuickStartDismissed(true); }}
                  className="p-4 rounded-lg text-left transition-all hover:scale-[1.02] group"
                  style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                >
                  <RotateCcw className="h-5 w-5 mb-2 transition-colors" style={{ color: "hsl(var(--foreground-muted))" }} />
                  <p className="font-display text-sm tracking-wide" style={{ color: "hsl(var(--foreground))" }}>{t("quickStart.scratch")}</p>
                  <p className="text-xs mt-1" style={{ color: "hsl(var(--foreground-muted))" }}>{t("quickStart.scratchDesc")}</p>
                </button>
                <button
                  onClick={handleLoadPresetFromQuickStart}
                  className="p-4 rounded-lg text-left transition-all hover:scale-[1.02] group"
                  style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                >
                  <Sparkles className="h-5 w-5 mb-2 transition-colors" style={{ color: "hsl(var(--foreground-muted))" }} />
                  <p className="font-display text-sm tracking-wide" style={{ color: "hsl(var(--foreground))" }}>{t("quickStart.preset")}</p>
                  <p className="text-xs mt-1" style={{ color: "hsl(var(--foreground-muted))" }}>{t("quickStart.presetDesc")}</p>
                </button>
                <button
                  onClick={() => { setQuickStartDismissed(true); setFillWithAIOpen(true); }}
                  className="p-4 rounded-lg text-left transition-all hover:scale-[1.02] group"
                  style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                >
                  <Wand2 className="h-5 w-5 mb-2 transition-colors" style={{ color: "hsl(var(--foreground-muted))" }} />
                  <p className="font-display text-sm tracking-wide" style={{ color: "hsl(var(--foreground))" }}>{t("quickStart.ai")}</p>
                  <p className="text-xs mt-1" style={{ color: "hsl(var(--foreground-muted))" }}>{t("quickStart.aiDesc")}</p>
                </button>
              </div>
            </div>
          )}

          {/* ─── SPLIT PANE: 50/50 ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Form */}
            <div className="space-y-6">
              <Tabs defaultValue="essentials" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 rounded-xl p-1" style={{ background: "hsl(var(--card))" }}>
                  <TabsTrigger value="essentials" className="rounded-lg text-xs sm:text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>
                    <MessageSquare className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{t("tabsEssentials")}</span>
                    <span className="sm:hidden">Ess.</span>
                  </TabsTrigger>
                  <TabsTrigger value="style" className="rounded-lg text-xs sm:text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>
                    <Palette className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{t("tabsStyle")}</span>
                    <span className="sm:hidden">Style</span>
                  </TabsTrigger>
                  <TabsTrigger value="personality" className="rounded-lg text-xs sm:text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>
                    <Settings className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{t("tabsPersonality")}</span>
                    <span className="sm:hidden">Pers.</span>
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="rounded-lg text-xs sm:text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>
                    <Edit3 className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{t("tabsAdvanced")}</span>
                    <span className="sm:hidden">Adv.</span>
                  </TabsTrigger>
                </TabsList>

                {/* ─── TAB 1: ESSENTIALS ─── */}
                <TabsContent value="essentials">
                  <div className="editor-tab-content">
                    <Card style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                      <CardHeader className="pb-4">
                        <CardTitle className="font-display tracking-wider text-lg">{t("tabsEssentials")}</CardTitle>
                        <CardDescription>{t("essentialsDesc")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label className="text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>{t("nameLabel")}</Label>
                            <Input
                              value={soul.name}
                              onChange={(e) => handleAttributeChange("name", e.target.value)}
                              placeholder="Nexo"
                              style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>{t("creatureLabel")}</Label>
                            <Input
                              value={soul.creature}
                              onChange={(e) => handleAttributeChange("creature", e.target.value)}
                              placeholder="AI / Ghost in the machine"
                              style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>{t("emojiLabel")}</Label>
                            <Input
                              value={soul.emoji}
                              onChange={(e) => handleAttributeChange("emoji", e.target.value)}
                              placeholder="👁️"
                              style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>{t("avatarLabel")}</Label>
                            <Input
                              value={soul.avatar || ""}
                              onChange={(e) => handleAttributeChange("avatar", e.target.value || undefined)}
                              placeholder="https://..."
                              style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>{t("vibeLabel")}</Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFillWithAIOpen(true)}
                                className="h-7 px-2 gap-1.5"
                                style={{ color: "hsl(var(--foreground-muted))" }}
                              >
                                <Wand2 className="h-3.5 w-3.5" />
                                <span className="text-xs">{t("fillWithAI")}</span>
                              </Button>
                            </div>
                            <Textarea
                              value={soul.vibe}
                              onChange={(e) => handleAttributeChange("vibe", e.target.value)}
                              placeholder="e.g., Strong opinions, weakly held. I don't hedge..."
                              rows={3}
                              style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
                              className="rounded-xl resize-none"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>{t("vibeStyleLabel")}</Label>
                            <Select value={soul.vibeStyle} onValueChange={(value) => handleAttributeChange("vibeStyle", value)}>
                              <SelectTrigger className="rounded-xl" style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}>
                                <SelectValue placeholder={t("selectVibeStyle")} />
                              </SelectTrigger>
                              <SelectContent style={{ background: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}>
                                {vibeStyles.map((style) => (
                                  <SelectItem key={style.value} value={style.value}>
                                    {style.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* ─── TAB 2: STYLE ─── */}
                <TabsContent value="style">
                  <div className="editor-tab-content space-y-6">
                    {/* Tone Sliders */}
                    <Card style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                      <CardHeader className="pb-4">
                        <CardTitle className="font-display tracking-wider text-lg">{t("toneAttributes")}</CardTitle>
                        <CardDescription>{t("toneAttributesDesc")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        {Object.entries(attributeOptions).map(([key, options]) => (
                          <div key={key} className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label className="capitalize text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>{t(`attributes.${key}`)}</Label>
                              <span className="text-xs font-mono px-2 py-0.5 rounded-md" style={{ color: "hsl(var(--accent))", background: "hsl(var(--accent) / 0.1)" }}>
                                {options.find(o => o.value === (soul as any)[key])?.label || "—"}
                              </span>
                            </div>
                            <Slider
                              value={[(soul as any)[key] as number]}
                              onValueChange={(value) => handleAttributeChange(key as any, value[0])}
                              max={100}
                              min={0}
                              step={1}
                            />
                            <div className="flex justify-between text-[10px] px-1 uppercase tracking-wider" style={{ color: "hsl(var(--foreground-muted))" }}>
                              <span>{t("low")}</span>
                              <span>{t("high")}</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Communication Mode */}
                    <Card style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                      <CardHeader className="pb-4">
                        <CardTitle className="font-display tracking-wider text-lg">{t("communicationMode")}</CardTitle>
                        <CardDescription>{t("communicationModeDesc")}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Select
                          value={soul.communicationMode || "direct"}
                          onValueChange={(value) => handleAttributeChange("communicationMode", value)}
                        >
                          <SelectTrigger className="rounded-xl" style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent style={{ background: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}>
                            <SelectItem value="direct">{t("commModes.direct")}</SelectItem>
                            <SelectItem value="socratic">{t("commModes.socratic")}</SelectItem>
                            <SelectItem value="diagnostic">{t("commModes.diagnostic")}</SelectItem>
                            <SelectItem value="encouraging">{t("commModes.encouraging")}</SelectItem>
                            <SelectItem value="challenging">{t("commModes.challenging")}</SelectItem>
                            <SelectItem value="flirty">{t("commModes.flirty")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>

                    {/* Emotional Range */}
                    <Card style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                      <CardHeader className="pb-4">
                        <CardTitle className="font-display tracking-wider text-lg">{t("emotionalRange")}</CardTitle>
                        <CardDescription>{t("emotionalRangeDesc")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono px-2 py-0.5 rounded-md" style={{ color: "hsl(var(--accent))", background: "hsl(var(--accent) / 0.1)" }}>
                            {soul.emotionalRange <= 20 ? t("emotionalLabels.stoic") :
                             soul.emotionalRange <= 40 ? t("emotionalLabels.reserved") :
                             soul.emotionalRange <= 60 ? t("emotionalLabels.balanced") :
                             soul.emotionalRange <= 80 ? t("emotionalLabels.expressive") :
                             t("emotionalLabels.dramatic")}
                          </span>
                        </div>
                        <Slider
                          value={[soul.emotionalRange ?? 50]}
                          onValueChange={(value) => handleAttributeChange("emotionalRange", value[0])}
                          max={100}
                          min={0}
                          step={1}
                        />
                        <div className="flex justify-between text-[10px] px-1 uppercase tracking-wider" style={{ color: "hsl(var(--foreground-muted))" }}>
                          <span>{t("emotionalLabels.stoic")}</span>
                          <span>{t("emotionalLabels.dramatic")}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Knowledge Domains */}
                    <Card style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                      <CardHeader className="pb-4">
                        <CardTitle className="font-display tracking-wider text-lg">{t("knowledgeDomains")}</CardTitle>
                        <CardDescription>{t("knowledgeDomainsDesc")}</CardDescription>
                      </CardHeader>
                      <CardContent>
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
                                className="p-2.5 rounded-xl text-sm text-left transition-all"
                                style={{
                                  background: isSelected ? "hsl(var(--primary) / 0.15)" : "hsl(var(--background))",
                                  border: `1px solid ${isSelected ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border))"}`,
                                  color: isSelected ? "hsl(var(--foreground))" : "hsl(var(--foreground-muted))",
                                }}
                              >
                                {domain.label}
                              </button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* ─── TAB 3: PERSONALITY ─── */}
                <TabsContent value="personality">
                  <div className="editor-tab-content space-y-6">
                    {/* Big Five */}
                    <Card style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                      <CardHeader className="pb-4">
                        <CardTitle className="font-display tracking-wider text-lg">{t("bigFive")}</CardTitle>
                        <CardDescription>{t("bigFiveDesc")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        {[
                          { key: "openness", label: t("bigFiveTraits.openness") },
                          { key: "conscientiousness", label: t("bigFiveTraits.conscientiousness") },
                          { key: "extraversion", label: t("bigFiveTraits.extraversion") },
                          { key: "agreeableness", label: t("bigFiveTraits.agreeableness") },
                          { key: "neuroticism", label: t("bigFiveTraits.neuroticism") },
                        ].map(({ key, label }) => (
                          <div key={key} className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label className="text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>{label}</Label>
                              <span className="text-xs font-mono px-2 py-0.5 rounded-md" style={{ color: "hsl(var(--accent))", background: "hsl(var(--accent) / 0.1)" }}>
                                {(soul as any)[key] ?? 50}
                              </span>
                            </div>
                            <Slider
                              value={[(soul as any)[key] ?? 50]}
                              onValueChange={(value) => handleAttributeChange(key as any, value[0])}
                              max={100}
                              min={0}
                              step={1}
                            />
                            <div className="flex justify-between text-[10px] px-1 uppercase tracking-wider" style={{ color: "hsl(var(--foreground-muted))" }}>
                              <span>{t("low")}</span>
                              <span>{t("high")}</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Core Truths */}
                    <Card style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                      <CardHeader className="pb-4">
                        <CardTitle className="font-display tracking-wider text-lg">{t("coreTruths")}</CardTitle>
                        <CardDescription>{t("coreTruthsDesc")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Object.entries(soul.coreTruths).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-3 rounded-xl transition-colors" style={{ background: "hsl(var(--background))" }}>
                            <Label htmlFor={`core-${key}`} className="capitalize cursor-pointer" style={{ color: "hsl(var(--foreground-muted))" }}>
                              {t(`coreTruths.${key}`)}
                            </Label>
                            <Switch
                              id={`core-${key}`}
                              checked={value}
                              onCheckedChange={(checked) => handleCoreTruthChange(key as any, checked)}
                            />
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Boundaries */}
                    <Card style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                      <CardHeader className="pb-4">
                        <CardTitle className="font-display tracking-wider text-lg">{t("boundaries")}</CardTitle>
                        <CardDescription>{t("boundariesDesc")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Object.entries(soul.boundaries).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-3 rounded-xl transition-colors" style={{ background: "hsl(var(--background))" }}>
                            <Label htmlFor={`boundary-${key}`} className="capitalize cursor-pointer" style={{ color: "hsl(var(--foreground-muted))" }}>
                              {t(`boundaries.${key}`)}
                            </Label>
                            <Switch
                              id={`boundary-${key}`}
                              checked={value}
                              onCheckedChange={(checked) => handleBoundaryChange(key as any, checked)}
                            />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* ─── TAB 4: ADVANCED ─── */}
                <TabsContent value="advanced">
                  <div className="editor-tab-content space-y-6">
                    {/* Speech Patterns */}
                    <Card style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                      <CardHeader className="pb-4">
                        <CardTitle className="font-display tracking-wider text-lg">{t("speechPatterns")}</CardTitle>
                        <CardDescription>{t("speechPatternsDesc")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-3 rounded-xl transition-colors" style={{ background: "hsl(var(--background))" }}>
                          <Label htmlFor="speech-alliteration" className="cursor-pointer" style={{ color: "hsl(var(--foreground-muted))" }}>
                            {t("alliteration")}
                          </Label>
                          <Switch
                            id="speech-alliteration"
                            checked={soul.speechPatterns?.alliteration ?? false}
                            onCheckedChange={(checked) =>
                              handleAttributeChange("speechPatterns", {
                                ...soul.speechPatterns,
                                alliteration: checked,
                              })
                            }
                          />
                        </div>

                        {[
                          { key: "rhymeTendency", label: t("rhymeTendency"), default: 10 },
                          { key: "metaphorFrequency", label: t("metaphorFrequency"), default: 30 },
                          { key: "technicalJargon", label: t("technicalJargon"), default: 40 },
                          { key: "slangUsage", label: t("slangUsage"), default: 20 },
                        ].map(({ key, label, default: defaultVal }) => (
                          <div key={key} className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label className="text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>{label}</Label>
                              <span className="text-xs font-mono px-2 py-0.5 rounded-md" style={{ color: "hsl(var(--accent))", background: "hsl(var(--accent) / 0.1)" }}>
                                {(soul.speechPatterns as any)?.[key] ?? defaultVal}
                              </span>
                            </div>
                            <Slider
                              value={[(soul.speechPatterns as any)?.[key] ?? defaultVal]}
                              onValueChange={(value) =>
                                handleAttributeChange("speechPatterns", {
                                  ...soul.speechPatterns,
                                  [key]: value[0],
                                })
                              }
                              max={100}
                              min={0}
                              step={1}
                            />
                            <div className="flex justify-between text-[10px] px-1 uppercase tracking-wider" style={{ color: "hsl(var(--foreground-muted))" }}>
                              <span>{t("low")}</span>
                              <span>{t("high")}</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Custom Core Truths */}
                    <Card style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                      <CardHeader className="pb-4">
                        <CardTitle className="font-display tracking-wider text-lg">{t("customCoreTruths")}</CardTitle>
                        <CardDescription>{t("customCoreTruthsDesc")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {(soul.customCoreTruths || []).map((truth, i) => (
                          <div key={i} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "hsl(var(--background))" }}>
                            <span className="flex-1 text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>{truth}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              style={{ color: "hsl(var(--destructive) / 0.5)" }}
                              onClick={() => removeCustomCoreTruth(i)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            value={newCoreTruth}
                            onChange={(e) => setNewCoreTruth(e.target.value)}
                            placeholder={t("customCoreTruthsPlaceholder")}
                            className="rounded-xl flex-1"
                            style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
                            onKeyDown={(e) => e.key === "Enter" && addCustomCoreTruth()}
                          />
                          <Button onClick={addCustomCoreTruth} size="icon" variant="outline" style={{ borderColor: "hsl(var(--border))" }}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Custom Boundaries */}
                    <Card style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                      <CardHeader className="pb-4">
                        <CardTitle className="font-display tracking-wider text-lg">{t("customBoundaries")}</CardTitle>
                        <CardDescription>{t("customBoundariesDesc")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {(soul.customBoundaries || []).map((boundary, i) => (
                          <div key={i} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "hsl(var(--background))" }}>
                            <span className="flex-1 text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>{boundary}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              style={{ color: "hsl(var(--destructive) / 0.5)" }}
                              onClick={() => removeCustomBoundary(i)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            value={newBoundary}
                            onChange={(e) => setNewBoundary(e.target.value)}
                            placeholder={t("customBoundariesPlaceholder")}
                            className="rounded-xl flex-1"
                            style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
                            onKeyDown={(e) => e.key === "Enter" && addCustomBoundary()}
                          />
                          <Button onClick={addCustomBoundary} size="icon" variant="outline" style={{ borderColor: "hsl(var(--border))" }}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Signature Phrases */}
                    <Card style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                      <CardHeader className="pb-4">
                        <CardTitle className="font-display tracking-wider text-lg">{t("signaturePhrases")}</CardTitle>
                        <CardDescription>{t("signaturePhrasesDesc")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {(soul.signaturePhrases || []).map((phrase, i) => (
                          <div key={i} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "hsl(var(--background))" }}>
                            <span className="flex-1 text-sm italic" style={{ color: "hsl(var(--foreground-muted))" }}>"{phrase}"</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              style={{ color: "hsl(var(--destructive) / 0.5)" }}
                              onClick={() => {
                                const updated = [...(soul.signaturePhrases || [])];
                                updated.splice(i, 1);
                                handleAttributeChange("signaturePhrases", updated);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        {(soul.signaturePhrases || []).length >= 10 && (
                          <p className="text-xs" style={{ color: "hsl(var(--foreground-muted))" }}>
                            {t("signaturePhrasesMaxReached")}
                          </p>
                        )}
                        {(soul.signaturePhrases || []).length < 10 && (
                          <div className="space-y-1.5">
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Input
                                  value={newSignaturePhrase}
                                  onChange={(e) => setNewSignaturePhrase(e.target.value.slice(0, 50))}
                                  placeholder={t("signaturePhrasesPlaceholder")}
                                  maxLength={50}
                                  className="rounded-xl pr-12"
                                  style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && newSignaturePhrase.trim()) {
                                      handleAttributeChange("signaturePhrases", [...(soul.signaturePhrases || []), newSignaturePhrase.trim()]);
                                      setNewSignaturePhrase("");
                                    }
                                  }}
                                />
                                <span
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] tabular-nums"
                                  style={{ color: newSignaturePhrase.length >= 45 ? "hsl(var(--destructive))" : "hsl(var(--foreground-muted))" }}
                                >
                                  {newSignaturePhrase.length}/50
                                </span>
                              </div>
                              <Button
                                onClick={() => {
                                  if (newSignaturePhrase.trim()) {
                                    handleAttributeChange("signaturePhrases", [...(soul.signaturePhrases || []), newSignaturePhrase.trim()]);
                                    setNewSignaturePhrase("");
                                  }
                                }}
                                size="icon"
                                variant="outline"
                                disabled={!newSignaturePhrase.trim()}
                                style={{ borderColor: "hsl(var(--border))" }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-[10px] pl-1" style={{ color: "hsl(var(--foreground-muted))" }}>
                              {t("signaturePhrasesCounter", { count: (soul.signaturePhrases || []).length })}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                      <CardHeader className="pb-4">
                        <CardTitle className="font-display tracking-wider text-lg">{t("customize")}</CardTitle>
                        <CardDescription>{t("customizeDesc")}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setPhase("presets")}
                            style={{ borderColor: "hsl(var(--border))" }}
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            {t("switchPreset")}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              if (confirm(t("resetConfirm"))) {
                                resetSoul();
                                setQuickStartDismissed(false);
                              }
                            }}
                            style={{ borderColor: "hsl(var(--destructive) / 0.3)", color: "hsl(var(--destructive))" }}
                          >
                            {t("reset")}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* ─── RIGHT: LIVE PREVIEW (50%) ─── */}
            <div>
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" style={{ color: "hsl(var(--accent))" }} />
                    <span className="text-sm font-display tracking-wider" style={{ color: "hsl(var(--foreground-muted))" }}>{t("livePreview")}</span>
                  </div>
                </div>
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
        <DialogContent style={{ background: "hsl(var(--popover))", borderColor: "hsl(var(--border))" }}>
          <DialogHeader>
            <DialogTitle className="font-display tracking-wider">{t("shareLink")}</DialogTitle>
            <DialogDescription>{t("shareDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              readOnly
              value={shareUrl}
              className="rounded-xl"
              style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
            />
            <p className="text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>{t("shareTip")}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShareDialogOpen(false)} style={{ background: "hsl(var(--primary))", color: "hsl(var(--foreground-primary))" }}>
              {t("close")}
            </Button>
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
    </>
  );
}

// ─── Simple Preset Card (no Framer Motion) ───────────────────────────
function PresetCardSimple({ preset, onSelect, isSelected }: { preset: SoulPreset; onSelect: (p: SoulPreset) => void; isSelected: boolean }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(preset)}
      className="p-5 rounded-xl cursor-pointer transition-all hover:scale-[1.01] w-full text-left"
      style={{
        background: isSelected ? "hsl(var(--primary) / 0.1)" : "hsl(var(--card))",
        border: `1px solid ${isSelected ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border))"}`,
      }}
      aria-label={`${preset.name} — ${preset.creature}`}
      aria-pressed={isSelected}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl" aria-hidden="true">{preset.emoji || "✨"}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display tracking-wider text-base truncate" style={{ color: "hsl(var(--foreground))" }}>
            {preset.name}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "hsl(var(--foreground-muted))" }}>{preset.creature}</p>
          <p className="text-sm mt-2 line-clamp-2" style={{ color: "hsl(var(--foreground-muted))" }}>{preset.description}</p>
          {preset.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {preset.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 text-[10px] font-medium tracking-wide rounded-full bg-primary/5 text-muted-fg border border-border"
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
