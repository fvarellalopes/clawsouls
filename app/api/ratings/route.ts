import { NextRequest, NextResponse } from 'next/server';
import { getClientSupabase } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';
import { ratingsPostSchema, ratingsGetSchema, safeError } from '@/lib/schemas';

// GET /api/ratings?presetId=xxx — get aggregate for one preset
// GET /api/ratings — get aggregates for ALL presets
export async function GET(request: NextRequest) {
  const rl = await checkRateLimit(request);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.reset - Date.now()) / 1000)) } }
    );
  }

  const supabase = getClientSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  const parsed = ratingsGetSchema.safeParse({
    presetId: request.nextUrl.searchParams.get('presetId') || undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid parameters', details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    if (parsed.data.presetId) {
      const { data, error } = await supabase
        .from('preset_ratings')
        .select('liked, stars')
        .eq('preset_id', parsed.data.presetId);

      if (error) {
        return NextResponse.json({ error: safeError('GET single', error) }, { status: 500 });
      }

      const rows = (data || []) as { liked: boolean | null; stars: number }[];
      const likes = rows.filter(r => r.liked === true).length;
      const dislikes = rows.filter(r => r.liked === false).length;
      const starRatings = rows.filter(r => r.stars > 0);
      const avgStars = starRatings.length > 0
        ? starRatings.reduce((sum, r) => sum + r.stars, 0) / starRatings.length
        : 0;

      return NextResponse.json({
        presetId: parsed.data.presetId,
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
      return NextResponse.json({ error: safeError('GET all', error) }, { status: 500 });
    }

    const rows = (data || []) as { preset_id: string; liked: boolean | null; stars: number }[];

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
  } catch (err) {
    return NextResponse.json({ error: safeError('GET catch', err) }, { status: 500 });
  }
}

// POST /api/ratings — submit or update a rating
export async function POST(request: NextRequest) {
  const rl = await checkRateLimit(request, 20, 60); // 20/min for writes
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.reset - Date.now()) / 1000)) } }
    );
  }

  const supabase = getClientSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  try {
    const contentLength = Number(request.headers.get('content-length') || '0');
    if (contentLength > 2048) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const body = await request.json();
    const parsed = ratingsPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const { presetId, anonymousId, liked, stars } = parsed.data;

    const { error } = await (supabase as any)
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
      );

    if (error) {
      return NextResponse.json({ error: safeError('POST upsert', error) }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: safeError('POST catch', err) }, { status: 500 });
  }
}
