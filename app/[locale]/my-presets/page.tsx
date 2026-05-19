"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyPresetsStore } from "@/store/myPresetsStore";
import { useRouter, usePathname } from "next/navigation";
import { Trash2, FolderOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Locale } from "date-fns";
import { ptBR, enUS, es, ja, zhCN, de, fr } from "date-fns/locale";

const locales: Record<string, Locale> = { pt: ptBR, en: enUS, es: es, ja: ja, zh: zhCN, de: de, fr: fr };

export default function MyPresetsPage() {
  const t = useTranslations("myPresets");
  const router = useRouter();
  const pathname = usePathname();
  const { presets, remove, load } = useMyPresetsStore();
  const localeMatch = pathname?.match(/^\/(en|pt|es|ja|fr|de|zh)/);
  const locale = localeMatch?.[1] || "en";
  const fmtLocale = locales[locale] || enUS;

  const handleLoad = (soul: any) => {
    // Pass preset id via query param to editor
    const presetId = soul.id || soul.name?.toLowerCase().replace(/\s+/g, '-');
    window.scrollTo({ top: 0, behavior: "instant" });
    router.push(`/editor?preset=${presetId}`);
  };

  return (
    <div className="min-h-screen bg-surface-dim">
      <div className="max-w-4xl mx-auto py-16 px-6">
        <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">{t("title")}</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8">{t("subtitle")}</p>

        {presets.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              {t("empty")}
              <Button variant="link" onClick={() => router.push("/editor")}>
                {t("createFirst")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presets.map((preset) => (
              <Card key={preset.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{preset.name}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLoad(preset.soul)}
                      >
                        <FolderOpen className="h-4 w-4 mr-2" />
                        {t("load")}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => remove(preset.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {t("savedAgo", {
                      time: formatDistanceToNow(preset.savedAt, {
                        addSuffix: true,
                        locale: fmtLocale,
                      }),
                    })}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <div><strong>{t("creature")}:</strong> {preset.soul.creature}</div>
                    <div><strong>{t("vibe")}:</strong> {preset.soul.vibe}</div>
                    <div><strong>{t("vibeStyle")}:</strong> {preset.soul.vibeStyle}</div>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 bg-primary/10 rounded text-xs">
                        {preset.soul.humor}% {t("humor")}
                      </span>
                      <span className="px-2 py-1 bg-primary/10 rounded text-xs">
                        {preset.soul.formality}% {t("formality")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}