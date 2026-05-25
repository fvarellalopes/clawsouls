import { NextRequest, NextResponse } from 'next/server'
import { list_presets } from '../../../lib/db'
import { Preset } from '../../../lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { presetsGetSchema, safeError } from '@/lib/schemas'

import { presets as localPresets } from '@/data/presets'

// Blacklist of preset IDs to filter out
const PRESET_BLACKLIST = new Set(['adolf-hitler'])

// Merge remote presets with local data (fill null fields from local)
function mergeWithLocal(remotePresets: any[]): any[] {
  const localMap = new Map(localPresets.map(p => [p.id, p]))
  return remotePresets.map(remote => {
    const local = localMap.get(remote.id)
    if (!local) return remote
    // Fill any null/undefined fields from local presets
    const merged: any = { ...remote }
    for (const [key, value] of Object.entries(local)) {
      if (merged[key] === null || merged[key] === undefined) {
        // Convert camelCase to snake_case for API response
        const snakeKey = key.replace(/[A-Z]/g, c => '_' + c.toLowerCase())
        if (merged[snakeKey] === null || merged[snakeKey] === undefined) {
          merged[snakeKey] = value
        }
      }
    }
    return merged
  })
}

// API endpoint that fetches presets from database with filtering
export async function GET(request: NextRequest) {
  const rl = await checkRateLimit(request);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.reset - Date.now()) / 1000)) } }
    );
  }

  const parsed = presetsGetSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid parameters', details: parsed.error.flatten() }, { status: 400 });
  }

  const { limit, offset, creature, source, search } = parsed.data;

  try {
    const presets = await list_presets(limit, offset, creature, source, undefined, search)
    const filtered = presets.filter(preset => !PRESET_BLACKLIST.has(preset.id))

    // Merge with local presets to fill any null fields
    const merged = mergeWithLocal(filtered.map(formatPreset))

    return NextResponse.json({
      data: merged,
      count: merged.length
    })
  } catch (error) {
    return NextResponse.json({ error: safeError('GET presets', error) }, { status: 500 })
  }
}

// Format preset to match Supabase/expected shape (all fields)
function formatPreset(preset: Preset): any {
  return {
    id: preset.id,
    name: preset.name,
    creature: preset.creature,
    vibe: preset.vibe,
    emoji: preset.emoji,
    avatar: preset.avatar,
    core_truths_helpful: preset.core_truths_helpful,
    core_truths_opinions: preset.core_truths_opinions,
    core_truths_resourceful: preset.core_truths_resourceful,
    core_truths_trustworthy: preset.core_truths_trustworthy,
    core_truths_respectful: preset.core_truths_respectful,
    boundaries_private: preset.boundaries_private,
    boundaries_ask_before_acting: preset.boundaries_ask_before_acting,
    boundaries_no_half_baked: preset.boundaries_no_half_baked,
    boundaries_not_voice_proxy: preset.boundaries_not_voice_proxy,
    vibe_style: preset.vibe_style,
    humor: preset.humor,
    formality: preset.formality,
    emoji_usage: preset.emoji_usage,
    verbosity: preset.verbosity,
    consciousness: preset.consciousness,
    questioning: preset.questioning,
    openness: preset.openness,
    conscientiousness: preset.conscientiousness,
    extraversion: preset.extraversion,
    agreeableness: preset.agreeableness,
    neuroticism: preset.neuroticism,
    description: preset.description,
    tags: preset.tags,
    source: preset.source,
    communication_mode: preset.communication_mode,
    knowledge_domains: preset.knowledge_domains,
    signature_phrases: preset.signature_phrases,
    emotional_range: preset.emotional_range,
    speech_patterns: preset.speech_patterns,
    role: preset.role,
    role_description: preset.role_description,
    mandate_rules: preset.mandate_rules,
    voice_private: preset.voice_private,
    voice_public: preset.voice_public,
    autonomy_auto: preset.autonomy_auto,
    autonomy_require_approval: preset.autonomy_require_approval,
    worldview: preset.worldview,
    expertise: preset.expertise,
    memory_policy: preset.memory_policy,
    pet_peeves: preset.pet_peeves,
    voice_rules: preset.voice_rules,
    active_projects: preset.active_projects,
    custom_core_truths: preset.custom_core_truths,
    custom_boundaries: preset.custom_boundaries,
  }
}
