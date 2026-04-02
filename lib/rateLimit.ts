import type { NextApiRequest, NextApiResponse } from 'next';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  /** Max requests per window */
  max: number;
  /** Window duration in milliseconds */
  windowMs: number;
  /** Custom key extractor (defaults to IP) */
  keyFn?: (req: NextApiRequest) => string;
}

/**
 * Simple in-memory rate limiter for Next.js API routes.
 * Returns true if request is allowed, false if rate limited.
 */
export function rateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  options: RateLimitOptions = { max: 60, windowMs: 60_000 }
): boolean {
  const { max, windowMs, keyFn } = options;
  const key = keyFn
    ? keyFn(req)
    : getClientIp(req);

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    setRateHeaders(res, max, max - 1, now + windowMs);
    return true;
  }

  entry.count++;
  setRateHeaders(res, max, max - entry.count, entry.resetAt);

  if (entry.count > max) {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    });
    return false;
  }

  return true;
}

function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress ?? 'unknown';
}

function setRateHeaders(
  res: NextApiResponse,
  limit: number,
  remaining: number,
  resetAt: number
) {
  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, remaining));
  res.setHeader('X-RateLimit-Reset', Math.ceil(resetAt / 1000));
}
