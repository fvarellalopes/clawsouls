"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { generateSoulMD } from "@/lib/soulGenerator";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { SoulState } from "@/store/soulStore";

interface SoulPreviewProps {
  soul: SoulState["soul"];
}

export function SoulPreview({ soul }: SoulPreviewProps) {
  const t = useTranslations("soulPreview");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const markdown = generateSoulMD(soul, locale as any);

  return (
    <div className="cyber-glass overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-primary/10">
        <div className="w-2 h-2 rounded-full cyber-pulse bg-primary" style={{ boxShadow: "0 0 6px var(--primary)" }} />
        <span className="mono-data text-primary">{t("title") || "SOUL_PREVIEW.MD"}</span>
      </div>
      <div className="p-5">
        <pre
          className="overflow-x-auto whitespace-pre-wrap overflow-y-auto"
          style={{
            maxHeight: "24rem",
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontSize: "12px",
            lineHeight: "1.7",
            color: "var(--fg)",
          }}
        >
          {markdown}
        </pre>
      </div>
    </div>
  );
}
