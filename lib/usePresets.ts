import { useState, useEffect, useMemo } from 'react'
import { SoulPreset } from '@/store/soulStore'
import { useLocale } from 'next-intl'

const API_BASE = '/api/filtered-presets' // Use filtered endpoint to block harmful content

// Blacklist of preset IDs to filter out (historical figures with harmful associations)
const PRESET_BLACKLIST = new Set(['adolf-hitler'])

// Converter formato Supabase (campos planos) para SoulPreset (objetos)
// Cache local presets for fallback (loaded once lazily)
let _localPresetsMap: Record<string, SoulPreset> | null = null;
async function getLocalPresetsMap(): Promise<Record<string, SoulPreset>> {
  if (_localPresetsMap) return _localPresetsMap;
  const { presets: localPresets } = await import('@/data/presets');
  _localPresetsMap = {};
  for (const p of localPresets) {
    _localPresetsMap[p.id] = p;
  }
  return _localPresetsMap;
}

function mapSupabaseToSoulPreset(data: any, localFallback?: SoulPreset): SoulPreset {
  // Parse tags if it's a string
  let tags = data.tags || [];
  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags);
    } catch {
      tags = [];
    }
  }

  // Local presets have the real personality values; API/SQLite has defaults.
  // When localFallback exists, use its personality fields as primary source.
  const hasLocal = !!localFallback;

  return {
    id: data.id,
    name: data.name,
    creature: data.creature,
    vibe: data.vibe,
    emoji: data.emoji,
    avatar: data.avatar || localFallback?.avatar,
    coreTruths: {
      helpful: data.core_truths_helpful ?? localFallback?.coreTruths?.helpful ?? true,
      opinions: data.core_truths_opinions ?? localFallback?.coreTruths?.opinions ?? true,
      resourceful: data.core_truths_resourceful ?? localFallback?.coreTruths?.resourceful ?? true,
      trustworthy: data.core_truths_trustworthy ?? localFallback?.coreTruths?.trustworthy ?? true,
      respectful: data.core_truths_respectful ?? localFallback?.coreTruths?.respectful ?? true,
    },
    boundaries: {
      private: data.boundaries_private ?? localFallback?.boundaries?.private ?? true,
      askBeforeActing: data.boundaries_ask_before_acting ?? localFallback?.boundaries?.askBeforeActing ?? true,
      noHalfBaked: data.boundaries_no_half_baked ?? localFallback?.boundaries?.noHalfBaked ?? true,
      notVoiceProxy: data.boundaries_not_voice_proxy ?? localFallback?.boundaries?.notVoiceProxy ?? true,
    },
    vibeStyle: data.vibe_style ?? localFallback?.vibeStyle ?? 'balanced',
    description: data.description ?? localFallback?.description ?? '',
    tags: tags,
    source: data.source ?? localFallback?.source ?? 'character',
    customCoreTruths: localFallback?.customCoreTruths ?? [],
    customBoundaries: localFallback?.customBoundaries ?? [],
    // Personality fields: prefer local data (has real values); API/SQLite has only defaults
    humor: hasLocal ? (localFallback!.humor ?? 50) : (data.humor ?? 50),
    formality: hasLocal ? (localFallback!.formality ?? 50) : (data.formality ?? 50),
    emojiUsage: hasLocal ? (localFallback!.emojiUsage ?? 10) : (data.emoji_usage ?? 10),
    verbosity: hasLocal ? (localFallback!.verbosity ?? 50) : (data.verbosity ?? 50),
    consciousness: hasLocal ? (localFallback!.consciousness ?? 50) : (data.consciousness ?? 50),
    questioning: hasLocal ? (localFallback!.questioning ?? 30) : (data.questioning ?? 30),
    openness: hasLocal ? (localFallback!.openness ?? 70) : (data.openness ?? 70),
    conscientiousness: hasLocal ? (localFallback!.conscientiousness ?? 50) : (data.conscientiousness ?? 50),
    extraversion: hasLocal ? (localFallback!.extraversion ?? 50) : (data.extraversion ?? 50),
    agreeableness: hasLocal ? (localFallback!.agreeableness ?? 50) : (data.agreeableness ?? 50),
    neuroticism: hasLocal ? (localFallback!.neuroticism ?? 30) : (data.neuroticism ?? 30),
    communicationMode: hasLocal ? (localFallback!.communicationMode ?? 'direct') : (data.communication_mode ?? 'direct'),
    knowledgeDomains: hasLocal ? (localFallback!.knowledgeDomains ?? []) : (data.knowledge_domains ?? []),
    signaturePhrases: hasLocal ? (localFallback!.signaturePhrases ?? []) : (data.signature_phrases ?? []),
    emotionalRange: hasLocal ? (localFallback!.emotionalRange ?? 50) : (data.emotional_range ?? 50),
    speechPatterns: hasLocal ? (localFallback!.speechPatterns ?? {
      alliteration: false,
      rhymeTendency: 10,
      metaphorFrequency: 30,
      technicalJargon: 40,
      slangUsage: 20,
    }) : {
      alliteration: data.speech_alliteration ?? false,
      rhymeTendency: data.speech_rhyme_tendency ?? 10,
      metaphorFrequency: data.speech_metaphor_frequency ?? 30,
      technicalJargon: data.speech_technical_jargon ?? 40,
      slangUsage: data.speech_slang_usage ?? 20,
    },
    // Operator config (Hermes-style)
    role: hasLocal ? (localFallback!.role ?? 'Autonomous operator and thought partner') : (data.role ?? 'Autonomous operator and thought partner'),
    roleDescription: hasLocal ? (localFallback!.roleDescription ?? '') : (data.role_description ?? ''),
    mandateRules: hasLocal ? (localFallback!.mandateRules ?? []) : ([]),
    voicePrivate: hasLocal ? (localFallback!.voicePrivate ?? '') : (data.voice_private ?? ''),
    voicePublic: hasLocal ? (localFallback!.voicePublic ?? '') : (data.voice_public ?? ''),
    autonomyAuto: hasLocal ? (localFallback!.autonomyAuto ?? '') : (data.autonomy_auto ?? ''),
    autonomyRequireApproval: hasLocal ? (localFallback!.autonomyRequireApproval ?? '') : (data.autonomy_require_approval ?? ''),
    activeProjects: hasLocal ? (localFallback!.activeProjects ?? '') : (data.active_projects ?? ''),
    // SOUL.md best practices fields
    worldview: hasLocal ? (localFallback!.worldview ?? '') : (data.worldview ?? ''),
    expertise: hasLocal ? (localFallback!.expertise ?? { primary: '', fluent: '', defers: '' }) : (data.expertise ?? { primary: '', fluent: '', defers: '' }),
    memoryPolicy: hasLocal ? (localFallback!.memoryPolicy ?? '') : (data.memory_policy ?? ''),
    petPeeves: hasLocal ? (localFallback!.petPeeves ?? []) : (data.pet_peeves ?? []),
    voiceRules: hasLocal ? (localFallback!.voiceRules ?? '') : (data.voice_rules ?? ''),
  }
}

