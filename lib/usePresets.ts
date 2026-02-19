import { useState, useEffect } from 'react'
import { SoulPreset } from '@/store/soulStore'

const API_BASE = process.env.NEXT_PUBLIC_PRESETS_API || '/api/presets'

// Converter formato Supabase (campos planos) para SoulPreset (objetos)
function mapSupabaseToSoulPreset(data: any): SoulPreset {
  // Parse tags if it's a string
  let tags = data.tags || [];
  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags);
    } catch {
      tags = [];
    }
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
    // Campos opcionais que podem não existir no Supabase ainda
    humor: data.humor ?? 50,
    formality: data.formality ?? 50,
    emojiUsage: data.emoji_usage ?? 10,
    verbosity: data.verbosity ?? 50,
    consciousness: data.consciousness ?? 50,
    questioning: data.questioning ?? 30,
  }
}

export function usePresets() {
  const [presets, setPresets] = useState<SoulPreset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPresets() {
      try {
        setLoading(true)
        const res = await fetch(API_BASE)
        if (!res.ok) throw new Error('Failed to fetch presets')
        const json = await res.json()
        const mapped = (json.data || []).map(mapSupabaseToSoulPreset)
        setPresets(mapped)
        setError(null)
      } catch (err: any) {
        console.error('Erro ao carregar presets:', err)
        setError(err.message)
        // Fallback: importar presets locais estáticos
        try {
          const { presets: localPresets } = await import('@/data/presets')
          setPresets(localPresets)
        } catch (e) {
          console.error('Fallback também falhou:', e)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPresets()
  }, [])

  return { presets, loading, error }
}

export function usePresetById(id: string) {
  const [preset, setPreset] = useState<SoulPreset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPreset() {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/${id}`)
        if (!res.ok) {
          if (res.status === 404) {
            setError('Preset não encontrado')
            return
          }
          throw new Error('Failed to fetch preset')
        }
        const data = await res.json()
        const mapped = mapSupabaseToSoulPreset(data)
        setPreset(mapped)
        setError(null)
      } catch (err: any) {
        console.error('Erro ao carregar preset:', err)
        setError(err.message)
        // Fallback: buscar da lista local
        try {
          const { presets: localPresets } = await import('@/data/presets')
          const local = localPresets.find(p => p.id === id)
          if (local) setPreset(local)
        } catch (e) {
          console.error('Fallback também falhou:', e)
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchPreset()
  }, [id])

  return { preset, loading, error }
}
