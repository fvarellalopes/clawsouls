import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Blacklist of preset IDs to filter out
const PRESET_BLACKLIST = new Set(['adolf-hitler'])

export async function GET(request: NextRequest) {
  try {
    const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!url || !key) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }
    
    const supabase = createClient(url, key)
    
    const { data, error } = await supabase.from('presets').select('*')
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Filter out blacklisted presets
    const filtered = data ? data.filter((p: any) => !PRESET_BLACKLIST.has(p.id)) : []
    
    return NextResponse.json({ data: filtered })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}