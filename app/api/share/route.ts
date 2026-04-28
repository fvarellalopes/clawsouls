import { NextRequest, NextResponse } from "next/server";
import { generateShareId } from "@/lib/compress";

// In-memory store for shares (replace with DB in production)
// For now, use the existing Supabase/SQLite if available
const shareStore = new Map<string, { soul: Record<string, unknown>; createdAt: number }>();

// Clean up shares older than 7 days
setInterval(() => {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  for (const [key, value] of shareStore) {
    if (value.createdAt < cutoff) shareStore.delete(key);
  }
}, 60 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.soul || typeof body.soul !== "object") {
      return NextResponse.json({ error: "Missing 'soul' object" }, { status: 400 });
    }

    const id = generateShareId();
    shareStore.set(id, { soul: body.soul, createdAt: Date.now() });

    return NextResponse.json({ id, url: `/share/${id}` }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing 'id' param" }, { status: 400 });
  }

  const entry = shareStore.get(id);
  if (!entry) {
    return NextResponse.json({ error: "Share not found" }, { status: 404 });
  }

  return NextResponse.json({ soul: entry.soul });
}
