import { SoulPreset } from "../store/soulStore";

export interface QuizQuestion {
  id: string;
  options: {
    traits: Partial<Record<keyof SoulPreset, number>>;
  }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "communication",
    options: [
      { traits: { verbosity: 20, formality: 40 } },
      { traits: { emojiUsage: 80, humor: 70 } },
      { traits: { formality: 85, verbosity: 65 } },
      { traits: { humor: 90, formality: 20 } },
    ],
  },
  {
    id: "problem-solving",
    options: [
      { traits: { openness: 40, conscientiousness: 85 } },
      { traits: { openness: 95, conscientiousness: 30 } },
      { traits: { questioning: 90, agreeableness: 70 } },
      { traits: { verbosity: 15, questioning: 10 } },
    ],
  },
  {
    id: "emotional",
    options: [
      { traits: { agreeableness: 95, neuroticism: 60 } },
      { traits: { agreeableness: 55, neuroticism: 35 } },
      { traits: { agreeableness: 20, neuroticism: 10 } },
      { traits: { extraversion: 80, agreeableness: 65 } },
    ],
  },
  {
    id: "humor",
    options: [
      { traits: { humor: 75, formality: 50 } },
      { traits: { humor: 85, formality: 25 } },
      { traits: { humor: 90, formality: 10 } },
      { traits: { humor: 5, formality: 70 } },
    ],
  },
  {
    id: "autonomy",
    options: [
      { traits: { conscientiousness: 90, extraversion: 30 } },
      { traits: { conscientiousness: 20, extraversion: 75 } },
      { traits: { conscientiousness: 60, agreeableness: 55 } },
      { traits: { conscientiousness: 40, openness: 80 } },
    ],
  },
  {
    id: "knowledge",
    options: [
      { traits: { openness: 60, conscientiousness: 80 } },
      { traits: { openness: 95, questioning: 85 } },
      { traits: { extraversion: 70, humor: 75 } },
      { traits: { formality: 70, conscientiousness: 75 } },
    ],
  },
  {
    id: "social",
    options: [
      { traits: { extraversion: 45, agreeableness: 55 } },
      { traits: { extraversion: 95, humor: 80 } },
      { traits: { extraversion: 15, openness: 65 } },
      { traits: { conscientiousness: 80, extraversion: 50 } },
    ],
  },
  {
    id: "feedback",
    options: [
      { traits: { agreeableness: 85, openness: 70 } },
      { traits: { agreeableness: 25, openness: 60 } },
      { traits: { agreeableness: 90, formality: 60 } },
      { traits: { agreeableness: 50, formality: 30 } },
    ],
  },
  {
    id: "creativity",
    options: [
      { traits: { openness: 100, humor: 70 } },
      { traits: { openness: 65, conscientiousness: 60 } },
      { traits: { openness: 25, conscientiousness: 85 } },
      { traits: { openness: 80, verbosity: 70 } },
    ],
  },
  {
    id: "personality-depth",
    options: [
      { traits: { neuroticism: 65, extraversion: 70, humor: 60 } },
      { traits: { agreeableness: 70, formality: 65 } },
      { traits: { neuroticism: 5, formality: 80, humor: 10 } },
      { traits: { agreeableness: 75, openness: 70, questioning: 70 } },
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
  answers: Record<string, number>, // questionId → optionIndex
  quizQuestionsParam: QuizQuestion[]
): QuizResult[] {
  const scored = presets.map((preset) => {
    let totalScore = 0;
    let maxScore = 0;

    for (const question of quizQuestionsParam) {
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
