import { NextRequest, NextResponse } from 'next/server'
import { list_presets } from '@/lib/db'
import { getServerSupabase } from '@/lib/supabase'
import { checkRateLimit } from '@/lib/rate-limit'
import { filteredPresetsGetSchema, safeError } from '@/lib/schemas'

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

// Fetch translations for a set of preset IDs and locale
async function fetchTranslations(presetIds: string[], locale: string): Promise<Map<string, any>> {
  const translationMap = new Map<string, any>()

  if (!locale || locale === 'en') return translationMap

  const supabase = getServerSupabase()
  if (!supabase) return translationMap

  // Fetch in batches of 1000 (Supabase limit)
  const batchSize = 1000
  for (let i = 0; i < presetIds.length; i += batchSize) {
    const batch = presetIds.slice(i, i + batchSize)
    const { data, error } = await supabase
      .from('preset_translations')
      .select('preset_id, name, description, creature, vibe, tags')
      .eq('locale', locale)
      .in('preset_id', batch)

    if (error) {
      console.error('Error fetching translations:', error)
      continue
    }

    for (const row of data || []) {
      translationMap.set(row.preset_id, row)
    }
  }

  return translationMap
}

// Apply translations to a preset
function applyTranslation(preset: any, translation: any): any {
  if (!translation) return preset

  return {
    ...preset,
    name: translation.name || preset.name,
    description: translation.description || preset.description,
    creature: translation.creature || preset.creature,
    vibe: translation.vibe || preset.vibe,
    tags: preset.tags, // Don't override tags from translations — categories are managed separately
    // Keep original values for reference
    _original: {
      name: preset.name,
      description: preset.description,
      creature: preset.creature,
      vibe: preset.vibe,
    }
  }
}

export async function GET(request: NextRequest) {
  const rl = await checkRateLimit(request);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.reset - Date.now()) / 1000)) } }
    );
  }

  const parsed = filteredPresetsGetSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid parameters', details: parsed.error.flatten() }, { status: 400 });
  }

  const { limit, offset, creature, source, search, locale } = parsed.data;

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
          worldview: local.worldview || null,
          expertise: local.expertise || null,
          memory_policy: local.memoryPolicy || null,
          pet_peeves: local.petPeeves || null,
          voice_rules: local.voiceRules || null,
          communication_mode: local.communicationMode || null,
          knowledge_domains: local.knowledgeDomains || null,
          signature_phrases: local.signaturePhrases || null,
          emotional_range: local.emotionalRange ?? null,
          speech_patterns: local.speechPatterns || null,
          role: local.role || null,
          role_description: local.roleDescription || null,
          mandate_rules: local.mandateRules || null,
          voice_private: local.voicePrivate || null,
          voice_public: local.voicePublic || null,
          autonomy_auto: local.autonomyAuto || null,
          autonomy_require_approval: local.autonomyRequireApproval || null,
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

    // Apply translations if locale is specified
    if (locale && locale !== 'en') {
      const presetIds = filtered.map((p: any) => p.id)
      const translations = await fetchTranslations(presetIds, locale)

      if (translations.size > 0) {
        const translated = filtered.map((preset: any) =>
          applyTranslation(preset, translations.get(preset.id))
        )
        return NextResponse.json({ data: translated, locale, translated: translations.size })
      }
    }

    return NextResponse.json({ data: filtered })
  } catch (err) {
    return NextResponse.json({ error: safeError('GET filtered-presets', err) }, { status: 500 })
  }
}
