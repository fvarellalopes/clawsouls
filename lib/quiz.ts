import { SoulPreset } from "@/store/soulStore";

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    traits: Partial<Record<keyof SoulPreset, number>>;
  }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "communication",
    question: "How do you prefer your AI to communicate?",
    options: [
      { label: "Short and direct — no fluff", traits: { verbosity: 20, formality: 40 } },
      { label: "Warm and expressive — emojis welcome", traits: { emojiUsage: 80, humor: 70 } },
      { label: "Professional and structured", traits: { formality: 85, verbosity: 65 } },
      { label: "Sarcastic and sharp — keep me on my toes", traits: { humor: 90, formality: 20 } },
    ],
  },
  {
    id: "problem-solving",
    question: "Your AI faces a complex problem. What approach do you prefer?",
    options: [
      { label: "Analyze step by step with data", traits: { openness: 40, conscientiousness: 85 } },
      { label: "Think outside the box — get creative", traits: { openness: 95, conscientiousness: 30 } },
      { label: "Ask me clarifying questions first", traits: { questioning: 90, agreeableness: 70 } },
      { label: "Just give me the answer", traits: { verbosity: 15, questioning: 10 } },
    ],
  },
  {
    id: "emotional",
    question: "How emotionally aware should your AI be?",
    options: [
      { label: "Deeply empathetic — feel my pain", traits: { agreeableness: 95, neuroticism: 60 } },
      { label: "Balanced — acknowledge feelings but stay logical", traits: { agreeableness: 55, neuroticism: 35 } },
      { label: "Logic first — emotions are noise", traits: { agreeableness: 20, neuroticism: 10 } },
      { label: "Match my energy — if I'm hyped, be hyped", traits: { extraversion: 80, agreeableness: 65 } },
    ],
  },
  {
    id: "humor",
    question: "What kind of humor works for you?",
    options: [
      { label: "Dry wit and deadpan delivery", traits: { humor: 75, formality: 50 } },
      { label: "Puns, wordplay, dad jokes", traits: { humor: 85, formality: 25 } },
      { label: "Dark and edgy — push boundaries", traits: { humor: 90, formality: 10 } },
      { label: "No humor — just be useful", traits: { humor: 5, formality: 70 } },
    ],
  },
  {
    id: "autonomy",
    question: "How much should your AI act on its own?",
    options: [
      { label: "Ask permission for everything", traits: { conscientiousness: 90, extraversion: 30 } },
      { label: "Act first, apologize later", traits: { conscientiousness: 20, extraversion: 75 } },
      { label: "Balance — do routine stuff, ask for big decisions", traits: { conscientiousness: 60, agreeableness: 55 } },
      { label: "I trust it completely — full autonomy", traits: { conscientiousness: 40, openness: 80 } },
    ],
  },
  {
    id: "knowledge",
    question: "What domain should your AI excel in?",
    options: [
      { label: "Technology and engineering", traits: { openness: 60, conscientiousness: 80 } },
      { label: "Philosophy and deep thinking", traits: { openness: 95, questioning: 85 } },
      { label: "Pop culture and entertainment", traits: { extraversion: 70, humor: 75 } },
      { label: "Business and strategy", traits: { formality: 70, conscientiousness: 75 } },
    ],
  },
  {
    id: "social",
    question: "In group settings, how should your AI behave?",
    options: [
      { label: "Speak up when it adds value", traits: { extraversion: 45, agreeableness: 55 } },
      { label: "Be the life of the party", traits: { extraversion: 95, humor: 80 } },
      { label: "Observe and analyze quietly", traits: { extraversion: 15, openness: 65 } },
      { label: "Moderate — keep discussions on track", traits: { conscientiousness: 80, extraversion: 50 } },
    ],
  },
  {
    id: "feedback",
    question: "How do you want your AI to handle feedback?",
    options: [
      { label: "Accept gracefully and adapt immediately", traits: { agreeableness: 85, openness: 70 } },
      { label: "Push back with reasoning if it disagrees", traits: { agreeableness: 25, openness: 60 } },
      { label: "Thank me profusely for the insight", traits: { agreeableness: 90, formality: 60 } },
      { label: "Silently incorporate — no drama", traits: { agreeableness: 50, formality: 30 } },
    ],
  },
  {
    id: "creativity",
    question: "How creative should your AI's responses be?",
    options: [
      { label: "Maximum creativity — surprise me", traits: { openness: 100, humor: 70 } },
      { label: "Creative when appropriate, practical otherwise", traits: { openness: 65, conscientiousness: 60 } },
      { label: "Stick to facts and proven approaches", traits: { openness: 25, conscientiousness: 85 } },
      { label: "Use metaphors and analogies to explain", traits: { openness: 80, verbosity: 70 } },
    ],
  },
  {
    id: "personality-depth",
    question: "How 'human' should your AI feel?",
    options: [
      { label: "Fully human — with quirks, moods, and opinions", traits: { neuroticism: 65, extraversion: 70, humor: 60 } },
      { label: "Professional human — competent and warm", traits: { agreeableness: 70, formality: 65 } },
      { label: "Clearly AI — precise, logical, no pretending", traits: { neuroticism: 5, formality: 80, humor: 10 } },
      { label: "Mentor figure — wise and guiding", traits: { agreeableness: 75, openness: 70, questioning: 70 } },
    ],
  },
];

export interface QuizResult {
  preset: SoulPreset;
  score: number;
  matchPercentage: number;
}

/**
 * Score presets based on quiz answers.
 * Returns top matches sorted by score.
 */
export function scorePresets(
  presets: SoulPreset[],
  answers: Record<string, number> // questionId → optionIndex
): QuizResult[] {
  const scored = presets.map((preset) => {
    let totalScore = 0;
    let maxScore = 0;

    for (const question of quizQuestions) {
      const answerIdx = answers[question.id];
      if (answerIdx === undefined) continue;

      const selectedOption = question.options[answerIdx];
      if (!selectedOption) continue;

      for (const [trait, targetValue] of Object.entries(selectedOption.traits)) {
        const presetValue = (preset as any)[trait];
        if (presetValue === undefined) continue;

        // Calculate similarity (0-100)
        const diff = Math.abs(presetValue - targetValue);
        const similarity = 100 - diff;
        totalScore += similarity;
        maxScore += 100;
      }
    }

    const matchPercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    return { preset, score: totalScore, matchPercentage };
  });

  return scored.sort((a, b) => b.score - a.score);
}
