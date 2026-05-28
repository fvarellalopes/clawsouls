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
import { useNsfwStore } from "@/store/nsfwStore";
import { usePresets } from "@/lib/usePresets";
import { attributeOptions } from "@/data/presets";
import { generateSoulMD, getCharacterCoreTruths, getCharacterBoundaries } from "@/lib/soulGenerator";
import { exportYAML } from "@/lib/exportYAML";
import { avatarUrl, hasAvatar } from "@/lib/avatar";
import { CritiquePanel } from "@/components/critique-panel";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SavePresetDialog } from "@/components/save-preset-dialog";
import { ParchmentPreview } from "@/components/parchment-preview";
import { ImportJsonDialog } from "@/components/import-json-dialog";
import { FillWithAIDialog } from "@/components/fill-with-ai-dialog";
import { ShareActions } from "@/components/share-actions";
import { useAchievementsStore } from "@/store/achievementsStore";

interface SoulEditorProps {
  locale: string;
  messages: Record<string, unknown>;
  initialPresetSlug?: string;
}

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
        <span style={{ color: "var(--primary)", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: "13px", fontWeight: 600 }}>
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
      <div className="flex justify-between text-[9px] uppercase tracking-widest" style={{ color: "var(--muted-fg)", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>
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

export function SoulEditor({ locale, messages, initialPresetSlug }: SoulEditorProps) {
  const t = useTranslations("editor");
  const tCommon = useTranslations("common");
  const { soul, setSoul, resetSoul, loadPreset, undo, redo, canUndo, canRedo, isDarkMode, setIsDarkMode } = useSoulStore();
  const { lastSaved, isSaving } = useAutoSaveStore();
  const { incrementExport, incrementShare, addLanguageUsed } = useAchievementsStore();
  const params = useParams();
  const activeLocale = (params?.locale as string) || locale || "en";
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareDataParam, setShareDataParam] = useState("");
  const [newCoreTruth, setNewCoreTruth] = useState("");
  const [newBoundary, setNewBoundary] = useState("");
  const [newSignaturePhrase, setNewSignaturePhrase] = useState("");
  const [newPetPeeve, setNewPetPeeve] = useState("");
  const [fillWithAIOpen, setFillWithAIOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [quickStartDismissed, setQuickStartDismissed] = useState(false);
  const [previewFormat, setPreviewFormat] = useState<"soulmd" | "yaml">("soulmd");
  const [activeTab, setActiveTab] = useState("essentials");
  const { nsfwEnabled } = useNsfwStore();

  // Load preset from URL slug — reset soul first to avoid stale data flash
  const { presets } = usePresets();
  useEffect(() => {
    if (!initialPresetSlug) return;
    const target = presets.find((p) => p.id === initialPresetSlug);
    if (target) {
      // Reset immediately to clear stale data, then load new preset
      resetSoul();
      const id = setTimeout(() => loadPreset(target), 0);
      return () => clearTimeout(id);
    }
  }, [initialPresetSlug, presets]);

  // Track language usage for achievements
  useEffect(() => {
    addLanguageUsed(locale);
  }, [locale, addLanguageUsed]);

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
    const dataParam = btoa(JSON.stringify(soul));
    setShareDataParam(dataParam);
    
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
        params.set("data", dataParam);
        const fallbackUrl = `${window.location.origin}/share?${params.toString()}`;
        await navigator.clipboard.writeText(fallbackUrl);
        setShareUrl(fallbackUrl);
      }
    } catch {
      const params = new URLSearchParams();
      params.set("data", dataParam);
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
      worldview: soul.worldview,
      expertise: soul.expertise,
      memoryPolicy: soul.memoryPolicy,
      petPeeves: soul.petPeeves,
      voiceRules: soul.voiceRules,
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

  const soulMD = useMemo(() => generateSoulMD(soul, activeLocale as any), [soul, activeLocale]);
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

  // ─── CYBER TERMINAL EDITOR ───────────────────────────────────────────
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {/* ─── TOP ACTIONS BAR ─── */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-border bg-surface/30">
        <div className="container mx-auto max-w-[1400px] flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Title + Status */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
            <div className="w-0.5 sm:w-1 h-6 sm:h-8 flex-shrink-0 bg-primary" />
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold font-display text-primary truncate" style={{ letterSpacing: "0.06em" }}>
                Terminal Session_01
              </h1>
              <p className="mono-data hidden sm:block text-muted-foreground" style={{ fontSize: "10px" }}>
                STATUS: CONFIGURING // TARGET: SOUL.MD
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Link
              href={`/${activeLocale}/presets`}
              className="p-2 sm:px-3 sm:py-1.5 bg-transparent border border-primary/50 text-primary rounded font-mono text-[10px] uppercase font-bold hover:bg-primary/10 transition-all flex items-center gap-1.5 flex-shrink-0"
              title={t("presets")}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_back</span>
              <span className="hidden sm:inline">{t("presets")}</span>
            </Link>
            <div className="w-px h-4 sm:h-6 flex-shrink-0 bg-border" />
            <button onClick={undo} disabled={!canUndo()} className="p-2 sm:px-3 sm:py-1.5 bg-transparent border border-primary/30 text-primary/70 rounded font-mono text-[10px] uppercase font-bold hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex-shrink-0" title={t("undoTitle")}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>undo</span>
              <span className="hidden sm:inline">{t("undo")}</span>
            </button>
            <button onClick={redo} disabled={!canRedo()} className="p-2 sm:px-3 sm:py-1.5 bg-transparent border border-primary/30 text-primary/70 rounded font-mono text-[10px] uppercase font-bold hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex-shrink-0" title={t("redoTitle")}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>redo</span>
              <span className="hidden sm:inline">{t("redo")}</span>
            </button>
            <div className="w-px h-4 sm:h-6 flex-shrink-0 bg-border" />
            <button onClick={handleShare} className="p-2 sm:px-3 sm:py-1.5 bg-transparent border border-primary/30 text-primary/70 rounded font-mono text-[10px] uppercase font-bold hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0" title={t("share")}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>share</span>
              <span className="hidden sm:inline">{t("share")}</span>
            </button>
            <div className="relative flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExportDropdownOpen(!exportDropdownOpen);
                }}
                className="px-2 sm:px-4 py-2 bg-primary text-primary-foreground rounded font-mono text-[10px] sm:text-[11px] uppercase font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1 sm:gap-2  cursor-pointer"
                title={t("exportSoulMd")}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>download</span>
                <span className="hidden sm:inline">{t("exportSoulMd")}</span>
                <span className="material-symbols-outlined hidden sm:inline" style={{ fontSize: "14px" }}>expand_more</span>
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
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm transition-all hover:bg-primary/10 cursor-pointer"
                    style={{ color: "var(--fg)" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--primary)" }}>description</span>
                    {t("exportDropdown.soulmd")}
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => { handleExportJSON(); setExportDropdownOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm transition-all hover:bg-primary/10 cursor-pointer"
                    style={{ color: "var(--fg)" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--primary)" }}>data_object</span>
                    {t("exportDropdown.json")}
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => { handleExportYAML(); setExportDropdownOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm transition-all hover:bg-primary/10 cursor-pointer"
                    style={{ color: "var(--fg)" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--primary)" }}>code</span>
                    {t("exportDropdown.yaml")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="px-3 sm:px-6 py-4 sm:py-6">
        <div className="container mx-auto max-w-[1400px] space-y-4 sm:space-y-6">

          {/* ─── TOP: Avatar + Editor side by side ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* ─── Avatar Column (3 cols) ─── */}
            <div className="lg:col-span-3">
              <div className="cyber-glass p-4 sm:p-6 text-center lg:sticky lg:top-24">
                <div className="relative mx-auto mb-4 w-32 sm:w-40 lg:w-48 aspect-[3/4] rounded-2xl overflow-hidden"
                     style={{
                       background: "var(--surface)",
                      border: "1px solid var(--primary)",
                      boxShadow: "0 0 30px var(--primary)",
                     }}>
                  {avatarUrl(soul).includes("placeholder") ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl sm:text-6xl">{soul.emoji || "✨"}</span>
                    </div>
                  ) : (
                    <img
                      src={avatarUrl(soul)}
                      alt={soul.name || "Avatar"}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/40" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/40" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/40" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/40" />
                </div>

                <h2 className="text-lg sm:text-xl font-bold font-display text-primary truncate max-w-full"
                    style={{ letterSpacing: "0.04em" }}>
                  {soul.name || t("unnamedSoul") || "UNNAMED SOUL"}
                </h2>
                <p className="mono-data text-xs mt-1 truncate max-w-full text-muted-foreground">
                  {soul.creature || "—"}
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className={`w-1.5 h-1.5 rounded-full ${hasAvatar(soul) ? "bg-green-500" : "bg-muted-foreground"}`} />
                  <span className={`mono-data text-[10px] ${hasAvatar(soul) ? "text-green-500" : "text-muted-foreground"}`}>
                    {hasAvatar(soul) ? "AVATAR GENERATED" : "NO AVATAR"}
                  </span>
                </div>

                {/* Critique Panel — inline under avatar */}
                <div className="mt-4">
                  <CritiquePanel
                    preset={{
                      ...soul,
                      id: "current",
                      creature: soul.creature || "",
                      vibe: soul.vibe || "",
                      emoji: soul.emoji || "",
                      vibeStyle: soul.vibeStyle || "",
                      description: soul.vibe || "",
                      tags: [],
                      source: "custom" as const,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ─── Editor Column (9 cols) ─── */}
            <div className="lg:col-span-9 space-y-4 sm:space-y-6">
              {/* Tabs */}
              <div className="flex gap-0 overflow-x-auto no-scrollbar border-b border-border">
                {[
                  { id: "essentials", label: t("tabsEssentials") || "BASIC INFO" },
                  { id: "personality", label: t("tabsPersonality") || "PERSONALITY" },
                  { id: "identity", label: "IDENTITY" },
                  { id: "style", label: t("tabsStyle") || "TONE & STYLE" },
                  { id: "advanced", label: t("tabsAdvanced") || "ADVANCED" },
                  ...(nsfwEnabled ? [{ id: "nsfw", label: "NSFW" }] : []),
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`whitespace-nowrap uppercase font-display text-[11px] sm:text-xs cursor-pointer ${activeTab === tab.id ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-primary"} px-2 sm:px-4 py-2 transition-all duration-200 flex-shrink-0`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ─── TAB: BASIC INFO (Essentials) ─── */}
              {activeTab === "essentials" && (
                <div style={{ animation: "fadeInUp 0.25s ease-out" }}>
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>badge</span>
                      {t("tabsEssentials") || "Basic Info"}
                    </h3>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="mono-data">{t("nameLabel") || "NAME"}</label>
                          <input
                            value={soul.name}
                            onChange={(e) => handleAttributeChange("name", e.target.value)}
                            placeholder={t("placeholderName") || "Nexo"}
                            className="cyber-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="mono-data">{t("creatureLabel") || "CREATURE"}</label>
                          <input
                            value={soul.creature}
                            onChange={(e) => handleAttributeChange("creature", e.target.value)}
                            placeholder={t("placeholderCreature") || "AI / Ghost in the machine"}
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
                          <div className="flex items-center gap-3">
                            <img
                              src={avatarUrl(soul)}
                              alt={soul.name || "Avatar"}
                              className="w-10 h-10 rounded-full border-2 border-accent object-cover"
                            />
                            <span className="text-sm text-muted-foreground">
                              {avatarUrl(soul).includes("placeholder")
                                ? t("avatarPlaceholder") || "Gerar avatar em batch via Colab"
                                : soul.name}
                            </span>
                          </div>
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
                            <option key={style.value} value={style.value} style={{ background: "var(--surface)", color: "var(--fg)" }}>
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
                        <h3 className="mono-data text-primary">
                          <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle" }}>bolt</span>
                          {t("quickStart.title") || "QUICK START"}
                        </h3>
                        <button
                          onClick={() => setQuickStartDismissed(true)}
                          className="text-xs hover:underline transition-colors cursor-pointer mono-data"
                          style={{ color: "var(--muted-fg)" }}
                        >
                          {t("dismissQuickStart") || "DISMISS"}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          onClick={() => { resetSoul(); setQuickStartDismissed(true); }}
                          className="p-4 text-left transition-all hover:scale-[1.02] cursor-pointer cyber-glass"
                        >
                          <span className="material-symbols-outlined block mb-2 text-muted-foreground" style={{ fontSize: "20px" }}>restart_alt</span>
                          <p className="mono-data text-xs text-foreground">{t("quickStart.scratch")}</p>
                          <p className="text-[10px] mt-1 text-muted-foreground">{t("quickStart.scratchDesc")}</p>
                        </button>
                        <button
                          onClick={() => { resetSoul(); setQuickStartDismissed(true); setFillWithAIOpen(true); }}
                          className="p-4 text-left transition-all hover:scale-[1.02] cursor-pointer cyber-glass"
                        >
                          <span className="material-symbols-outlined block mb-2 text-muted-foreground" style={{ fontSize: "20px" }}>wand_stars</span>
                          <p className="mono-data text-xs text-foreground">{t("quickStart.ai")}</p>
                          <p className="text-[10px] mt-1 text-muted-foreground">{t("quickStart.aiDesc")}</p>
                        </button>
                        <Link
                          href={`/${activeLocale}/presets`}
                          className="p-4 text-left transition-all hover:scale-[1.02] cyber-glass block"
                        >
                          <span className="material-symbols-outlined block mb-2 text-muted-foreground" style={{ fontSize: "20px" }}>auto_awesome</span>
                          <p className="mono-data text-xs text-foreground">{t("quickStart.preset")}</p>
                          <p className="text-[10px] mt-1 text-muted-foreground">{t("quickStart.presetDesc")}</p>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ─── TAB: PERSONALITY (Big Five + Core Truths + Boundaries) ─── */}
              {activeTab === "personality" && (
                <div style={{ animation: "fadeInUp 0.25s ease-out" }}>
                  {/* Cognitive Parameters — Big Five */}
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>psychology</span>
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
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>verified</span>
                      {t("coreTruthsTitle") || "Core Truths"}
                    </h3>
                    <div className="space-y-1">
                      {Object.entries(soul.coreTruths).map(([key, value]) => {
                        const archLabels = getCharacterCoreTruths(soul.creature, soul.vibeStyle);
                        return (
                        <CyberToggle
                          key={key}
                          label={archLabels[key] || t(`coreTruths.${key}`) || key}
                          checked={value}
                          onChange={(checked) => handleCoreTruthChange(key as any, checked)}
                        />
                        );
                      })}
                    </div>
                  </div>

                  {/* Boundaries */}
                  <div className="cyber-glass p-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>shield</span>
                      {t("boundariesTitle") || "Boundaries"}
                    </h3>
                    <div className="space-y-1">
                      {Object.entries(soul.boundaries).map(([key, value]) => {
                        const archBounds = getCharacterBoundaries(soul.creature);
                        return (
                        <CyberToggle
                          key={key}
                          label={archBounds[key] || t(`boundaries.${key}`) || key}
                          checked={value}
                          onChange={(checked) => handleBoundaryChange(key as any, checked)}
                        />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB: IDENTITY (Worldview, Expertise, Memory, Pet Peeves, Voice Rules) ─── */}
              {activeTab === "identity" && (
                <div style={{ animation: "fadeInUp 0.25s ease-out" }}>
                  {/* Worldview */}
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>public</span>
                      Worldview
                    </h3>
                    <p className="text-xs mb-3" style={{ color: "var(--muted-fg)" }}>
                      Opinionated takes by domain. Sharp enough to predict what this agent would say.
                    </p>
                    <textarea
                      value={soul.worldview || ""}
                      onChange={(e) => handleAttributeChange("worldview", e.target.value)}
                      placeholder={"e.g.,\n- Most software is over-engineered. Ship less.\n- Hustle culture is a disease disguised as ambition.\n- AI should augment, not replace, human judgment."}
                      rows={5}
                      className="cyber-textarea"
                    />
                  </div>

                  {/* Expertise */}
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>school</span>
                      Expertise
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="mono-data">PRIMARY DOMAIN</label>
                        <input
                          value={soul.expertise?.primary || ""}
                          onChange={(e) => handleAttributeChange("expertise", { ...soul.expertise, primary: e.target.value })}
                          placeholder="e.g., Full-stack web development, ML systems"
                          className="cyber-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="mono-data">FLUENT IN</label>
                        <input
                          value={soul.expertise?.fluent || ""}
                          onChange={(e) => handleAttributeChange("expertise", { ...soul.expertise, fluent: e.target.value })}
                          placeholder="e.g., TypeScript, Python, React, Postgres, AWS"
                          className="cyber-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="mono-data">DEFERS TO USER ON</label>
                        <input
                          value={soul.expertise?.defers || ""}
                          onChange={(e) => handleAttributeChange("expertise", { ...soul.expertise, defers: e.target.value })}
                          placeholder="e.g., Business decisions, design taste, domain-specific logic"
                          className="cyber-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Voice Rules */}
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>record_voice_over</span>
                      Voice Rules
                    </h3>
                    <p className="text-xs mb-3" style={{ color: "var(--muted-fg)" }}>
                      Concrete rules, not adjectives. "Max 3 sentences per paragraph" beats "be concise".
                    </p>
                    <textarea
                      value={soul.voiceRules || ""}
                      onChange={(e) => handleAttributeChange("voiceRules", e.target.value)}
                      placeholder={"e.g.,\n- Max 3 sentences per paragraph\n- Never start with 'Great question!'\n- No em-dashes. Use periods.\n- Never use 'utilize' — just 'use'\n- No hedging: 'It's worth noting that...' → just say it"}
                      rows={5}
                      className="cyber-textarea"
                    />
                  </div>

                  {/* Memory Policy */}
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>memory</span>
                      Memory Policy
                    </h3>
                    <p className="text-xs mb-3" style={{ color: "var(--muted-fg)" }}>
                      What persists across sessions, what stays private.
                    </p>
                    <textarea
                      value={soul.memoryPolicy || ""}
                      onChange={(e) => handleAttributeChange("memoryPolicy", e.target.value)}
                      placeholder={"e.g.,\n- Save: user preferences, project context, coding style\n- Never save: conversation transcripts, personal data, API keys\n- Forget: anything older than 30 days unless explicitly marked"}
                      rows={4}
                      className="cyber-textarea"
                    />
                  </div>

                  {/* Pet Peeves */}
                  <div className="cyber-glass p-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>block</span>
                      Pet Peeves
                    </h3>
                    <p className="text-xs mb-3" style={{ color: "var(--muted-fg)" }}>
                      Phrases and tones this agent will NEVER produce.
                    </p>
                    <div className="space-y-2 mb-4">
                      {(soul.petPeeves || []).map((peeve, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 rounded" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                          <span className="flex-1 text-xs" style={{ color: "var(--fg)", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>"{peeve}"</span>
                          <button
                            onClick={() => {
                              const updated = [...(soul.petPeeves || [])];
                              updated.splice(i, 1);
                              handleAttributeChange("petPeeves", updated);
                            }}
                            className="cyber-btn"
                            style={{ padding: "4px", border: "none" }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--destructive)" }}>delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                    {(soul.petPeeves || []).length >= 8 ? (
                      <p className="mono-data text-[10px]" style={{ color: "var(--muted-fg)" }}>
                        Maximum 8 pet peeves reached
                      </p>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          value={newPetPeeve}
                          onChange={(e) => setNewPetPeeve(e.target.value.slice(0, 80))}
                          placeholder="e.g., 'Great question!', 'It's worth noting that...'"
                          maxLength={80}
                          className="cyber-input flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newPetPeeve.trim()) {
                              handleAttributeChange("petPeeves", [...(soul.petPeeves || []), newPetPeeve.trim()]);
                              setNewPetPeeve("");
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            if (newPetPeeve.trim()) {
                              handleAttributeChange("petPeeves", [...(soul.petPeeves || []), newPetPeeve.trim()]);
                              setNewPetPeeve("");
                            }
                          }}
                          disabled={!newPetPeeve.trim()}
                          className="cyber-btn"
                          style={{ padding: "8px" }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ─── TAB: TONE & STYLE ─── */}
              {activeTab === "style" && (
                <div style={{ animation: "fadeInUp 0.25s ease-out" }}>
                  {/* Syntactic Tone Profile */}
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>tune</span>
                      {t("toneAttributes") || "Syntactic Tone Profile"}
                    </h3>
                    <div className="space-y-6">
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
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>forum</span>
                      {t("communicationMode") || "Communication Mode"}
                    </h3>
                    <select
                      value={soul.communicationMode || "direct"}
                      onChange={(e) => handleAttributeChange("communicationMode", e.target.value)}
                      className="cyber-input"
                      style={{ cursor: "pointer" }}
                    >
                      <option value="direct" style={{ background: "var(--surface)", color: "var(--fg)" }}>{t("commModes.direct")}</option>
                      <option value="socratic" style={{ background: "var(--surface)", color: "var(--fg)" }}>{t("commModes.socratic")}</option>
                      <option value="diagnostic" style={{ background: "var(--surface)", color: "var(--fg)" }}>{t("commModes.diagnostic")}</option>
                      <option value="encouraging" style={{ background: "var(--surface)", color: "var(--fg)" }}>{t("commModes.encouraging")}</option>
                      <option value="challenging" style={{ background: "var(--surface)", color: "var(--fg)" }}>{t("commModes.challenging")}</option>
                      <option value="flirty" style={{ background: "var(--surface)", color: "var(--fg)" }}>{t("commModes.flirty")}</option>
                    </select>
                  </div>

                  {/* Emotional Range */}
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>mood</span>
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
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>school</span>
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
                            className="p-2.5 text-xs text-left transition-all rounded cursor-pointer"
                            style={{
                              background: isSelected ? "var(--primary)" : "var(--surface)",
                              border: `1px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                              color: isSelected ? "var(--primary)" : "var(--muted-fg)",
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
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>record_voice_over</span>
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
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>add_circle</span>
                      {t("customCoreTruths") || "Custom Core Truths"}
                    </h3>
                    <div className="space-y-2 mb-4">
                      {(soul.customCoreTruths || []).map((truth, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 rounded" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                          <span className="flex-1 text-xs" style={{ color: "var(--fg)", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>{truth}</span>
                          <button
                            onClick={() => removeCustomCoreTruth(i)}
                            className="cyber-btn"
                            style={{ padding: "4px", border: "none" }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--destructive)" }}>delete</span>
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
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>add_circle</span>
                      {t("customBoundaries") || "Custom Boundaries"}
                    </h3>
                    <div className="space-y-2 mb-4">
                      {(soul.customBoundaries || []).map((boundary, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 rounded" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                          <span className="flex-1 text-xs" style={{ color: "var(--fg)", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>{boundary}</span>
                          <button
                            onClick={() => removeCustomBoundary(i)}
                            className="cyber-btn"
                            style={{ padding: "4px", border: "none" }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--destructive)" }}>delete</span>
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
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>format_quote</span>
                      {t("signaturePhrases") || "Signature Phrases"}
                    </h3>
                    <div className="space-y-2 mb-4">
                      {(soul.signaturePhrases || []).map((phrase, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 rounded" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                          <span className="flex-1 text-xs italic" style={{ color: "var(--fg)", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>"{phrase}"</span>
                          <button
                            onClick={() => {
                              const updated = [...(soul.signaturePhrases || [])];
                              updated.splice(i, 1);
                              handleAttributeChange("signaturePhrases", updated);
                            }}
                            className="cyber-btn"
                            style={{ padding: "4px", border: "none" }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--destructive)" }}>delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                    {(soul.signaturePhrases || []).length >= 5 ? (
                      <p className="mono-data text-[10px]" style={{ color: "var(--muted-fg)" }}>
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
                              style={{ color: newSignaturePhrase.length >= 45 ? "var(--destructive)" : "var(--muted-fg)", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
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
                        <p className="mono-data text-[10px]" style={{ color: "var(--muted-fg)" }}>
                          {t("signaturePhrasesCounter", { count: (soul.signaturePhrases || []).length }) || `${(soul.signaturePhrases || []).length}/5`}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="cyber-glass p-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>settings</span>
                      {t("customize") || "Actions"}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/${activeLocale}/presets`}
                        className="cyber-btn inline-flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>auto_awesome</span>
                        {t("switchPreset") || "Switch Preset"}
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(t("resetConfirm") || "Reset all fields?")) {
                            resetSoul();
                            setQuickStartDismissed(false);
                          }
                        }}
                        className="cyber-btn"
                        style={{ borderColor: "var(--destructive)", color: "var(--destructive)" }}
                      >
                        {t("reset") || "Reset"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB: NSFW ─── */}
              {activeTab === "nsfw" && nsfwEnabled && (
                <div style={{ animation: "fadeInUp 0.25s ease-out" }}>
                  {/* NSFW Toggle */}
                  <div className="cyber-glass p-6 mb-6">
                    <h3 className="cyber-section-title">
                      <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--destructive)" }}>no_adult_content</span>
                      NSFW Content
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-foreground">Marcar este preset como NSFW</p>
                        <p className="text-xs text-muted-foreground mt-1">Presets NSFW só aparecem quando o modo NSFW está ativo</p>
                      </div>
                      <Switch
                        checked={soul.nsfw || false}
                        onCheckedChange={(checked) => handleAttributeChange("nsfw", checked)}
                      />
                    </div>
                  </div>

                  {/* NSFW Tags */}
                  {soul.nsfw && (
                    <div className="cyber-glass p-6 mb-6">
                      <h3 className="cyber-section-title">
                        <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>label</span>
                        NSFW Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {["sugestivo", "explícito", "extremo", "romântico", "sedutor", "dominador", "submisso", "brincalhão", "BDSM", "fetiche", "roleplay", "fantasia", "casual", "íntimo", "narrativo"].map((tag) => {
                          const active = (soul.nsfwTags || []).includes(tag);
                          return (
                            <button
                              key={tag}
                              onClick={() => {
                                const current = soul.nsfwTags || [];
                                handleAttributeChange("nsfwTags", active ? current.filter(t => t !== tag) : [...current, tag]);
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                                active
                                  ? "bg-red-500/20 text-red-400 border-red-500/40"
                                  : "bg-surface-alt/60 text-muted-foreground border-border hover:bg-surface-alt hover:text-foreground"
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* NSFW Bipolar Sliders */}
                  {soul.nsfw && (
                    <div className="cyber-glass p-6 mb-6">
                      <h3 className="cyber-section-title">
                        <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px", verticalAlign: "middle", color: "var(--primary)" }}>tune</span>
                        NSFW Personality Sliders
                      </h3>
                      <div className="space-y-6">
                        {[
                          { key: "submissiveDominant", left: "Submisso", right: "Dominante" },
                          { key: "shyProvocative", left: "Tímido", right: "Provocante" },
                          { key: "romanticErotic", left: "Romântico", right: "Erótico" },
                          { key: "gentleIntense", left: "Gentil", right: "Intenso" },
                          { key: "playfulSerious", left: "Brincalhão", right: "Sério" },
                          { key: "exhibitionistDiscreet", left: "Exibicionista", right: "Discreto" },
                          { key: "innocentExperienced", left: "Inocente", right: "Experiente" },
                          { key: "verbalTactile", left: "Verbal", right: "Tátil" },
                          { key: "fantasyRealism", left: "Fantasia", right: "Realismo" },
                        ].map(({ key, left, right }) => (
                          <div key={key} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="mono-data text-[10px] text-muted-foreground">{left}</span>
                              <span className="mono-data text-[10px] text-primary tabular-nums">
                                {soul.nsfwSliders?.[key as keyof typeof soul.nsfwSliders] ?? 50}
                              </span>
                              <span className="mono-data text-[10px] text-muted-foreground">{right}</span>
                            </div>
                            <Slider
                              value={[soul.nsfwSliders?.[key as keyof typeof soul.nsfwSliders] ?? 50]}
                              onValueChange={([value]) => {
                                const current = soul.nsfwSliders || {};
                                handleAttributeChange("nsfwSliders", { ...current, [key]: value });
                              }}
                              min={0}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ─── BOTTOM: Full-width Soul Preview ─── */}
          <div>
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

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "var(--primary)", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", letterSpacing: "0.06em" }}>
              {t("shareLink") || "Share Link"}
            </DialogTitle>
            <DialogDescription style={{ color: "var(--muted-fg)" }}>
              {t("shareDesc") || "Share this link with others"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ShareActions shareUrl={shareUrl} dataParam={shareDataParam} />
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
