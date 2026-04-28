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
import { motion, AnimatePresence } from "framer-motion";
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
    const lines = bulletsText
      .split("\n")
      .map((l) => l.replace(/^[-•*]\s*/, "").trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    const vibe = generateVibeFromBullets(lines);
    const attrs = suggestAttributesFromBullets(lines);

    setGeneratedVibe(vibe);
    setSuggestedAttrs(attrs);
    setIsGenerated(true);
  }, [bulletsText]);

  const handleRegenerate = useCallback(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleApply = useCallback(() => {
    const lines = bulletsText
      .split("\n")
      .map((l) => l.replace(/^[-•*]\s*/, "").trim())
      .filter((l) => l.length > 0);

    const attrs = suggestAttributesFromBullets(lines);
    onApply({
      ...attrs,
      vibe: generatedVibe,
    });
    onOpenChange(false);
    setBulletsText("");
    setGeneratedVibe("");
    setSuggestedAttrs({});
    setIsGenerated(false);
  }, [bulletsText, generatedVibe, onApply, onOpenChange]);

  const previewAttrs = [
    "humor", "formality", "emojiUsage", "verbosity",
    "openness", "conscientiousness", "extraversion",
    "agreeableness", "neuroticism",
  ] as const;

  const attrLabels: Record<string, string> = {
    humor: "Humor",
    formality: "Formality",
    emojiUsage: "Emoji Usage",
    verbosity: "Verbosity",
    openness: "Openness",
    conscientiousness: "Conscientiousness",
    extraversion: "Extraversion",
    agreeableness: "Agreeableness",
    neuroticism: "Neuroticism",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a0f2e] border-purple-500/30 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-purple-400" />
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-purple-300/60">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bullet Points Input */}
          <div className="space-y-2">
            <Label className="text-purple-200/80 text-sm">{t("bulletPoints")}</Label>
            <Textarea
              value={bulletsText}
              onChange={(e) => setBulletsText(e.target.value)}
              placeholder={t("placeholder")}
              rows={5}
              className="bg-[#0d0820]/80 border-purple-500/20 focus:border-purple-400/40 rounded-xl resize-none text-purple-100 placeholder:text-purple-400/30"
            />
            <p className="text-xs text-purple-400/40">{t("hint")}</p>
          </div>

          {/* Generate Button */}
          {!isGenerated && (
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                onClick={handleGenerate}
                disabled={!bulletsText.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white border-0 shadow-lg shadow-purple-500/20 h-12 text-base font-display tracking-wider"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {t("generate")}
              </Button>
            </motion.div>
          )}

          {/* Generated Preview */}
          <AnimatePresence>
            {isGenerated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {/* Generated Vibe */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-purple-200/80 text-sm">{t("generatedVibe")}</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRegenerate}
                      className="text-purple-400/60 hover:text-purple-300 h-7 px-2"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      {t("regenerate")}
                    </Button>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0d0820]/80 border border-purple-500/15 text-purple-200/80 text-sm leading-relaxed whitespace-pre-wrap">
                    {generatedVibe}
                  </div>
                </div>

                {/* Suggested Attributes */}
                <div className="space-y-3">
                  <Label className="text-purple-200/80 text-sm">{t("suggestedAttributes")}</Label>
                  <div className="p-4 rounded-xl bg-[#0d0820]/80 border border-purple-500/15 space-y-4">
                    {previewAttrs.map((attr) => {
                      const suggested = (suggestedAttrs as any)[attr];
                      const current = (currentSoul as any)[attr];
                      if (suggested === undefined) return null;

                      return (
                        <div key={attr} className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-purple-300/60 capitalize">
                              {attrLabels[attr] || attr}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-purple-400/40 font-mono">
                                {current}
                              </span>
                              <span className="text-purple-400/30">→</span>
                              <span className="text-xs text-amber-400/80 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded">
                                {suggested}
                              </span>
                            </div>
                          </div>
                          <div className="relative h-2">
                            <div className="absolute inset-0 rounded-full bg-purple-900/30" />
                            <div
                              className="absolute top-0 left-0 h-full rounded-full bg-purple-500/20 transition-all"
                              style={{ width: `${current}%` }}
                            />
                            <div
                              className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-amber-500/40 to-purple-500/40 transition-all"
                              style={{ width: `${suggested}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {/* Non-numeric attributes */}
                    {suggestedAttrs.communicationMode && (
                      <div className="flex justify-between items-center pt-2 border-t border-purple-500/10">
                        <span className="text-xs text-purple-300/60">Communication Mode</span>
                        <span className="text-xs text-amber-400/80 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded">
                          {suggestedAttrs.communicationMode}
                        </span>
                      </div>
                    )}
                    {suggestedAttrs.vibeStyle && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-purple-300/60">Vibe Style</span>
                        <span className="text-xs text-amber-400/80 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded">
                          {suggestedAttrs.vibeStyle}
                        </span>
                      </div>
                    )}
                    {suggestedAttrs.knowledgeDomains && suggestedAttrs.knowledgeDomains.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-purple-300/60">Knowledge Domains</span>
                        <span className="text-xs text-amber-400/80 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded">
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
                    className="flex-1 border-purple-500/20 text-purple-300 hover:text-purple-100"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t("regenerate")}
                  </Button>
                  <Button
                    onClick={handleApply}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white border-0 shadow-lg shadow-purple-500/20"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {t("apply")}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
