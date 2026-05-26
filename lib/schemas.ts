import { z } from "zod";

/**
 * Zod schemas for API route input validation.
 * Each schema corresponds to a POST body or query params for a specific route.
 */

// --- Shared primitives ---

const presetIdSchema = z
  .string()
  .min(1, "presetId is required")
  .max(100, "presetId too long")
  .regex(/^[a-zA-Z0-9_-]+$/, "presetId must be alphanumeric with hyphens/underscores");

const anonymousIdSchema = z
  .string()
  .min(5, "anonymousId too short")
  .max(50, "anonymousId too long")
  .regex(/^[a-zA-Z0-9_]+$/, "anonymousId must be alphanumeric with underscores");

const starsSchema = z.number().int().min(0).max(5);

const likedSchema = z.boolean().nullable();

// --- /api/ratings ---

export const ratingsPostSchema = z.object({
  presetId: presetIdSchema,
  anonymousId: anonymousIdSchema,
  liked: likedSchema.optional(),
  stars: starsSchema.optional(),
});

export const ratingsGetSchema = z.object({
  presetId: presetIdSchema.optional(),
});

// --- /api/critique ---

const presetForCritiqueSchema = z.object({
  id: presetIdSchema.optional(),
  name: z.string().max(200).optional(),
  creature: z.string().max(100).optional(),
  vibe: z.string().max(2000).optional(),
  description: z.string().max(5000).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  openness: z.number().min(0).max(100).optional(),
  conscientiousness: z.number().min(0).max(100).optional(),
  extraversion: z.number().min(0).max(100).optional(),
  agreeableness: z.number().min(0).max(100).optional(),
  neuroticism: z.number().min(0).max(100).optional(),
});

export const critiquePostSchema = z.object({
  preset: presetForCritiqueSchema,
  karmaScore: z.number().min(0).max(100).optional(),
  issues: z.array(z.string().max(100)).max(10).optional(),
  language: z.string().max(5).optional(),
});

// --- /api/share ---

const soulShareSchema = z.object({
  name: z.string().max(200).optional(),
  creature: z.string().max(100).optional(),
  vibe: z.string().max(10000).optional(),
  description: z.string().max(10000).optional(),
  tags: z.array(z.string().max(50)).max(30).optional(),
  // Allow any additional fields but cap total size
}).passthrough().refine(
  (data) => JSON.stringify(data).length <= 50_000,
  { message: "Soul data too large (max 50KB)" }
);

export const sharePostSchema = z.object({
  soul: soulShareSchema,
  locale: z.string().max(5).optional(),
});

// --- /api/presets (query params) ---

export const presetsGetSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  creature: z.string().max(100).optional(),
  source: z.string().max(50).optional(),
  search: z.string().max(200).optional(),
});

// --- /api/filtered-presets (query params) ---

export const filteredPresetsGetSchema = z.object({
  limit: z.coerce.number().int().min(1).max(1000).default(100),
  offset: z.coerce.number().int().min(0).default(0),
  creature: z.string().max(100).optional(),
  source: z.string().max(50).optional(),
  search: z.string().max(200).optional(),
  locale: z.string().max(5).optional(), // 'en', 'pt', 'es', 'fr', 'de', 'ja', 'zh'
});

// --- Helper: safe error response ---

export function safeError(context: string, err: unknown): string {
  console.error(`[api] ${context}:`, err);
  return "Internal server error";
}

// --- Helper: sanitize LLM input (strip control chars, limit length) ---

export function sanitizeForLLM(input: string, maxLen: number = 2000): string {
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // control chars
    .replace(/[<>]/g, "") // basic HTML stripping
    .trim()
    .slice(0, maxLen);
}
