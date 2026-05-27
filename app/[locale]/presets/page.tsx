"use client";

import { useTranslations, useMessages } from "next-intl";
import { PresetCard } from "@/components/preset-card";
import Link from "next/link";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { SoulPreset } from "@/store/soulStore";
import { useRouter, useParams } from "next/navigation";
import { useRatingsStore } from "@/store/ratingsStore";
import { PresetsGridSkeleton } from "@/components/skeletons";

// Blacklist of preset IDs to filter out
const PRESET_BLACKLIST = new Set(['adolf-hitler'])

// Category chips for filtering (order matters — grouped by domain)
const CATEGORY_CHIPS = [
  // Identity
  "masculino", "feminino", "robo", "animal", "divindade",
  // Genre
  "ficção", "histórico", "mitológico", "contemporâneo",
  // Personality
  "calmo", "agressivo", "sarcástico", "otimista", "sombrio", "energético",
  // Use Case
  "trabalho", "lifestyle", "escrita", "educação",
  // Domain
  "tecnologia", "ciência", "arte", "negócios", "saúde", "segurança", "engenharia",
  // Source
  "marvel", "dc", "anime", "videogame", "HQ", "filme",
  // Role
  "herói", "vilão", "anti-herói", "mentor", "líder", "companheiro",
  // Profession
  "cantor", "artista", "escritor", "cientista", "guerreiro",
];

function getPageSize() {
  if (typeof window === 'undefined') return 50;
  return window.innerWidth < 768 ? 25 : 50;
}

