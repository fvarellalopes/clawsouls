import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Dynamic import of presets — Next.js handles the TS→JS transpilation
export async function GET() {
  try {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!url || !key) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const supabase = createClient(url, key)

    // Import presets from the local data file
    const { presets } = await import('@/data/presets')

    // Get current presets in Supabase to compare
    const { data: existing } = await supabase.from('presets').select('id')
    const existingIds = new Set((existing || []).map((r: any) => r.id))

    let inserted = 0
    let updated = 0
    let errors = 0

    for (const preset of presets) {
      // Map SoulPreset format → database row format
      const row = {
        id: preset.id,
        name: preset.name,
        creature: preset.creature,
        vibe: preset.vibe || null,
        emoji: preset.emoji || null,
        avatar: preset.avatar || null,
        core_truths_helpful: preset.coreTruths?.helpful ?? true,
        core_truths_opinions: preset.coreTruths?.opinions ?? true,
        core_truths_resourceful: preset.coreTruths?.resourceful ?? true,
        core_truths_trustworthy: preset.coreTruths?.trustworthy ?? true,
        core_truths_respectful: preset.coreTruths?.respectful ?? true,
        boundaries_private: preset.boundaries?.private ?? false,
        boundaries_ask_before_acting: preset.boundaries?.askBeforeActing ?? false,
        boundaries_no_half_baked: preset.boundaries?.noHalfBaked ?? false,
        boundaries_not_voice_proxy: preset.boundaries?.notVoiceProxy ?? true,
        vibe_style: preset.vibeStyle || 'expressive',
        humor: preset.humor ?? 50,
        formality: preset.formality ?? 50,
        emoji_usage: preset.emojiUsage ?? 10,
        verbosity: preset.verbosity ?? 50,
        consciousness: preset.consciousness ?? 50,
        questioning: preset.questioning ?? 30,
        openness: preset.openness ?? 70,
        conscientiousness: preset.conscientiousness ?? 50,
        extraversion: preset.extraversion ?? 50,
        agreeableness: preset.agreeableness ?? 50,
        neuroticism: preset.neuroticism ?? 30,
        description: preset.description || null,
        tags: preset.tags || [],
        source: preset.source || 'original',
        updated_at: new Date().toISOString(),
      }

      const isNew = !existingIds.has(preset.id)

      const { error } = await supabase.from('presets').upsert(row, {
        onConflict: 'id',
        ignoreDuplicates: false,
      })

      if (error) {
        console.error(`Error syncing ${preset.id}:`, error)
        errors++
      } else if (isNew) {
        inserted++
      } else {
        updated++
      }
    }

    return NextResponse.json({
      success: true,
      total: presets.length,
      inserted,
      updated,
      errors,
    })
  } catch (err: any) {
    console.error('Sync error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
