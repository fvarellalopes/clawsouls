import { NextRequest, NextResponse } from 'next/server'
import { list_presets } from '../../../lib/db'
import { Preset } from '../../../lib/db'

// Blacklist of preset IDs to filter out
const PRESET_BLACKLIST = new Set(['adolf-hitler'])

// API endpoint that fetches presets from database with filtering
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  // Parse query parameters
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')
  const creature = searchParams.get('creature') || undefined
  const source = searchParams.get('source') || undefined
  const search = searchParams.get('search') || undefined
  
  try {
    // Fetch presets from database (Supabase or SQLite)
    const presets = await list_presets(limit, offset, creature, source, undefined, search)
    
    // Filter out blacklisted presets
    const filtered = presets.filter(preset => !PRESET_BLACKLIST.has(preset.id))
    
    // Transform to match the expected format
    const response = {
      data: filtered.map(formatPreset),
      count: filtered.length
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching presets:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Format preset to match Supabase/expected shape
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
    source: preset.source
  }
}