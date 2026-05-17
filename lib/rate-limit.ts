import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

/**
 * Rate limiter using Upstash Redis.
 *
 * Falls back to in-memory limiter if Upstash env vars are not configured.
 * In-memory fallback does NOT work across serverless instances — it's a
 * development convenience, not production protection.
 */

// --- Upstash Redis client (lazy init) ---
let _ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (_ratelimit) return _ratelimit;

  // Vercel Marketplace prefixes env vars with the KV store name (e.g. soul_KV_REST_API_URL)
  // Support both standard Upstash names and Vercel-prefixed names
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.soul_KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.soul_KV_REST_API_TOKEN;

  if (!url || !token) return null;

  const redis = new Redis({ url, token });

  _ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "60 s"), // 30 req/min
    analytics: true,
    prefix: "clawsouls:rl",
  });

  return _ratelimit;
}

// --- In-memory fallback (serverless-unsafe) ---
const memLimit = new Map<string, { count: number; resetAt: number }>();

function memCheck(ip: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = memLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    memLimit.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

// --- Public API ---

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Check rate limit for a request. Returns { success, limit, remaining, reset }.
 * If Upstash is configured, uses Redis. Otherwise falls back to in-memory.
 */
export async function checkRateLimit(
  request: NextRequest,
  max: number = 30,
  windowSec: number = 60
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const ip = getClientIp(request);
  const rl = getRatelimit();

  if (rl) {
    const result = await rl.limit(ip);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  }

  // Fallback
  const ok = memCheck(ip, max, windowSec * 1000);
  return {
    success: ok,
    limit: max,
    remaining: ok ? max - 1 : 0,
    reset: Date.now() + windowSec * 1000,
  };
}