export function usePresets() {
  const [rawPresets, setRawPresets] = useState<SoulPreset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const locale = useLocale()

  useEffect(() => {
    async function fetchPresets() {
      try {
        setLoading(true)
        // Pass locale to API for server-side translation
        const url = `${API_BASE}?locale=${locale}&limit=1000`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch presets')
        const json = await res.json()
        // Load local presets as fallback for missing personality fields
        const localMap = await getLocalPresetsMap()
        const mapped = (json.data || []).map((d: any) => mapSupabaseToSoulPreset(d, localMap[d.id]))
        setRawPresets(mapped)
        setError(null)
      } catch (err: any) {
        console.error('Erro ao carregar presets:', err)
        setError(err.message)
        // Fallback: importar presets locais estáticos
        try {
          const { presets: localPresets } = await import('@/data/presets')
          setRawPresets(localPresets)
        } catch (e) {
          console.error('Fallback também falhou:', e)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPresets()
  }, [locale]) // Re-fetch when locale changes

  // Filter out blacklisted presets
  const presets = useMemo(() => {
    return rawPresets.filter(preset => !PRESET_BLACKLIST.has(preset.id))
  }, [rawPresets])

  return { presets, loading, error }
}

export function usePresetById(id: string) {
  const [preset, setPreset] = useState<SoulPreset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const locale = useLocale()

  useEffect(() => {
    async function fetchPreset() {
      try {
        setLoading(true)
        // Fetch all presets with locale and find the one we need
        const url = `${API_BASE}?locale=${locale}&limit=1000`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch presets')
        const json = await res.json()
        const localMap = await getLocalPresetsMap()
        const found = (json.data || []).find((d: any) => d.id === id)
        if (found) {
          setPreset(mapSupabaseToSoulPreset(found, localMap[found.id]))
        } else {
          // Try local fallback
          const localPreset = localMap[id]
          if (localPreset) {
            setPreset(localPreset)
          } else {
            setError('Preset not found')
          }
        }
        setError(null)
      } catch (err: any) {
        console.error('Erro ao carregar preset:', err)
        setError(err.message)
        // Fallback: try local presets
        try {
          const { presets: localPresets } = await import('@/data/presets')
          const found = localPresets.find(p => p.id === id)
          if (found) setPreset(found)
        } catch (e) {
          console.error('Fallback também falhou:', e)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPreset()
  }, [id, locale])

  return { preset, loading, error }
}
