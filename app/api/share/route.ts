import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { generateShareId } from "@/lib/compress";
import { checkRateLimit } from "@/lib/rate-limit";
import { sharePostSchema, safeError } from "@/lib/schemas";

/**
 * GET /api/share?id=xxx — fetch a shared soul by its short ID
 */
export async function GET(request: NextRequest) {
  const rl = await checkRateLimit(request);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.reset - Date.now()) / 1000)) } }
    );
  }

  const id = request.nextUrl.searchParams.get("id");

  if (!id || id.length > 20 || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return NextResponse.json({ error: "Invalid 'id' parameter" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  try {
    const { data, error } = await supabase
      .from("shared_souls")
      .select("soul")
      .eq("id", id)
      .single();

    const record = data as { soul: Record<string, unknown> } | null;

    if (error || !record) {
      return NextResponse.json({ error: "Share not found" }, { status: 404 });
    }

    return NextResponse.json({ soul: record.soul });
  } catch (err) {
    return NextResponse.json({ error: safeError("GET share", err) }, { status: 500 });
  }
}

/**
 * POST /api/share — store a soul and return a short ID
 * Body: { soul: Record<string, any>, locale?: string }
 */
export async function POST(request: NextRequest) {
  // 10 shares/min per IP (writes are expensive)
  const rl = await checkRateLimit(request, 10, 60);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.reset - Date.now()) / 1000)) } }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  // Body size limit: 60KB (50KB for soul data + overhead)
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > 61_440) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  try {
    const body = await request.json();
    const parsed = sharePostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const id = generateShareId();

    const { error } = await supabase
      .from("shared_souls")
      .insert({ id, soul: parsed.data.soul, created_at: new Date().toISOString() } as never);

    if (error) {
      console.error("Share insert error:", error.message);
      return NextResponse.json({ error: "Failed to save share" }, { status: 500 });
    }

    return NextResponse.json({ id, url: `/share/${id}` }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: safeError("POST share", err) }, { status: 500 });
  }
}
