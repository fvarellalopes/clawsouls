import { NextRequest, NextResponse } from 'next/server'
import { list_presets } from '@/lib/db'

// Blacklist of preset IDs to filter out (historical figures with harmful associations)
const PRESET_BLACKLIST = new Set(['adolf-hitler'])

// Dynamic import for fallback — loads all 513 presets from the local TS file
let localPresetsCache: any[] | null = null
async function getLocalPresets() {
  if (!localPresetsCache) {
    const mod = await import('@/data/presets')
    localPresetsCache = mod.presets
  }
  return localPresetsCache
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = parseInt(searchParams.get('limit') || '1000')
  const offset = parseInt(searchParams.get('offset') || '0')
  const creature = searchParams.get('creature') || undefined
  const source = searchParams.get('source') || undefined
  const search = searchParams.get('search') || undefined

  try {
    // Try Supabase / SQLite first
    let presets = await list_presets(limit, offset, creature, source, undefined, search)

    // If remote returned fewer than expected, supplement with local presets
    const localPresets = await getLocalPresets()
    const remoteIds = new Set(presets.map((p: any) => p.id))

    for (const local of localPresets) {
      if (!remoteIds.has(local.id) && !PRESET_BLACKLIST.has(local.id)) {
        // Map SoulPreset → DB Preset format (flat columns)
        presets.push({
          id: local.id,
          name: local.name,
          creature: local.creature,
          vibe: local.vibe || null,
          emoji: local.emoji || null,
          avatar: local.avatar || null,
          core_truths_helpful: local.coreTruths?.helpful ?? true,
          core_truths_opinions: local.coreTruths?.opinions ?? true,
          core_truths_resourceful: local.coreTruths?.resourceful ?? true,
          core_truths_trustworthy: local.coreTruths?.trustworthy ?? true,
          core_truths_respectful: local.coreTruths?.respectful ?? true,
          boundaries_private: local.boundaries?.private ?? false,
          boundaries_ask_before_acting: local.boundaries?.askBeforeActing ?? false,
          boundaries_no_half_baked: local.boundaries?.noHalfBaked ?? false,
          boundaries_not_voice_proxy: local.boundaries?.notVoiceProxy ?? true,
          vibe_style: local.vibeStyle || 'expressive',
          humor: local.humor ?? 50,
          formality: local.formality ?? 50,
          emoji_usage: local.emojiUsage ?? 10,
          verbosity: local.verbosity ?? 50,
          consciousness: local.consciousness ?? 50,
          questioning: local.questioning ?? 30,
          openness: local.openness ?? 70,
          conscientiousness: local.conscientiousness ?? 50,
          extraversion: local.extraversion ?? 50,
          agreeableness: local.agreeableness ?? 50,
          neuroticism: local.neuroticism ?? 30,
          description: local.description || null,
          tags: local.tags || [],
          source: local.source || 'original',
        })
      }
    }

    // Apply search filter to supplemented presets
    if (search) {
      const q = search.toLowerCase()
      presets = presets.filter((p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.vibe?.toLowerCase().includes(q) ||
        p.tags?.some((t: string) => t.toLowerCase().includes(q))
      )
    }

    // Filter out blacklisted presets
    const filtered = presets.filter((preset: any) => !PRESET_BLACKLIST.has(preset.id))

    return NextResponse.json({ data: filtered })
  } catch (err) {
    console.error('Error fetching filtered presets:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
