import { NextRequest, NextResponse } from "next/server";
import { presets } from "@/data/presets";
import type { SoulState } from "@/store/soulStore";
import { generateSoulMD } from "@/lib/soulGenerator";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const preset = presets.find((p) => p.id === slug);

  if (!preset) {
    return new NextResponse("404 Not Found", { status: 404 });
  }

  // Map SoulPreset → SoulState["soul"] for the generator
  const soul: SoulState["soul"] = {
    name: preset.name,
    creature: preset.creature,
    vibe: preset.vibe,
    emoji: preset.emoji,
    avatar: preset.avatar,
    coreTruths: { ...preset.coreTruths },
    boundaries: { ...preset.boundaries },
    customCoreTruths: preset.customCoreTruths ?? [],
    customBoundaries: preset.customBoundaries ?? [],
    vibeStyle: preset.vibeStyle,
    continuity: true,
    humor: preset.humor ?? 50,
    formality: preset.formality ?? 50,
    emojiUsage: preset.emojiUsage ?? 50,
    verbosity: preset.verbosity ?? 50,
    consciousness: preset.consciousness ?? 50,
    questioning: preset.questioning ?? 50,
    openness: preset.openness ?? 50,
    conscientiousness: preset.conscientiousness ?? 50,
    extraversion: preset.extraversion ?? 50,
    agreeableness: preset.agreeableness ?? 50,
    neuroticism: preset.neuroticism ?? 50,
    communicationMode: preset.communicationMode ?? "balanced",
    knowledgeDomains: preset.knowledgeDomains ?? [],
    signaturePhrases: preset.signaturePhrases ?? [],
    emotionalRange: preset.emotionalRange ?? 50,
    speechPatterns: {
      alliteration: preset.speechPatterns?.alliteration ?? false,
      rhymeTendency: preset.speechPatterns?.rhymeTendency ?? 50,
      metaphorFrequency: preset.speechPatterns?.metaphorFrequency ?? 50,
      technicalJargon: preset.speechPatterns?.technicalJargon ?? 50,
      slangUsage: preset.speechPatterns?.slangUsage ?? 50,
    },
  };

  const md = generateSoulMD(soul);

  return new NextResponse(md, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
