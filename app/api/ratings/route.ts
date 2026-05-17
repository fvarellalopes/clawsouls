import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// --- Rate limiter (in-memory, per IP) ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 min
const RATE_LIMIT_MAX = 30;       // 30 req/min per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// --- Input validation ---
function sanitizePresetId(id: unknown): string | null {
  if (typeof id !== 'string') return null;
  const trimmed = id.trim();
  if (trimmed.length === 0 || trimmed.length > 100) return null;
  // Only allow alphanumeric, hyphens, underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) return null;
  return trimmed;
}

function sanitizeAnonId(id: unknown): string | null {
  if (typeof id !== 'string') return null;
  const trimmed = id.trim();
  if (trimmed.length < 5 || trimmed.length > 50) return null;
  // Only allow alphanumeric, underscores
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return null;
  return trimmed;
}

function sanitizeStars(stars: unknown): number {
  const n = Number(stars);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(5, Math.round(n)));
}

function sanitizeLiked(liked: unknown): boolean | null {
  if (liked === true || liked === false) return liked;
  return null;
}

// --- Helpers ---
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function safeError(context: string, err: unknown): string {
  // Never expose Supabase internals to the client
  console.error(`[ratings] ${context}:`, err);
  return 'Internal server error';
}

// GET /api/ratings?presetId=xxx — get aggregate for one preset
// GET /api/ratings — get aggregates for ALL presets
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  const rawPresetId = request.nextUrl.searchParams.get('presetId');
  const presetId = rawPresetId ? sanitizePresetId(rawPresetId) : null;

  if (rawPresetId && !presetId) {
    return NextResponse.json({ error: 'Invalid presetId' }, { status: 400 });
  }

  try {
    if (presetId) {
      const { data, error } = await supabase
        .from('preset_ratings')
        .select('liked, stars')
        .eq('preset_id', presetId);

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
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  try {
    // Limit body size
    const contentLength = Number(request.headers.get('content-length') || '0');
    if (contentLength > 1024) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const body = await request.json();

    const presetId = sanitizePresetId(body?.presetId);
    const anonymousId = sanitizeAnonId(body?.anonymousId);
    const liked = sanitizeLiked(body?.liked);
    const stars = sanitizeStars(body?.stars);

    if (!presetId) {
      return NextResponse.json({ error: 'Invalid presetId' }, { status: 400 });
    }
    if (!anonymousId) {
      return NextResponse.json({ error: 'Invalid anonymousId' }, { status: 400 });
    }

    const { data, error } = await (supabase as any)
      .from('preset_ratings')
      .upsert(
        {
          preset_id: presetId,
          anonymous_id: anonymousId,
          liked,
          stars,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'preset_id,anonymous_id' }
      )
      .select('id, preset_id, liked, stars');

    if (error) {
      return NextResponse.json({ error: safeError('POST upsert', error) }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: safeError('POST catch', err) }, { status: 500 });
  }
}
