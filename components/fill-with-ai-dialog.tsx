"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Wand2, RefreshCw, Sparkles, Check } from "lucide-react";
import { generateVibeFromBullets, suggestAttributesFromBullets } from "@/lib/vibeGenerator";
import { SoulState } from "@/store/soulStore";

interface FillWithAIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (values: Partial<SoulState["soul"]> & { vibe: string }) => void;
  currentSoul: SoulState["soul"];
}

export function FillWithAIDialog({ open, onOpenChange, onApply, currentSoul }: FillWithAIDialogProps) {
  const t = useTranslations("fillWithAI");
  const [bulletsText, setBulletsText] = useState("");
  const [generatedVibe, setGeneratedVibe] = useState("");
  const [suggestedAttrs, setSuggestedAttrs] = useState<Partial<SoulState["soul"]>>({});
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = useCallback(() => {
    const lines = bulletsText.split("\n").map((l) => l.replace(/^[-•*]\s*/, "").trim()).filter((l) => l.length > 0);
    if (lines.length === 0) return;
    setGeneratedVibe(generateVibeFromBullets(lines));
    setSuggestedAttrs(suggestAttributesFromBullets(lines));
    setIsGenerated(true);
  }, [bulletsText]);

  const handleApply = useCallback(() => {
    const lines = bulletsText.split("\n").map((l) => l.replace(/^[-•*]\s*/, "").trim()).filter((l) => l.length > 0);
    const attrs = suggestAttributesFromBullets(lines);
    onApply({ ...attrs, vibe: generatedVibe });
    onOpenChange(false);
    setBulletsText("");
    setGeneratedVibe("");
    setSuggestedAttrs({});
    setIsGenerated(false);
  }, [bulletsText, generatedVibe, onApply, onOpenChange]);

  const previewAttrs = ["humor", "formality", "emojiUsage", "verbosity", "openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"] as const;
  const attrLabels: Record<string, string> = { humor: "Humor", formality: "Formality", emojiUsage: "Emoji Usage", verbosity: "Verbosity", openness: "Openness", conscientiousness: "Conscientiousness", extraversion: "Extraversion", agreeableness: "Agreeableness", neuroticism: "Neuroticism" };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-muted-fg">
            {t("description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-fg text-sm">{t("bulletPoints")}</Label>
            <Textarea
              value={bulletsText}
              onChange={(e) => setBulletsText(e.target.value)}
              placeholder={t("placeholder")}
              rows={5}
              className="bg-surface-alt/80 border-border focus:border-primary rounded-xl resize-none text-fg placeholder:text-muted-fg"
            />
            <p className="text-xs text-muted-fg">{t("hint")}</p>
          </div>
          {!isGenerated && (
            <Button
              onClick={handleGenerate}
              disabled={!bulletsText.trim()}
              className="w-full bg-primary text-primary-fg border-0 h-12 text-base font-display tracking-wider"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {t("generate")}
            </Button>
          )}

          {/* Generated Preview */}
          {isGenerated && (
            <div className="space-y-5 animate-fade-up">
              {/* Generated Vibe */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-fg text-sm">{t("generatedVibe")}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRegenerate}
                    className="text-muted-fg hover:text-fg h-7 px-2"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    {t("regenerate")}
                  </Button>
                </div>
                <div className="p-4 rounded-xl bg-surface-alt/80 border border-border text-fg text-sm leading-relaxed whitespace-pre-wrap">
                  {generatedVibe}
                </div>
              </div>

              {/* Suggested Attributes */}
              <div className="space-y-3">
                <Label className="text-fg text-sm">{t("suggestedAttributes")}</Label>
                <div className="p-4 rounded-xl bg-surface-alt/80 border border-border space-y-4">
                  {previewAttrs.map((attr) => {
                    const suggested = (suggestedAttrs as any)[attr];
                    const current = (currentSoul as any)[attr];
                    if (suggested === undefined) return null;

                    return (
                      <div key={attr} className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-fg capitalize">
                            {attrLabels[attr] || attr}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-fg font-mono">
                              {current}
                            </span>
                            <span className="text-muted-fg">→</span>
                            <span className="text-xs text-accent font-mono bg-accent/10 px-1.5 py-0.5 rounded">
                              {suggested}
                            </span>
                          </div>
                        </div>
                        <div className="relative h-2">
                          <div className="absolute inset-0 rounded-full bg-border" />
                          <div
                            className="absolute top-0 left-0 h-full rounded-full bg-primary/20 transition-all"
                            style={{ width: `${current}%` }}
                          />
                          <div
                            className="absolute top-0 left-0 h-full rounded-full bg-primary/40 transition-all"
                            style={{ width: `${suggested}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Non-numeric attributes */}
                  {suggestedAttrs.communicationMode && (
                    <div className="flex justify-between items-center pt-2 border-t border-border">
                      <span className="text-xs text-muted-fg">Communication Mode</span>
                      <span className="text-xs text-accent font-mono bg-accent/10 px-1.5 py-0.5 rounded">
                        {suggestedAttrs.communicationMode}
                      </span>
                    </div>
                  )}
                  {suggestedAttrs.vibeStyle && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-fg">Vibe Style</span>
                      <span className="text-xs text-accent font-mono bg-accent/10 px-1.5 py-0.5 rounded">
                        {suggestedAttrs.vibeStyle}
                      </span>
                    </div>
                  )}
                  {suggestedAttrs.knowledgeDomains && suggestedAttrs.knowledgeDomains.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-fg">Knowledge Domains</span>
                      <span className="text-xs text-accent font-mono bg-accent/10 px-1.5 py-0.5 rounded">
                        {suggestedAttrs.knowledgeDomains.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleRegenerate}
                  variant="outline"
                  className="flex-1 border-border text-fg"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t("regenerate")}
                </Button>
                <Button
                  onClick={handleApply}
                  className="flex-1 bg-primary text-primary-fg border-0"
                >
                  <Check className="mr-2 h-4 w-4" />
                  {t("apply")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
