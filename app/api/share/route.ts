import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { generateShareId } from "@/lib/compress";

/**
 * GET /api/share?id=xxx — fetch a shared soul by its short ID
 */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing 'id' query param" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Share storage not configured (Supabase env vars missing)" },
      { status: 503 }
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("shared_souls")
    .select("soul")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Share not found" }, { status: 404 });
  }

  return NextResponse.json({ soul: data.soul });
}

/**
 * POST /api/share — store a soul and return a short ID
 * Body: { soul: Record<string, any> }
 */
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Share storage not configured (Supabase env vars missing)" },
      { status: 503 }
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
  }

  let body: { soul?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.soul || typeof body.soul !== "object") {
    return NextResponse.json({ error: "Missing 'soul' field in body" }, { status: 400 });
  }

  const id = generateShareId();

  const { error, status } = await supabase
    .from("shared_souls")
    .insert({ id, soul: body.soul, created_at: new Date().toISOString() });

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: "Failed to save share" }, { status: 500 });
  }

  return NextResponse.json({ id, url: `/share/${id}` }, { status: 201 });
}
