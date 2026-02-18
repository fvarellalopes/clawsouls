"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { presets } from "@/data/presets";
import { useSoulStore } from "@/store/soulStore";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PresetsPage() {
  const t = useTranslations("presetsPage");
  const { loadPreset } = useSoulStore();
  const router = useRouter();

  const handleLoadPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      loadPreset(preset);
      router.push("/editor");
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToEditor")}
            </Link>
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all hover:border-accent/50 group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-4xl">{preset.emoji}</span>
                <div>
                  <h3 className="text-xl font-semibold group-hover:text-accent transition-colors">
                    {preset.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{preset.creature}</p>
                </div>
              </div>

              <p className="text-muted-foreground mb-4 line-clamp-3">
                {preset.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {preset.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Button
                onClick={() => handleLoadPreset(preset.id)}
                className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
              >
                {t("load")}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
