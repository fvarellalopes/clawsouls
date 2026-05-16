import { NextRequest, NextResponse } from 'next/server'
import { list_presets } from '@/lib/db'

// Blacklist of preset IDs to filter out (historical figures with harmful associations)
const PRESET_BLACKLIST = new Set(['adolf-hitler'])

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = parseInt(searchParams.get('limit') || '1000')
  const offset = parseInt(searchParams.get('offset') || '0')
  const creature = searchParams.get('creature') || undefined
  const source = searchParams.get('source') || undefined
  const search = searchParams.get('search') || undefined

  try {
    // Uses list_presets from lib/db which falls back to SQLite when Supabase is unavailable
    const presets = await list_presets(limit, offset, creature, source, undefined, search)

    // Filter out blacklisted presets
    const filtered = presets.filter(preset => !PRESET_BLACKLIST.has(preset.id))

    return NextResponse.json({ data: filtered })
  } catch (err) {
    console.error('Error fetching filtered presets:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
