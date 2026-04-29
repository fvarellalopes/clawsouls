"use client";

import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <span className="w-20 text-right truncate" style={{ color: "hsl(var(--foreground-muted))" }}>{label}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${value}%`,
            background: "hsl(var(--primary))",
          }}
        />
      </div>
      <span className="w-8 font-mono" style={{ color: "hsl(var(--accent))" }}>{value}</span>
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
    <div className="relative" style={{ animation: "fadeInUp 0.4s ease-out" }}>
      {/* Parchment container */}
      <div className="relative rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        {/* Content */}
        <div className="relative p-6 md:p-8">
          {/* Header with emoji and name */}
          <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{emoji || "✨"}</span>
              <div>
                <h3 className="text-xl font-bold font-display font-display text-primary">
                  {name || t("unnamedSoul")}
                </h3>
                <p className="text-sm" style={{ color: "hsl(var(--foreground-muted))" }}>{t("soulMdPreview")}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="gap-1.5 transition-all"
              style={{
                borderColor: copied ? "hsl(var(--success, 145 60% 50%))" : "hsl(var(--border))",
                color: copied ? "hsl(var(--success, 145 60% 50%))" : "hsl(var(--foreground))",
              }}
              aria-label={t("copySoulContent")}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="text-xs">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </Button>
          </div>

          {/* Tone Attributes Summary */}
          {toneAttributes && (
            <div className="mb-6 pb-4" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
              <p className="text-[10px] uppercase tracking-widest mb-3 font-display" style={{ color: "hsl(var(--foreground-muted))" }}>
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
                    className="text-2xl font-display font-bold tracking-wider mt-4 first:mt-0"
                    style={{ color: "hsl(var(--accent))" }}
                  >
                    {section.content}
                  </h2>
                );
              }
              if (section.type === "section") {
                return (
                  <h3
                    key={i}
                    className="text-lg font-display font-semibold tracking-wide mt-5 mb-2 flex items-center gap-2"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: "hsl(var(--primary))" }} />
                    {section.content}
                  </h3>
                );
              }
              if (section.type === "divider") {
                return (
                  <div key={i} className="my-4 flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ background: "hsl(var(--border))" }} />
                    <span className="text-xs" style={{ color: "hsl(var(--foreground-muted))" }}>✦</span>
                    <div className="flex-1 h-px" style={{ background: "hsl(var(--border))" }} />
                  </div>
                );
              }
              if (section.type === "item") {
                return (
                  <div
                    key={i}
                    className="flex items-start gap-2 pl-2"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    <span className="mt-1 text-xs" style={{ color: "hsl(var(--accent))" }}>▸</span>
                    <span>{section.content}</span>
                  </div>
                );
              }
              return (
                <p
                  key={i}
                  style={{ color: "hsl(var(--foreground-muted))" }}
                >
                  {section.content}
                </p>
              );
            })}
          </div>

          {/* Footer watermark */}
          <div className="mt-6 pt-4 text-center" style={{ borderTop: "1px solid hsl(var(--border))" }}>
            <span className="text-[10px] tracking-widest uppercase font-display" style={{ color: "hsl(var(--foreground-muted))" }}>
              {t("forgedBy", { year: new Date().getFullYear() })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
