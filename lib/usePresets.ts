import { useState, useEffect, useCallback, useMemo } from 'react'
import { SoulPreset, PresetCategory } from '@/store/soulStore'
import { 
  allPresets, 
  featuredPresets,
  getPresetsByCategory,
  searchPresets as searchAllPresets,
  getPresetById as findPresetById,
  getFeaturedPresets,
  presetMetadata,
} from '@/data/presets'

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
    empathy: data.empathy ?? 50,
    creativity: data.creativity ?? 50,
    patience: data.patience ?? 50,
  }
}

interface UsePresetsOptions {
  category?: PresetCategory;
  featured?: boolean;
  limit?: number;
}

export function usePresets(options: UsePresetsOptions = {}) {
  const { category, featured, limit } = options
  const [presets, setPresets] = useState<SoulPreset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    async function fetchPresets() {
      try {
        setLoading(true)
        
        // Try to fetch from API first
        const res = await fetch(API_BASE)
        if (res.ok) {
          const json = await res.json()
          const mapped = (json.data || []).map(mapSupabaseToSoulPreset)
          setPresets(mapped)
          setUsingFallback(false)
          setError(null)
          setLoading(false)
          return
        }
      } catch (err: any) {
        console.log('API fetch failed, using local presets')
      }

      // Fallback to local presets
      try {
        setUsingFallback(true)
        let localPresets: SoulPreset[]
        
        if (featured) {
          localPresets = getFeaturedPresets(limit)
        } else if (category) {
          localPresets = getPresetsByCategory(category)
        } else {
          localPresets = allPresets
        }
        
        if (limit && !featured) {
          localPresets = localPresets.slice(0, limit)
        }
        
        setPresets(localPresets)
        setError(null)
      } catch (e) {
        console.error('Fallback also failed:', e)
        setError('Failed to load presets')
      } finally {
        setLoading(false)
      }
    }

    fetchPresets()
  }, [category, featured, limit])

  return { 
    presets, 
    loading, 
    error,
    usingFallback,
    metadata: presetMetadata,
  }
}

export function usePresetById(id: string) {
  const [preset, setPreset] = useState<SoulPreset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    async function fetchPreset() {
      if (!id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Try API first
        const res = await fetch(`${API_BASE}/${id}`)
        if (res.ok) {
          const data = await res.json()
          const mapped = mapSupabaseToSoulPreset(data)
          setPreset(mapped)
          setUsingFallback(false)
          setError(null)
          setLoading(false)
          return
        }
      } catch (err) {
        console.log('API fetch failed, using local preset')
      }

      // Fallback to local
      try {
        setUsingFallback(true)
        const local = findPresetById(id)
        if (local) {
          setPreset(local)
          setError(null)
        } else {
          setError('Preset not found')
        }
      } catch (e) {
        console.error('Fallback failed:', e)
        setError('Failed to load preset')
      } finally {
        setLoading(false)
      }
    }

    fetchPreset()
  }, [id])

  return { preset, loading, error, usingFallback }
}

// Hook for searching presets
export function usePresetSearch(query: string) {
  const [results, setResults] = useState<SoulPreset[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    // Debounce search
    const timeout = setTimeout(() => {
      const searchResults = searchAllPresets(query)
      setResults(searchResults)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  return { results, loading }
}

// Hook for categories
export function usePresetCategories() {
  return useMemo(() => presetMetadata.categories, [])
}

// Hook for featured presets (optimized for homepage)
export function useFeaturedPresets(limit = 6) {
  return usePresets({ featured: true, limit })
}

// Hook for presets by category with caching
export function usePresetsByCategory(category: PresetCategory) {
  return usePresets({ category })
}

// Export utilities
export { 
  allPresets,
  featuredPresets,
  getPresetsByCategory,
  searchAllPresets as searchPresets,
  findPresetById as getPresetById,
  presetMetadata,
}
