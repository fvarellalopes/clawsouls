import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    if (!url || !key) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }
    const supabase = createClient(url, key)

    const { presets } = await import('@/data/presets')

    // Batch upsert — single call instead of 500+ individual calls
    const rows = presets.map((p: any) => ({
      id: p.id,
      name: p.name,
      creature: p.creature,
      vibe: p.vibe || null,
      emoji: p.emoji || null,
      avatar: p.avatar || null,
      core_truths_helpful: p.coreTruths?.helpful ?? true,
      core_truths_opinions: p.coreTruths?.opinions ?? true,
      core_truths_resourceful: p.coreTruths?.resourceful ?? true,
      core_truths_trustworthy: p.coreTruths?.trustworthy ?? true,
      core_truths_respectful: p.coreTruths?.respectful ?? true,
      boundaries_private: p.boundaries?.private ?? false,
      boundaries_ask_before_acting: p.boundaries?.askBeforeActing ?? false,
      boundaries_no_half_baked: p.boundaries?.noHalfBaked ?? false,
      boundaries_not_voice_proxy: p.boundaries?.notVoiceProxy ?? true,
      vibe_style: p.vibeStyle || 'expressive',
      humor: p.humor ?? 50,
      formality: p.formality ?? 50,
      emoji_usage: p.emojiUsage ?? 10,
      verbosity: p.verbosity ?? 50,
      consciousness: p.consciousness ?? 50,
      questioning: p.questioning ?? 30,
      openness: p.openness ?? 70,
      conscientiousness: p.conscientiousness ?? 50,
      extraversion: p.extraversion ?? 50,
      agreeableness: p.agreeableness ?? 50,
      neuroticism: p.neuroticism ?? 30,
      description: p.description || null,
      tags: p.tags || [],
      source: p.source || 'original',
      updated_at: new Date().toISOString(),
    }))

    const { data, error } = await supabase.from('presets').upsert(rows, {
      onConflict: 'id',
      ignoreDuplicates: false,
    })

    if (error) {
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }

    return NextResponse.json({ success: true, total: rows.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
