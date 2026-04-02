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
import { Download, Share2, Eye, Edit3, Palette, Settings, MessageSquare, Undo2, Redo2, Copy, Check, Save, Search, ArrowLeft, Sparkles, Wand2, X } from "lucide-react";
import { useAutoSaveStore } from "@/store/autoSaveStore";
import { usePresets } from "@/lib/usePresets";
import { attributeOptions } from "@/data/presets";
import { generateSoulMD } from "@/lib/soulGenerator";
import { useTranslations } from "next-intl";
import { SavePresetDialog } from "@/components/save-preset-dialog";
import { ParchmentPreview } from "@/components/parchment-preview";
import { PresetCard } from "@/components/preset-card";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/animated";

interface SoulEditorProps {
  locale: string;
  messages: any;
}

type Phase = "presets" | "editor";

export function SoulEditor({ locale, messages }: SoulEditorProps) {
  const t = useTranslations("editor");
  const tPresets = useTranslations("presetsPage");
  const { soul, setSoul, resetSoul, loadPreset, undo, redo, canUndo, canRedo } = useSoulStore();
  const { lastSaved, isSaving } = useAutoSaveStore();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [previewCopied, setPreviewCopied] = useState(false);
  const { presets, loading } = usePresets();

  // Phase: presets selection or editor
  const [phase, setPhase] = useState<Phase>("presets");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

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

  const handleAttributeChange = (attr: keyof typeof soul, value: any) => {
    setSoul({ [attr]: value });
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
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set("data", btoa(JSON.stringify(soul)));
    const shareUrl = `${window.location.origin}/share?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl);
    setShareDialogOpen(true);
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
  };

  const soulMD = useMemo(() => generateSoulMD(soul), [soul]);

  const vibeStyles = [
    { value: "concise", label: "Conciso" },
    { value: "expressive", label: "Expressivo" },
    { value: "sharp", label: "Sharp/Sarcástico" },
    { value: "verbose", label: "Verboso" },
    { value: "minimal", label: "Minimalista" },
    { value: "dramatic", label: "Dramático" },
    { value: "poetic", label: "Poético" },
    { value: "technical", label: "Técnico" },
    { value: "casual", label: "Casual" },
    { value: "formal", label: "Formal" },
  ];

  // ─── PHASE 1: PRESET SELECTION ────────────────────────────────────────
  if (phase === "presets") {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <FadeUp>
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-purple-200 font-display tracking-wider">Choose Your Beginning</span>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient font-display tracking-wider mb-4">
                Pick a Soul
              </h1>
              <p className="text-purple-200/50 text-lg max-w-xl mx-auto font-body">
                Start from a preset or forge your own from scratch.
              </p>
            </div>
          </FadeUp>

          {/* Search */}
          <FadeUp delay={0.15}>
            <div className="relative max-w-md mx-auto mb-10">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400/40" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tPresets("searchPlaceholder")}
                className="pl-11 bg-[#140d24]/60 border-purple-500/20 focus:border-purple-400/40 rounded-xl h-12 text-purple-100 placeholder:text-purple-400/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/40 hover:text-purple-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </FadeUp>

          {/* Start from scratch button */}
          <FadeUp delay={0.2}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleStartFromScratch}
              className="max-w-md mx-auto mb-10 p-5 rounded-2xl border-2 border-dashed border-purple-500/20 hover:border-purple-400/40 cursor-pointer transition-all group text-center"
            >
              <Wand2 className="h-8 w-8 text-purple-400/40 group-hover:text-purple-300 mx-auto mb-2 transition-colors" />
              <p className="text-purple-200/60 group-hover:text-purple-100 font-display tracking-wide transition-colors">
                Start from Scratch
              </p>
              <p className="text-xs text-purple-400/30 mt-1">Blank canvas, infinite possibilities</p>
            </motion.div>
          </FadeUp>

          {/* Presets grid */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPresets.map((preset, i) => (
              <StaggerItem key={preset.id}>
                <PresetCard
                  preset={preset}
                  index={i}
                  onSelect={handleSelectPreset}
                  isSelected={selectedPresetId === preset.id}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>

          {filteredPresets.length === 0 && !loading && (
            <FadeUp>
              <div className="text-center py-20">
                <p className="text-purple-300/40 text-lg font-body">No presets found for "{searchQuery}"</p>
              </div>
            </FadeUp>
          )}
        </div>
      </div>
    );
  }

  // ─── PHASE 2: SPLIT-PANE EDITOR ───────────────────────────────────────
  return (
    <>
      <div className="min-h-screen py-6 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Top bar */}
          <FadeUp>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPhase("presets")}
                  className="text-purple-300 hover:text-purple-100"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Presets
                </Button>
                <div className="h-5 w-px bg-purple-500/20" />
                <div className="flex items-center gap-1">
                  <Button onClick={undo} variant="ghost" size="icon" disabled={!canUndo()} title="Undo (Ctrl+Z)">
                    <Undo2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={redo} variant="ghost" size="icon" disabled={!canRedo()} title="Redo (Ctrl+Y)">
                    <Redo2 className="h-4 w-4" />
                  </Button>
                </div>
                <AnimatePresence>
                  {isSaving && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm text-purple-400/60 flex items-center"
                    >
                      <Save className="h-3 w-3 mr-1 animate-pulse" /> Saving...
                    </motion.span>
                  )}
                  {!isSaving && lastSaved && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-purple-400/40"
                    >
                      Saved {new Date(lastSaved).toLocaleTimeString()}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={handleShare} variant="outline" size="sm" className="border-purple-500/20">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <SavePresetDialog />
                <Button onClick={handleExport} size="sm" className="bg-gradient-to-r from-purple-600 to-purple-500 text-white border-0 shadow-lg shadow-purple-500/20">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </FadeUp>

          {/* Split pane: Form (left) + Preview (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* LEFT: Form */}
            <div className="lg:col-span-3 space-y-6">
              <FadeUp delay={0.1}>
                <Tabs defaultValue="basic" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4 bg-[#140d24]/80 backdrop-blur-sm rounded-xl p-1">
                    <TabsTrigger value="basic" className="rounded-lg data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-100">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">{t("basicInfo")}</span>
                      <span className="sm:hidden">Basic</span>
                    </TabsTrigger>
                    <TabsTrigger value="personality" className="rounded-lg data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-100">
                      <Palette className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">{t("personality")}</span>
                      <span className="sm:hidden">Soul</span>
                    </TabsTrigger>
                    <TabsTrigger value="attributes" className="rounded-lg data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-100">
                      <Settings className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">{t("attributes")}</span>
                      <span className="sm:hidden">Tone</span>
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="rounded-lg data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-100">
                      <Edit3 className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">{t("advanced")}</span>
                      <span className="sm:hidden">More</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Basic Info */}
                  <TabsContent value="basic">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                      <Card className="bg-[#140d24]/60 backdrop-blur-sm border-purple-500/15">
                        <CardHeader className="pb-4">
                          <CardTitle className="font-display tracking-wider text-lg">{t("basicInfo")}</CardTitle>
                          <CardDescription>{t("basicInfoDesc")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <Label className="text-purple-200/80 text-sm">{t("nameLabel")}</Label>
                              <Input
                                value={soul.name}
                                onChange={(e) => handleAttributeChange("name", e.target.value)}
                                placeholder="Nexo"
                                className="bg-[#0d0820]/80 border-purple-500/20 focus:border-purple-400/40 rounded-xl"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-purple-200/80 text-sm">{t("creatureLabel")}</Label>
                              <Input
                                value={soul.creature}
                                onChange={(e) => handleAttributeChange("creature", e.target.value)}
                                placeholder="AI / Ghost in the machine"
                                className="bg-[#0d0820]/80 border-purple-500/20 focus:border-purple-400/40 rounded-xl"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label className="text-purple-200/80 text-sm">{t("vibeLabel")}</Label>
                              <Textarea
                                value={soul.vibe}
                                onChange={(e) => handleAttributeChange("vibe", e.target.value)}
                                placeholder="e.g., Strong opinions, weakly held. I don't hedge..."
                                rows={3}
                                className="bg-[#0d0820]/80 border-purple-500/20 focus:border-purple-400/40 rounded-xl resize-none"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-purple-200/80 text-sm">{t("emojiLabel")}</Label>
                              <Input
                                value={soul.emoji}
                                onChange={(e) => handleAttributeChange("emoji", e.target.value)}
                                placeholder="👁️"
                                className="bg-[#0d0820]/80 border-purple-500/20 focus:border-purple-400/40 rounded-xl"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-purple-200/80 text-sm">{t("avatarLabel")}</Label>
                              <Input
                                value={soul.avatar || ""}
                                onChange={(e) => handleAttributeChange("avatar", e.target.value || undefined)}
                                placeholder="https://..."
                                className="bg-[#0d0820]/80 border-purple-500/20 focus:border-purple-400/40 rounded-xl"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label className="text-purple-200/80 text-sm">{t("vibeStyleLabel")}</Label>
                              <Select value={soul.vibeStyle} onValueChange={(value) => handleAttributeChange("vibeStyle", value)}>
                                <SelectTrigger className="bg-[#0d0820]/80 border-purple-500/20 rounded-xl">
                                  <SelectValue placeholder={t("selectVibeStyle")} />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1a0f2e] border-purple-500/30">
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
                    </motion.div>
                  </TabsContent>

                  {/* Personality */}
                  <TabsContent value="personality">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                      <Card className="bg-[#140d24]/60 backdrop-blur-sm border-purple-500/15">
                        <CardHeader className="pb-4">
                          <CardTitle className="font-display tracking-wider text-lg">{t("coreTruths")}</CardTitle>
                          <CardDescription>{t("coreTruthsDesc")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {Object.entries(soul.coreTruths).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-[#0d0820]/50 hover:bg-[#0d0820]/80 transition-colors">
                              <Label htmlFor={`core-${key}`} className="capitalize text-purple-200/80 cursor-pointer">
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

                      <Card className="bg-[#140d24]/60 backdrop-blur-sm border-purple-500/15">
                        <CardHeader className="pb-4">
                          <CardTitle className="font-display tracking-wider text-lg">{t("boundaries")}</CardTitle>
                          <CardDescription>{t("boundariesDesc")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {Object.entries(soul.boundaries).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-[#0d0820]/50 hover:bg-[#0d0820]/80 transition-colors">
                              <Label htmlFor={`boundary-${key}`} className="capitalize text-purple-200/80 cursor-pointer">
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
                    </motion.div>
                  </TabsContent>

                  {/* Attributes */}
                  <TabsContent value="attributes">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                      <Card className="bg-[#140d24]/60 backdrop-blur-sm border-purple-500/15">
                        <CardHeader className="pb-4">
                          <CardTitle className="font-display tracking-wider text-lg">{t("toneAttributes")}</CardTitle>
                          <CardDescription>{t("toneAttributesDesc")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                          {Object.entries(attributeOptions).map(([key, options]) => (
                            <div key={key} className="space-y-3">
                              <div className="flex justify-between items-center">
                                <Label className="capitalize text-purple-200/80 text-sm">{t(`attributes.${key}`)}</Label>
                                <span className="text-xs text-amber-400/70 font-mono bg-amber-500/10 px-2 py-0.5 rounded-md">
                                  {options.find(o => o.value === (soul as any)[key])?.label || "Equilibrado"}
                                </span>
                              </div>
                              <Slider
                                value={[(soul as any)[key] as number]}
                                onValueChange={(value) => handleAttributeChange(key as any, value[0])}
                                max={100}
                                min={0}
                                step={1}
                                className="[&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-400"
                              />
                              <div className="flex justify-between text-[10px] text-purple-400/30 px-1 uppercase tracking-wider">
                                <span>{t("low")}</span>
                                <span>{t("high")}</span>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  {/* Advanced */}
                  <TabsContent value="advanced">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                      <Card className="bg-[#140d24]/60 backdrop-blur-sm border-purple-500/15">
                        <CardHeader className="pb-4">
                          <CardTitle className="font-display tracking-wider text-lg">{t("customize")}</CardTitle>
                          <CardDescription>{t("customizeDesc")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-3">
                            <Button
                              variant="outline"
                              onClick={() => setPhase("presets")}
                              className="border-purple-500/20"
                            >
                              <Sparkles className="mr-2 h-4 w-4" />
                              Switch Preset
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                if (confirm(t("resetConfirm"))) {
                                  resetSoul();
                                }
                              }}
                              className="border-red-500/20 text-red-300 hover:text-red-200 hover:bg-red-500/10"
                            >
                              {t("reset")}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </FadeUp>
            </div>

            {/* RIGHT: Live Preview */}
            <div className="lg:col-span-2">
              <FadeUp delay={0.2}>
                <div className="sticky top-24">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="h-4 w-4 text-amber-400/60" />
                    <span className="text-sm font-display tracking-wider text-purple-200/60">Live Preview</span>
                  </div>
                  <ParchmentPreview content={soulMD} name={soul.name} emoji={soul.emoji} />
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="bg-[#1a0f2e] border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="font-display tracking-wider">{t("shareLink")}</DialogTitle>
            <DialogDescription>{t("shareDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              readOnly
              value={`${typeof window !== "undefined" ? window.location.origin : ""}/share?data=${btoa(JSON.stringify(soul))}`}
              className="bg-[#0d0820]/80 border-purple-500/20 rounded-xl"
            />
            <p className="text-sm text-purple-300/40">{t("shareTip")}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShareDialogOpen(false)} className="bg-purple-600 text-white">
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
