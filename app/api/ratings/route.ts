import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// GET /api/ratings?presetId=xxx — get aggregate for one preset
// GET /api/ratings — get aggregates for ALL presets
export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const presetId = request.nextUrl.searchParams.get('presetId');

  if (presetId) {
    // Single preset aggregate
    const { data, error } = await supabase
      .from('preset_ratings')
      .select('liked, stars')
      .eq('preset_id', presetId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = (data || []) as { liked: boolean | null; stars: number }[];
    const likes = rows.filter(r => r.liked === true).length;
    const dislikes = rows.filter(r => r.liked === false).length;
    const starRatings = rows.filter(r => r.stars > 0);
    const avgStars = starRatings.length > 0
      ? starRatings.reduce((sum, r) => sum + r.stars, 0) / starRatings.length
      : 0;

    return NextResponse.json({
      presetId,
      likes,
      dislikes,
      avgStars: Math.round(avgStars * 10) / 10,
      totalRatings: rows.length,
    });
  }

  // All presets aggregate
  const { data, error } = await supabase
    .from('preset_ratings')
    .select('preset_id, liked, stars');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data || []) as { preset_id: string; liked: boolean | null; stars: number }[];

  // Group by preset_id
  const aggregates: Record<string, { likes: number; dislikes: number; avgStars: number; totalRatings: number }> = {};

  for (const row of rows) {
    if (!aggregates[row.preset_id]) {
      aggregates[row.preset_id] = { likes: 0, dislikes: 0, avgStars: 0, totalRatings: 0 };
    }
    const agg = aggregates[row.preset_id];
    if (row.liked === true) agg.likes++;
    if (row.liked === false) agg.dislikes++;
    agg.totalRatings++;
  }

  // Calculate avg stars per preset
  const starsByPreset: Record<string, number[]> = {};
  for (const row of rows.filter(r => r.stars > 0)) {
    if (!starsByPreset[row.preset_id]) starsByPreset[row.preset_id] = [];
    starsByPreset[row.preset_id].push(row.stars);
  }
  for (const [pid, stars] of Object.entries(starsByPreset)) {
    if (aggregates[pid]) {
      aggregates[pid].avgStars = Math.round((stars.reduce((a, b) => a + b, 0) / stars.length) * 10) / 10;
    }
  }

  return NextResponse.json({ data: aggregates });
}

// POST /api/ratings — submit or update a rating
export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const body = await request.json();
  const { presetId, anonymousId, liked, stars } = body;

  if (!presetId || !anonymousId) {
    return NextResponse.json({ error: 'presetId and anonymousId required' }, { status: 400 });
  }

  // Upsert: insert or update on conflict (preset_id, anonymous_id)
  const { data, error } = await (supabase as any)
    .from('preset_ratings')
    .upsert(
      {
        preset_id: presetId,
        anonymous_id: anonymousId,
        liked: liked ?? null,
        stars: stars ?? 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'preset_id,anonymous_id' }
    )
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