export default function PresetsPage() {
  const t = useTranslations("presetsPage");
  const messages = useMessages();
  const presetsMessages = (messages as any)?.presets as
    | Record<string, Record<string, string>>
    | undefined;
  const [presets, setPresets] = useState<SoulPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState(() => getPageSize());
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const fetchedRef = useRef(false);

  // Single-effect data fetch
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/filtered-presets?locale=${locale}&limit=1000`);
        if (!res.ok) throw new Error("Failed to fetch presets");
        const json = await res.json();
        if (cancelled) return;

        const mapped = ((json.data || []) as any[]).map(formatPreset);
        setPresets(mapped);
      } catch (err: any) {
        console.error("Erro ao carregar presets:", err);
        // Fallback: import presets estáticos
        if (!cancelled) {
          try {
            const { presets: localPresets } = await import("@/data/presets");
            setPresets(localPresets);
          } catch (e) {
            console.error("Fallback também falhou:", e);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    // Also fetch rating aggregates from backend
    useRatingsStore.getState().fetchAggregates();
    return () => { cancelled = true; };
  }, [locale]);

  // Compute category counts from presets
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of CATEGORY_CHIPS) {
      counts[cat] = presets.filter(p => p.tags.includes(cat)).length;
    }
    return counts;
  }, [presets]);

  const filtered = useMemo(() => {
    let result = presets.filter(p => !PRESET_BLACKLIST.has(p.id));
    if (presetsMessages) {
      result = result.map(p => {
        const pt = presetsMessages[p.id];
        if (!pt) return p;
        return { ...p, name: pt.name || p.name, creature: pt.creature || p.creature, vibe: pt.vibe || p.vibe, description: pt.description || p.description };
      });
    }
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
    // Multi-tag AND filter
    if (selectedTags.length > 0) {
      result = result.filter((p) =>
        selectedTags.every(tag => p.tags.includes(tag))
      );
    }
    return result;
  }, [presets, search, selectedTags, presetsMessages]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(getPageSize());
  }, [search, selectedTags]);

  // Infinite scroll: observe sentinel element
  const loadMore = useCallback(() => {
          setDisplayCount(prev => Math.min(prev + getPageSize(), filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < filtered.length) {
          loadMore();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [displayCount, filtered.length, loadMore]);

  const visiblePresets = useMemo(() => {
    return filtered.slice(0, displayCount);
  }, [filtered, displayCount]);

  const handleSelect = (preset: SoulPreset) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    router.push(`/${locale}/editor?preset=${preset.id}`);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearTags = () => setSelectedTags([]);

  return (
    <div className="min-h-screen bg-surface-dim">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-24 flex flex-col gap-10">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
          <div className="flex flex-col gap-2">
            <span className="font-display text-primary uppercase tracking-widest">
              {t("directory")}
            </span>
            <h1 className="font-display text-primary text-3xl">
              {t("title")}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2">
              {t("subtitle")}
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">
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
                className="bg-background border border-border text-foreground/80 font-mono-data text-mono-data pl-10 pr-4 py-2 rounded focus:border-primary-container focus:ring-0 focus:outline-none appearance-none w-full md:w-56 transition-colors"
                aria-label={t("searchPlaceholder")}
              />
            </div>
          </div>
        </section>

        {/* Category Filter Chips */}
        {!loading && presets.length > 0 && (
          <section className="flex flex-wrap gap-2 items-center">
            <span className="material-symbols-outlined text-muted-foreground text-lg mr-1">filter_list</span>
            {CATEGORY_CHIPS.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const active = selectedTags.includes(cat);
              if (count === 0 && !active) return null;
              return (
                <button
                  key={cat}
                  onClick={() => toggleTag(cat)}
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150
                    ${active
                      ? "bg-primary text-primary-container shadow-sm shadow-primary/20"
                      : "bg-surface-alt/60 text-muted-foreground hover:bg-surface-alt hover:text-foreground border border-border"
                    }
                  `}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] tabular-nums ${active ? "text-primary-container/80" : "text-muted-foreground/60"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
            {selectedTags.length > 0 && (
              <button
                onClick={clearTags}
                className="inline-flex items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
                {t("clearFilters") || "Limpar"}
              </button>
            )}
          </section>
        )}

        {/* Results count */}
        {!loading && (
          <div className="flex items-center justify-between">
            <span className="font-mono-data text-mono-data text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? t("entry") : t("entries")} {t("found")}
              {selectedTags.length > 0 && (
                <span className="ml-2 text-primary/70">
                  ({selectedTags.join(" + ")})
                </span>
              )}
            </span>
              <Link
                href="/"
                className="font-label-caps text-label-caps text-muted-foreground hover:text-primary-container transition-colors flex items-center gap-2"
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
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visiblePresets.map((preset, i) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  index={i}
                  onSelect={handleSelect}
                />
              ))}
            </section>

            {/* Sentinel for infinite scroll */}
            {displayCount < filtered.length && (
              <div ref={sentinelRef} className="flex justify-center py-8">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="font-mono-data text-mono-data">
                    {displayCount} / {filtered.length}
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-foreground/20 mb-4 block">
              search_off
            </span>
            <p className="font-body-lg text-body-lg text-muted-foreground">
              {search
                ? t("noPresetsFoundSearch", { query: search })
                : t("noPresetsFound")}
            </p>
            {selectedTags.length > 0 && (
              <button
                onClick={clearTags}
                className="mt-4 text-sm text-primary hover:text-primary-container transition-colors underline"
              >
                {t("clearFilters") || "Limpar filtros"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Format a preset from the API response
function formatPreset(data: any): SoulPreset {
  let tags = data.tags || [];
  if (typeof tags === 'string') {
    try { tags = JSON.parse(tags); } catch { tags = []; }
  }

  return {
    id: data.id,
    name: data.name,
    creature: data.creature,
    vibe: data.vibe,
    emoji: data.emoji,
    avatar: data.avatar,
    coreTruths: {
      helpful: data.core_truths_helpful,
      opinions: data.core_truths_opinions,
      resourceful: data.core_truths_resourceful,
      trustworthy: data.core_truths_trustworthy,
      respectful: data.core_truths_respectful,
    },
    boundaries: {
      private: data.boundaries_private,
      askBeforeActing: data.boundaries_ask_before_acting,
      noHalfBaked: data.boundaries_no_half_baked,
      notVoiceProxy: data.boundaries_not_voice_proxy,
    },
    vibeStyle: data.vibe_style as any,
    description: data.description,
    tags: tags,
    source: data.source,
    humor: data.humor ?? 50,
    formality: data.formality ?? 50,
    emojiUsage: data.emoji_usage ?? 10,
    verbosity: data.verbosity ?? 50,
    consciousness: data.consciousness ?? 50,
    questioning: data.questioning ?? 30,
    openness: data.openness ?? 70,
    conscientiousness: data.conscientiousness ?? 50,
    extraversion: data.extraversion ?? 50,
    agreeableness: data.agreeableness ?? 50,
    neuroticism: data.neuroticism ?? 30,
    communicationMode: data.communication_mode ?? undefined,
    knowledgeDomains: data.knowledge_domains ?? undefined,
    signaturePhrases: data.signature_phrases ?? undefined,
    emotionalRange: data.emotional_range ?? undefined,
    speechPatterns: data.speech_patterns ?? undefined,
    role: data.role ?? undefined,
    roleDescription: data.role_description ?? undefined,
    mandateRules: data.mandate_rules ?? undefined,
    voicePrivate: data.voice_private ?? undefined,
    voicePublic: data.voice_public ?? undefined,
    autonomyAuto: data.autonomy_auto ?? undefined,
    autonomyRequireApproval: data.autonomy_require_approval ?? undefined,
    worldview: data.worldview ?? undefined,
    expertise: data.expertise ?? undefined,
    memoryPolicy: data.memory_policy ?? undefined,
    petPeeves: data.pet_peeves ?? undefined,
    voiceRules: data.voice_rules ?? undefined,
  };
}
