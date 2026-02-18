import { NextRequest, NextResponse } from "next/server";
import { generateSoulMD } from "@/lib/soulGenerator";

export async function POST(request: NextRequest) {
  try {
    const soul = await request.json();
    const markdown = generateSoulMD(soul);
    return NextResponse.json({ success: true, markdown });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to generate SOUL.md" },
      { status: 500 }
    );
  }
}
