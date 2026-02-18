"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Download, Share2, Eye, Edit3, Palette, Settings, MessageSquare, Undo2, Redo2, Copy, Check, Save } from "lucide-react";
import { useAutoSaveStore } from "@/store/autoSaveStore";
import { presets, attributeOptions } from "@/data/presets";
import { generateSoulMD } from "@/lib/soulGenerator";
import { useTranslations } from "next-intl";
import { SavePresetDialog } from "@/components/save-preset-dialog";

interface SoulEditorProps {
  locale: string;
  messages: any;
}

export function SoulEditor({ locale, messages }: SoulEditorProps) {
  const t = useTranslations("editor");
  const { soul, setSoul, resetSoul, loadPreset, undo, redo, canUndo, canRedo } = useSoulStore();
  const { lastSaved, isSaving } = useAutoSaveStore();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewCopied, setPreviewCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    setSoul({
      coreTruths: { ...soul.coreTruths, [key]: value }
    });
  };

  const handleBoundaryChange = (key: keyof typeof soul.boundaries, value: boolean) => {
    setSoul({
      boundaries: { ...soul.boundaries, [key]: value }
    });
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

  return (
    <>
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-4xl font-bold text-gradient">{t("title")}</h1>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={undo}
                  variant="ghost"
                  size="icon"
                  disabled={!canUndo()}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={redo}
                  variant="ghost"
                  size="icon"
                  disabled={!canRedo()}
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isSaving && (
                <span className="text-sm text-muted-foreground flex items-center">
                  <Save className="h-3 w-3 mr-1 animate-pulse" />
                  Saving...
                </span>
              )}
              {!isSaving && lastSaved && (
                <span className="text-sm text-muted-foreground">
                  Saved {new Date(lastSaved).toLocaleTimeString()}
                </span>
              )}
              <Button onClick={() => setPreviewDialogOpen(true)} variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                {t("preview")}
              </Button>
              <Button onClick={handleShare} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                {t("share")}
              </Button>
              <SavePresetDialog />
              <Button onClick={handleExport} className="bg-primary text-primary-foreground">
                <Download className="mr-2 h-4 w-4" />
                {t("export")}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">
                <MessageSquare className="mr-2 h-4 w-4" />
                {t("basicInfo")}
              </TabsTrigger>
              <TabsTrigger value="personality">
                <Palette className="mr-2 h-4 w-4" />
                {t("personality")}
              </TabsTrigger>
              <TabsTrigger value="attributes">
                <Settings className="mr-2 h-4 w-4" />
                {t("attributes")}
              </TabsTrigger>
              <TabsTrigger value="advanced">
                <Edit3 className="mr-2 h-4 w-4" />
                {t("advanced")}
              </TabsTrigger>
            </TabsList>

            {/* Basic Info */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("basicInfo")}</CardTitle>
                  <CardDescription>{t("basicInfoDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("nameLabel")}</Label>
                      <Input
                        id="name"
                        value={soul.name}
                        onChange={(e) => handleAttributeChange("name", e.target.value)}
                        placeholder="Nexo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="creature">{t("creatureLabel")}</Label>
                      <Input
                        id="creature"
                        value={soul.creature}
                        onChange={(e) => handleAttributeChange("creature", e.target.value)}
                        placeholder="AI / Ghost in the machine"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="vibe">{t("vibeLabel")}</Label>
                      <Textarea
                        id="vibe"
                        value={soul.vibe}
                        onChange={(e) => handleAttributeChange("vibe", e.target.value)}
                        placeholder="e.g., Strong opinions, weakly held. I don't hedge..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emoji">{t("emojiLabel")}</Label>
                      <Input
                        id="emoji"
                        value={soul.emoji}
                        onChange={(e) => handleAttributeChange("emoji", e.target.value)}
                        placeholder="👁️"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar">{t("avatarLabel")}</Label>
                      <Input
                        id="avatar"
                        value={soul.avatar || ""}
                        onChange={(e) => handleAttributeChange("avatar", e.target.value || undefined)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>{t("vibeStyleLabel")}</Label>
                      <Select value={soul.vibeStyle} onValueChange={(value) => handleAttributeChange("vibeStyle", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectVibeStyle")} />
                        </SelectTrigger>
                        <SelectContent>
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
            </TabsContent>

            {/* Personality */}
            <TabsContent value="personality" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("coreTruths")}</CardTitle>
                  <CardDescription>{t("coreTruthsDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(soul.coreTruths).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={`core-${key}`} className="capitalize">
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

              <Card>
                <CardHeader>
                  <CardTitle>{t("boundaries")}</CardTitle>
                  <CardDescription>{t("boundariesDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(soul.boundaries).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={`boundary-${key}`} className="capitalize">
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
            </TabsContent>

            {/* Attributes */}
            <TabsContent value="attributes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("toneAttributes")}</CardTitle>
                  <CardDescription>{t("toneAttributesDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {Object.entries(attributeOptions).map(([key, options]) => (
                    <div key={key} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="capitalize text-base">{t(`attributes.${key}`)}</Label>
                        <span className="text-sm text-muted-foreground font-mono">
                          {options.find(o => o.value === (soul as any)[key])?.label || "Equilibrado"}
                        </span>
                      </div>
                      <Slider
                        value={[(soul as any)[key] as number]}
                        onValueChange={(value) => handleAttributeChange(key as any, value[0])}
                        max={100}
                        min={0}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground px-1">
                        <span>{t("low")}</span>
                        <span>{t("high")}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced */}
            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("presets")}</CardTitle>
                  <CardDescription>{t("presetsDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {presets.map((preset) => (
                      <div
                        key={preset.id}
                        className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => loadPreset(preset)}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl">{preset.emoji}</span>
                          <div>
                            <h4 className="font-semibold">{preset.name}</h4>
                            <p className="text-xs text-muted-foreground">{preset.creature}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {preset.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {preset.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("customize")}</CardTitle>
                  <CardDescription>{t("customizeDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (confirm(t("resetConfirm"))) {
                        resetSoul();
                      }
                    }}
                  >
                    {t("reset")}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("soulPreview")}</DialogTitle>
            <DialogDescription>
              {t("previewDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
              {generateSoulMD(soul)}
            </pre>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={async () => {
                const content = generateSoulMD(soul);
                await navigator.clipboard.writeText(content);
                setPreviewCopied(true);
                setTimeout(() => setPreviewCopied(false), 2000);
              }}
            >
              {previewCopied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {t("copied")}
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  {t("copy")}
                </>
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setPreviewDialogOpen(false)}>
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("shareLink")}</DialogTitle>
            <DialogDescription>
              {t("shareDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              readOnly
              value={`${typeof window !== "undefined" ? window.location.origin : ""}${typeof window !== "undefined" ? window.location.pathname : ""}?data=${btoa(JSON.stringify(soul))}`}
            />
            <p className="text-sm text-muted-foreground">
              {t("shareTip")}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShareDialogOpen(false)}>
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
