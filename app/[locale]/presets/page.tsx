"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSoulStore } from "@/store/soulStore";
import { usePresets } from "@/lib/usePresets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, X, Sparkles, Filter } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PresetCard } from "@/components/preset-card";
import { ThreeBackground } from "@/components/three-background";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/animated";

export default function PresetsPage() {
  const t = useTranslations("presetsPage");
  const router = useRouter();
  const { loadPreset } = useSoulStore();
  const { presets, loading } = usePresets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    presets.forEach((p) => p.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [presets]);

  // Filter
  const filteredPresets = useMemo(() => {
    let result = presets;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.creature.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (selectedTag) {
      result = result.filter((p) => p.tags.includes(selectedTag));
    }
    return result;
  }, [presets, searchQuery, selectedTag]);

  const handleSelect = (preset: any) => {
    loadPreset(preset);
    router.push("/editor");
  };

  return (
    <div className="min-h-screen relative py-10 px-4">
      <ThreeBackground />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <FadeUp>
          <div className="text-center mb-12">
            <Link href="/editor" className="inline-flex items-center gap-2 text-purple-300/50 hover:text-purple-200 mb-6 transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Editor
            </Link>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gradient font-display tracking-wider mb-4">
                {t("title")}
              </h1>
              <p className="text-purple-200/50 text-lg max-w-xl mx-auto font-body">
                {t("subtitle")}
              </p>
            </motion.div>
          </div>
        </FadeUp>

        {/* Search + Tags */}
        <FadeUp delay={0.15}>
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400/40" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="pl-11 pr-10 bg-[#140d24]/60 border-purple-500/20 focus:border-purple-400/40 rounded-xl h-12 text-purple-100 placeholder:text-purple-400/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/40 hover:text-purple-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </FadeUp>

        {/* Tag filters */}
        <FadeUp delay={0.2}>
          <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all ${
                !selectedTag
                  ? "bg-purple-500/30 text-purple-100 ring-1 ring-purple-400/40"
                  : "bg-purple-500/10 text-purple-300/40 hover:text-purple-200/60"
              }`}
            >
              All
            </button>
            {allTags.slice(0, 15).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all ${
                  selectedTag === tag
                    ? "bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/30"
                    : "bg-purple-500/10 text-purple-300/40 hover:text-purple-200/60"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* Count */}
        <FadeUp delay={0.25}>
          <p className="text-center text-sm text-purple-400/30 mb-8 font-mono">
            {filteredPresets.length} {filteredPresets.length === 1 ? "soul" : "souls"} found
          </p>
        </FadeUp>

        {/* Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredPresets.map((preset, i) => (
              <StaggerItem key={preset.id}>
                <PresetCard preset={preset} index={i} onSelect={handleSelect} />
              </StaggerItem>
            ))}
          </AnimatePresence>
        </StaggerContainer>

        {filteredPresets.length === 0 && !loading && (
          <FadeUp>
            <div className="text-center py-20">
              <Sparkles className="h-12 w-12 text-purple-400/20 mx-auto mb-4" />
              <p className="text-purple-300/30 text-lg font-body">No souls match your search</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearchQuery(""); setSelectedTag(null); }}
                className="mt-4 text-purple-400/50"
              >
                Clear filters
              </Button>
            </div>
          </FadeUp>
        )}
      </div>
    </div>
  );
}
