"use client";

import { useTranslations, useMessages } from "next-intl";
import { usePresets } from "@/lib/usePresets";
import { PresetCard } from "@/components/preset-card";
import Link from "next/link";
import { useState, useMemo } from "react";
import { SoulPreset } from "@/store/soulStore";
import { useRouter } from "next/navigation";
import { PresetsGridSkeleton } from "@/components/skeletons";

export default function PresetsPage() {
  const t = useTranslations("presetsPage");
  const messages = useMessages();
  const presetsMessages = (messages as any)?.presets as
    | Record<string, Record<string, string>>
    | undefined;
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
    window.dispatchEvent(
      new CustomEvent("load-soul-preset", { detail: preset })
    );
    router.push("/editor");
  };

  return (
    <div className="min-h-screen bg-surface-dim">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 flex flex-col gap-10">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
          <div className="flex flex-col gap-2">
            <span className="font-display text-yellow-400 uppercase tracking-widest">
              {t("directory")}
            </span>
            <h1 className="font-display text-yellow-400 text-3xl">
              {t("title")}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2">
              {t("subtitle")}
            </p>
          </div>

          {/* Filter & Search */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-grow md:flex-grow-0">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xl">
                search
              </span>
              <label htmlFor="presets-search" className="sr-only">
                {t("searchPlaceholder")}
              </label>
              <input
                id="presets-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="bg-black border border-white/10 text-white/80 font-mono-data text-mono-data pl-10 pr-4 py-2 rounded focus:border-primary-container focus:ring-0 focus:outline-none appearance-none w-full md:w-56 transition-colors"
                aria-label={t("searchPlaceholder")}
              />
            </div>

            {/* Filter dropdown */}
            <div className="relative flex-grow md:flex-grow-0">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xl">
                filter_list
              </span>
              <select
                value={selectedTag || ""}
                onChange={(e) =>
                  setSelectedTag(e.target.value || null)
                }
                className="glass-panel bg-white/5 backdrop-blur border border-white/10 text-white/80 font-mono-data text-mono-data pl-10 pr-8 py-2 rounded focus:border-yellow-400 focus:ring-0 focus:outline-none appearance-none w-full md:w-48 cursor-pointer transition-colors"
                aria-label="Filter by tag"
              >
                <option value="">{t("allArchetypes")}</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Results count */}
        {!loading && (
          <div className="flex items-center justify-between">
            <span className="font-mono-data text-mono-data text-white/40">
              {filtered.length} {filtered.length === 1 ? t("entry") : t("entries")} {t("found")}
            </span>
              <Link
                href="/"
                className="font-label-caps text-label-caps text-white/40 hover:text-primary-container transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  arrow_back
                </span>
                {t("backToHome")}
              </Link>
          </div>
        )}

        {/* Presets Grid */}
        {loading ? (
          <PresetsGridSkeleton count={8} />
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((preset, i) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                index={i}
                onSelect={handleSelect}
              />
            ))}
          </section>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-white/20 mb-4 block">
              search_off
            </span>
            <p className="font-body-lg text-body-lg text-white/40">
              {search
                ? t("noPresetsFoundSearch", { query: search })
                : t("noPresetsFound")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
