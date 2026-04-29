"use client";

import { useTranslations, useMessages } from "next-intl";
import { usePresets } from "@/lib/usePresets";
import { PresetCard } from "@/components/preset-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Search, X } from "lucide-react";
import { useState, useMemo } from "react";
import { SoulPreset } from "@/store/soulStore";
import { useRouter } from "next/navigation";
import { PresetsGridSkeleton } from "@/components/skeletons";

export default function PresetsPage() {
  const t = useTranslations("presetsPage");
  const messages = useMessages();
  const presetsMessages = (messages as any)?.presets as Record<string, Record<string, string>> | undefined;
  const { presets, loading } = usePresets(presetsMessages);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const router = useRouter();

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    presets.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [presets]);

  const filtered = useMemo(() => {
    let result = presets;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.creature.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedTag) {
      result = result.filter((p) => p.tags.includes(selectedTag));
    }
    return result;
  }, [presets, search, selectedTag]);

  const handleSelect = (preset: SoulPreset) => {
    window.dispatchEvent(new CustomEvent("load-soul-preset", { detail: preset }));
    router.push("/editor");
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToHome")}
            </Link>
          </Button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-display text-primary font-display tracking-wider mb-3">
            {t("title")}
          </h1>
          <p className="text-muted-fg text-lg">{t("subtitle")}</p>
        </div>

        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle-fg" aria-hidden="true" />
            <label htmlFor="presets-search" className="sr-only">{t("searchPlaceholder")}</label>
            <Input
              id="presets-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="pl-10 bg-surface-alt border-border rounded-xl"
              aria-label={t("searchPlaceholder")}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle-fg hover:text-muted-fg"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            size="sm"
            variant={selectedTag === null ? "default" : "outline"}
            onClick={() => setSelectedTag(null)}
            className="rounded-full text-xs"
          >
            {t("all")}
          </Button>
          {allTags.slice(0, 15).map((tag) => (
            <Button
              key={tag}
              size="sm"
              variant={selectedTag === tag ? "default" : "outline"}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className="rounded-full text-xs"
            >
              {tag}
            </Button>
          ))}
        </div>

        {loading ? (
          <PresetsGridSkeleton count={9} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((preset, i) => (
              <div key={preset.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.03}s` }}>
                <PresetCard preset={preset} index={i} onSelect={handleSelect} />
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-subtle-fg text-lg">
              {search ? t("noPresetsFoundSearch", { query: search }) : t("noPresetsFound")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
