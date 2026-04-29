"use client";

import { useMemo } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface ParchmentPreviewProps {
  content: string;
  name: string;
  emoji: string;
  toneAttributes?: {
    humor: number;
    formality: number;
    emojiUsage: number;
    verbosity: number;
    consciousness: number;
    questioning: number;
  };
}

function ToneBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted-fg w-20 text-right truncate">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-surface-alt overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-accent w-8 font-mono">{value}</span>
    </div>
  );
}

export function ParchmentPreview({ content, name, emoji, toneAttributes }: ParchmentPreviewProps) {
  const t = useTranslations("parchmentPreview");
  const [copied, setCopied] = useState(false);

  const sections = useMemo(() => {
    const lines = content.split("\n");
    const result: { type: "title" | "section" | "item" | "text" | "divider"; content: string }[] = [];

    for (const line of lines) {
      if (line.startsWith("# ") && !line.startsWith("## ")) {
        result.push({ type: "title", content: line.replace("# ", "") });
      } else if (line.startsWith("## ")) {
        result.push({ type: "section", content: line.replace("## ", "") });
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        result.push({ type: "item", content: line.replace(/^[-*]\s+/, "") });
      } else if (line.startsWith("---")) {
        result.push({ type: "divider", content: "" });
      } else if (line.trim()) {
        result.push({ type: "text", content: line });
      }
    }

    return result;
  }, [content]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative animate-fade-in">
      {/* Parchment container */}
      <div className="relative rounded-xl overflow-hidden border border-border bg-surface">
        {/* Content */}
        <div className="relative p-6 md:p-8">
          {/* Header with emoji and name */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{emoji || "✨"}</span>
              <div>
                <h3 className="text-xl font-bold text-fg font-display">
                  {name || t("unnamedSoul")}
                </h3>
                <p className="text-sm text-muted-fg">{t("soulMdPreview")}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="text-muted-fg hover:text-fg"
              aria-label={t("copySoulContent")}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {/* Tone Attributes Summary */}
          {toneAttributes && (
            <div className="mb-6 pb-4 border-b border-border">
              <p className="text-[10px] text-muted-fg uppercase tracking-widest mb-3 font-display">
                {t("toneProfile")}
              </p>
              <div className="space-y-1.5">
                <ToneBar label={t("humor")} value={toneAttributes.humor} />
                <ToneBar label={t("formality")} value={toneAttributes.formality} />
                <ToneBar label={t("emojiUsage")} value={toneAttributes.emojiUsage} />
                <ToneBar label={t("verbosity")} value={toneAttributes.verbosity} />
                <ToneBar label={t("consciousness")} value={toneAttributes.consciousness} />
                <ToneBar label={t("questioning")} value={toneAttributes.questioning} />
              </div>
            </div>
          )}

          {/* Rendered markdown */}
          <div className="space-y-3 font-body text-[15px] leading-relaxed">
            {sections.map((section, i) => {
              if (section.type === "title") {
                return (
                  <h2
                    key={i}
                    className="text-2xl font-display font-bold text-foreground mt-4 first:mt-0"
                  >
                    {section.content}
                  </h2>
                );
              }
              if (section.type === "section") {
                return (
                  <h3
                    key={i}
                    className="text-lg font-display font-semibold text-foreground mt-5 mb-2 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary/60" />
                    {section.content}
                  </h3>
                );
              }
              if (section.type === "divider") {
                return (
                  <div key={i} className="my-4 flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-muted-fg text-xs">✦</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                );
              }
              if (section.type === "item") {
                return (
                  <div key={i} className="flex items-start gap-2 pl-2 text-fg/80">
                    <span className="text-muted-fg mt-1 text-xs">▸</span>
                    <span>{section.content}</span>
                  </div>
                );
              }
              return (
                <p key={i} className="text-muted-fg">
                  {section.content}
                </p>
              );
            })}
          </div>

          {/* Footer watermark */}
          <div className="mt-6 pt-4 border-t border-border text-center">
            <span className="text-[10px] text-muted-fg tracking-widest uppercase font-display">
              {t("forgedBy", { year: new Date().getFullYear() })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
