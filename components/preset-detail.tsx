"use client";

import { SoulPreset } from "@/store/soulStore";
import { avatarUrl } from "@/lib/avatar";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PresetDetailProps {
  preset: SoulPreset;
  locale: string;
}

export function PresetDetail({ preset, locale }: PresetDetailProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-surface-dim">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Breadcrumb */}
        <Link
          href={`/${locale}/presets`}
          className="font-label-caps text-label-caps text-foreground/40 hover:text-primary-container transition-colors flex items-center gap-2 mb-8"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          &lt; BACK TO PRESETS
        </Link>

        {/* Hero */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Avatar */}
          <div className="w-full md:w-64 aspect-square rounded-2xl overflow-hidden bg-background/50 border border-border">
            <img
              src={avatarUrl(preset) || preset.avatar || "/placeholder-avatar.png"}
              alt={preset.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <span className="font-mono-data text-sm text-primary-container">
                {preset.id.toUpperCase()}
              </span>
              <h1 className="font-display text-4xl text-foreground mt-1">{preset.name}</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
                {preset.creature}
              </p>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {preset.vibe}
            </p>

            <p className="font-body-sm text-body-sm text-muted-foreground leading-relaxed">
              {preset.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {preset.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium rounded-full border border-border text-foreground/50 font-mono"
                >
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => router.push(`/${locale}/editor?preset=${preset.id}`)}
              className="mt-4 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-yellow-400 text-black font-label-caps tracking-widest uppercase rounded-lg hover:brightness-110 transition-all w-full md:w-auto"
            >
              <span className="material-symbols-outlined text-base">download</span>
              LOAD INTO EDITOR
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Humor", value: preset.humor ?? 50 },
            { label: "Formality", value: preset.formality ?? 50 },
            { label: "Emoji", value: preset.emojiUsage ?? 10 },
            { label: "Verbosity", value: preset.verbosity ?? 50 },
            { label: "Consciousness", value: preset.consciousness ?? 50 },
            { label: "Questioning", value: preset.questioning ?? 30 },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl bg-foreground/[0.02] border border-border">
              <div className="font-mono-data text-xs text-primary-container mb-1">
                {stat.label.toUpperCase()}
              </div>
              <div className="font-display text-2xl text-foreground">{stat.value}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
