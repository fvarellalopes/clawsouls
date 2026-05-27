import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runLocalScan, runLLMAnalysis } from "@/lib/soulscan";

const soulscanSchema = z.object({
  content: z.string().min(10).max(50000),
  deep: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > 60000) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = await request.json();
    const parsed = soulscanSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { content, deep } = parsed.data;

    // Step 1: Fast local scan (regex + section check)
    const result = runLocalScan(content);

    // Step 2: Optional LLM deep analysis
    if (deep) {
      result.quality!.llmAnalysis = await runLLMAnalysis(content, result);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("SoulGate error:", error);
    return NextResponse.json(
      { error: "Scan failed." },
      { status: 500 }
    );
  }
}
