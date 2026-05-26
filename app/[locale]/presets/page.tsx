"use client";

import { useTranslations, useMessages } from "next-intl";
import { PresetCard } from "@/components/preset-card";
import Link from "next/link";
import { useState, useMemo, useRef, useEffect } from "react";
import { SoulPreset } from "@/store/soulStore";
import { useRouter, useParams } from "next/navigation";
import { useRatingsStore } from "@/store/ratingsStore";
import { PresetsGridSkeleton } from "@/components/skeletons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Blacklist of preset IDs to filter out
const PRESET_BLACKLIST = new Set(['adolf-hitler'])

export default function PresetsPage() {
  const t = useTranslations("presetsPage");
  const messages = useMessages();
  const presetsMessages = (messages as any)?.presets as
    | Record<string, Record<string, string>>
    | undefined;
  const [presets, setPresets] = useState<SoulPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
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
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    presets.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
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
    if (selectedTag) {
      result = result.filter((p) => p.tags.includes(selectedTag));
    }
    return result;
  }, [presets, search, selectedTag, presetsMessages]);

  const handleSelect = (preset: SoulPreset) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    router.push(`/${locale}/editor?preset=${preset.id}`);
  };

  return (
    <div className="min-h-screen bg-surface-dim">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 flex flex-col gap-10">
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

          {/* Filter & Search */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search */}
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

            {/* Filter dropdown */}
            <div className="relative flex-grow md:flex-grow-0">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xl pointer-events-none z-10">
                filter_list
              </span>
              <Select
                value={selectedTag || "all"}
                onValueChange={(value) => setSelectedTag(value === "all" ? null : value)}
              >
                <SelectTrigger className="bg-surface-alt/50 backdrop-blur border border-border text-foreground/80 font-mono-data text-mono-data pl-10 pr-8 py-2 rounded focus:border-primary focus:ring-0 w-full md:w-48 h-10 transition-colors">
                  <SelectValue placeholder={t("allArchetypes")} />
                </SelectTrigger>
                <SelectContent className="bg-surface border border-border text-foreground">
                  <SelectItem value="all">{t("allArchetypes")}</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Results count */}
        {!loading && (
          <div className="flex items-center justify-between">
            <span className="font-mono-data text-mono-data text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? t("entry") : t("entries")} {t("found")}
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
            <span className="material-symbols-outlined text-5xl text-foreground/20 mb-4 block">
              search_off
            </span>
            <p className="font-body-lg text-body-lg text-muted-foreground">
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
