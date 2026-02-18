"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useSoulStore } from "@/store/soulStore";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Filter } from "lucide-react";
import Link from "next/link";

interface Preset {
  id: string;
  name: string;
  creature: string;
  vibe?: string;
  emoji?: string;
  tags: string[];
  description?: string;
}

export default function PresetsPage() {
  const t = useTranslations("presetsPage");
  const { loadPreset } = useSoulStore();
  const router = useRouter();

  const [presets, setPresets] = useState<Preset[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCreature, setSelectedCreature] = useState<string | null>(null);
  const [creatures, setCreatures] = useState<string[]>([]);

  useEffect(() => {
    fetchPresets();
    fetchFacets();
  }, [search, selectedCreature]);

  const fetchFacets = async () => {
    const res = await fetch('/api/presets?limit=1');
    if (res.ok) {
      const json = await res.json();
      if (json.facets?.creature) {
        setCreatures(json.facets.creature);
      }
    }
  };

  const fetchPresets = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      limit: '50',
      offset: '0',
      ...(search && { search }),
      ...(selectedCreature && { creature: selectedCreature })
    });
    const res = await fetch(`/api/presets?${params.toString()}`);
    if (res.ok) {
      const json = await res.json();
      setPresets(json.data);
      setTotal(json.meta.total);
    }
    setLoading(false);
  };

  const handleLoadPreset = (preset: Preset) => {
    loadPreset(preset as any); // cast because store expects full shape
    router.push("/editor");
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToHome')}
            </Link>
          </Button>
          <h1 className="text-4xl font-bold mt-4">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('subtitle', { total })}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="border rounded-md px-3 py-2"
              value={selectedCreature || ""}
              onChange={(e) => setSelectedCreature(e.target.value || null)}
            >
              <option value="">{t('allCreatures')}</option>
              {creatures.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-12">{t('loading')}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleLoadPreset(preset)}
              >
                <div className="text-4xl mb-2">{preset.emoji}</div>
                <h3 className="font-semibold truncate">{preset.name}</h3>
                <p className="text-sm text-muted-foreground">{preset.creature}</p>
                {preset.tags && preset.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {preset.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs bg-secondary px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && presets.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t('noPresetsFound')}
          </div>
        )}
      </div>
    </div>
  );
}
