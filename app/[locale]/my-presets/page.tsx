"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyPresetsStore } from "@/store/myPresetsStore";
import { useRouter } from "next/navigation";
import { Trash2, FolderOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Locale } from "date-fns";
import { ptBR, enUS, es, ja } from "date-fns/locale";

const locales: Record<string, Locale> = { pt: ptBR, en: enUS, es: es, ja: ja };

export default function MyPresetsPage() {
  const t = useTranslations("myPresets");
  const router = useRouter();
  const { presets, remove, load } = useMyPresetsStore();
  const locale = (router as any).getLocale?.() || "en";
  const fmtLocale = locales[locale] || enUS;

  const handleLoad = (soul: any) => {
    // Dispatch custom event to update editor state
    window.dispatchEvent(new CustomEvent("load-soul-preset", { detail: soul }));
    router.push("/editor");
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
      <p className="text-muted-foreground mb-8">{t("subtitle")}</p>

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
  );
}
