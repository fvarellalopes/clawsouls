import { NextRequest, NextResponse } from "next/server";

// Use the same model as the app's AI provider
const MODEL = "mimo-v2.5-pro";
const BASE_URL = "https://opengateway.gitlawb.com/v1";

export async function POST(req: NextRequest) {
  try {
    const { preset, karmaScore, issues } = await req.json();

    const issueDescriptions: Record<string, string> = {
      personalityFlat: "Big Five personality traits are too flat/boring — no differentiation between traits",
      personalityExtreme: "Big Five traits are too extreme — polarized to 0 or 100",
      vibeTooShort: "Vibe description is too short or missing",
    };

    const issuesText = issues
      .map((i: string) => issueDescriptions[i] || i)
      .join("\n- ");

    const prompt = `You are a character design expert analyzing an AI personality preset called "${preset.name}" (${preset.creature}).

KARMA SCORE: ${karmaScore}/100 (needs improvement)
ISSUES FOUND:
- ${issuesText}

PRESET DATA:
- Vibe: "${preset.vibe?.slice(0, 300) || "(empty)"}"
- Description: "${preset.description?.slice(0, 200) || "(empty)"}"
- Tags: ${(preset.tags || []).join(", ") || "(none)"}
- Big Five: O=${preset.openness ?? 50} C=${preset.conscientiousness ?? 50} E=${preset.extraversion ?? 50} A=${preset.agreeableness ?? 50} N=${preset.neuroticism ?? 30}
- Humor: ${preset.humor ?? 50}/100, Formality: ${preset.formality ?? 50}/100
- Signature phrases: ${(preset.signaturePhrases || []).join(" | ") || "(none)"}
- Knowledge domains: ${(preset.knowledgeDomains || []).join(", ") || "(none)"}

Write a concise critique (3-5 sentences, max 100 words) that:
1. Acknowledges what's good about the preset
2. Points out the specific problems found
3. Gives actionable suggestions to improve the karma score
4. Uses a slightly snarky but helpful tone (like a seasoned game designer reviewing a draft)

Reply ONLY with the critique text, no markdown formatting.`;

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer anything`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Critique API error:", text);
      return NextResponse.json({ critique: "Could not generate critique. The AI oracle is resting." });
    }

    const data = await response.json();
    const critique = data.choices?.[0]?.message?.content || "No critique generated.";

    return NextResponse.json({ critique });
  } catch (error) {
    console.error("Critique error:", error);
    return NextResponse.json({ critique: "Something went wrong. Even the critique engine needs a break sometimes." });
  }
}
