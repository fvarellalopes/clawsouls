"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { avatarUrl } from "@/lib/avatar";

interface PresetPreview {
  id: string;
  name: string;
  creature: string;
  emoji?: string;
  tags?: string[];
}

// Curated list of iconic presets to feature
const FEATURED_IDS = [
  "batman", "sherlock-holmes", "harry-potter", "naruto-uzumaki",
  "elon-musk", "nikola-tesla", "marie-curie", "sun-tzu",
  "deadpool", "joker", "gandalf", "yoda"
];

export default function HomePage() {
  const t = useTranslations("home");
  const [featured, setFeatured] = useState<PresetPreview[]>([]);

  useEffect(() => {
    fetch("/api/filtered-presets?limit=500")
      .then((r) => r.json())
      .then((data) => {
        const all = data.data || [];
        const picked = FEATURED_IDS
          .map((id) => all.find((p: PresetPreview) => p.id === id))
          .filter(Boolean)
          .slice(0, 8);
        // If not enough featured, fill with first available
        if (picked.length < 8) {
          const remaining = all
            .filter((p: PresetPreview) => !FEATURED_IDS.includes(p.id))
            .slice(0, 8 - picked.length);
          picked.push(...remaining);
        }
        setFeatured(picked);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,var(--bg)_0%,var(--surface-dim)_50%,var(--bg)_100%)]">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 py-24 md:py-32 text-center">
        <div className="animate-fade-in">
          {/* Badge */}
          <span className="inline-block mb-8 px-4 py-1 rounded-full border border-primary text-primary text-label-caps tracking-widest uppercase">
            {t("systemOnline")}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-[48px] font-display text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/80 mb-6 max-w-3xl mx-auto">
            {t("heroTitleMain")}
          </h1>

          {/* Subtitle */}
          <p className="text-body-lg font-body-sm text-on-surface-variant mb-12 max-w-2xl mx-auto leading-relaxed">
            {t("heroSubtitleMain")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/editor?preset=jarvis"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-label-caps tracking-widest uppercase rounded-lg hover:brightness-110 transition-all duration-150"
            >
              {t("launchEditor")}
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>

            <Link
              href="/presets"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-primary text-primary font-label-caps tracking-widest uppercase rounded-lg hover:bg-primary/10 transition-all duration-150"
            >
              {t("browsePresets")}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Presets */}
      {featured.length > 0 && (
        <section className="px-4 pb-16">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-h2 font-h2 text-on-surface mb-3">
                {t("featuredPresets") || "Featured Souls"}
              </h2>
              <p className="text-body-md font-body-sm text-on-surface-variant max-w-xl mx-auto">
                {t("featuredPresetsDesc") || "Popular characters ready to use as starting points"}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {featured.map((preset, i) => (
                <Link
                  key={preset.id}
                  href={`/editor?preset=${preset.id}`}
                  className="group relative rounded-xl border border-border bg-surface/60 backdrop-blur-sm overflow-hidden hover:border-primary/30 hover:bg-surface transition-all duration-200"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {/* Avatar */}
                  <div className="aspect-square overflow-hidden bg-surface-container-lowest">
                    <img
                      src={`/avatars/${preset.id}.webp`}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          const emoji = document.createElement("span");
                          emoji.className = "text-5xl flex items-center justify-center w-full h-full";
                          emoji.textContent = preset.emoji || "✨";
                          parent.appendChild(emoji);
                        }
                      }}
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-display text-sm text-foreground truncate">
                      {preset.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {preset.creature}
                    </p>
                  </div>

                  {/* Hover line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/presets"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-display uppercase tracking-wider"
              >
                {t("viewAllPresets") || "View all presets"}
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Bento Grid — Editor Mockup + Code Output */}
      <section className="px-4 pb-24">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left — Editor Mockup (8 cols) */}
            <div className="lg:col-span-8 rounded-2xl cyber-glass overflow-hidden">
              {/* Window Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-outline-variant/20">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-4 text-mono-data font-mono text-on-surface-variant/60">
                  soul_architect.exe
                </span>
              </div>

              {/* Editor Content */}
              <div className="relative p-8 min-h-[380px] bg-surface-container-lowest">
                {/* Overlay grid effect */}
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "linear-gradient(var(--color-on-surface) 1px, transparent 1px), linear-gradient(90deg, var(--color-on-surface) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                <div className="relative z-10 space-y-8">
                  {/* Personality Section */}
                  <div>
                    <h3 className="text-label-caps font-label-caps text-primary-container tracking-widest uppercase mb-4">
                      {t("personalityMatrix")}
                    </h3>

                    {/* Sliders */}
                    <div className="space-y-5">
                      <SliderMock label={t("aggression")} value={75} />
                      <SliderMock label={t("empathy")} value={30} />
                      <SliderMock label={t("logicBias")} value={90} />
                    </div>
                  </div>

                  {/* Tone Section */}
                  <div>
                    <h3 className="text-label-caps font-label-caps text-primary-container tracking-widest uppercase mb-3">
                      {t("toneProfile")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {["sarcastic", "direct", "witty", "minimal"].map((key) => (
                        <span
                          key={key}
                          className="px-3 py-1 rounded-full border border-outline-variant/40 text-body-sm font-mono text-on-surface-variant/70"
                        >
                          {t(key)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Output Panel (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl cyber-glass overflow-hidden">
              {/* Window Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-outline-variant/20">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-4 text-mono-data font-mono text-on-surface-variant/60">
                  Output
                </span>
              </div>

              {/* Code Preview */}
              <div className="p-6 min-h-[380px] bg-surface-container-lowest font-mono text-body-sm leading-relaxed">
                <pre className="text-on-surface-variant/80">
                  <code>
{`{\n  `}
                    <span className="text-primary-container">"personality"</span>
{`: {\n    `}
                    <span className="text-primary-container">"aggression"</span>
{`: `}
                    <span className="text-green-400">0.75</span>
{`,\n    `}
                    <span className="text-primary-container">"empathy"</span>
{`: `}
                    <span className="text-green-400">0.30</span>
{`,\n    `}
                    <span className="text-primary-container">"logic_bias"</span>
{`: `}
                    <span className="text-green-400">0.90</span>
{`\n  },\n  `}
                    <span className="text-primary-container">"tone"</span>
{`: [\n    `}
                    <span className="text-amber-300">"sarcastic"</span>
{`,\n    `}
                    <span className="text-amber-300">"direct"</span>
{`,\n    `}
                    <span className="text-amber-300">"witty"</span>
{`,\n    `}
                    <span className="text-amber-300">"minimal"</span>
{`\n  ],\n  `}
                    <span className="text-primary-container">"version"</span>
{`: `}
                    <span className="text-amber-300">"2.0"</span>
{`\n}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 pb-24">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-h2 text-on-surface mb-3">
              {t("forgedForCreators")}
            </h2>
            <p className="text-body-md font-body-sm text-on-surface-variant max-w-xl mx-auto">
              {t("forgedForCreatorsDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon="tune"
              title={t("features.visualTitle")}
              desc={t("features.visualDesc")}
            />
            <FeatureCard
              icon="smart_toy"
              title={t("features.presetsTitle")}
              desc={t("features.presetsDesc")}
            />
            <FeatureCard
              icon="share"
              title={t("features.shareTitle")}
              desc={t("features.shareDesc")}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Slider Mock Component ── */
function SliderMock({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-mono-data font-mono text-on-surface-variant/80">{label}</span>
        <span className="text-mono-data font-mono text-primary-container">{value}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-surface-container-highest">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-container to-primary"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/* ── Feature Card Component ── */
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="group relative p-6 rounded-xl border border-outline-variant/20 bg-surface-container/60 backdrop-blur-sm transition-all duration-200 hover:bg-surface-container hover:border-primary-container/30">
      {/* Top gold line on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary-container rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <span className="material-symbols-outlined text-3xl text-primary-container mb-4 block transition-transform duration-200 group-hover:scale-110">
        {icon}
      </span>
      <h3 className="text-h3 font-h3 text-on-surface mb-2">{title}</h3>
      <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">{desc}</p>
    </div>
  );
}
