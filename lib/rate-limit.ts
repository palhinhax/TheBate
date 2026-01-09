/**
 * Simple in-memory rate limiter
 * For production, consider using Upstash Redis or similar
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Store rate limit data in memory
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries
 * Called during rate limit checks instead of on a timer
 * to be compatible with serverless environments
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];

  rateLimitStore.forEach((entry, key) => {
    if (entry.resetAt < now) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach((key) => rateLimitStore.delete(key));
}

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check and record a rate limit attempt
 * @param identifier Unique identifier (IP address, email, etc.)
 * @param config Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  // Clean up expired entries periodically (10% chance on each check)
  // This ensures cleanup happens without relying on timers (serverless-friendly)
  if (Math.random() < 0.1) {
    cleanupExpiredEntries();
  }

  const now = Date.now();
  const key = identifier;

  let entry = rateLimitStore.get(key);

  // If no entry or expired, create a new one
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);

    return {
      success: true,
      remaining: config.maxAttempts - 1,
      resetAt: entry.resetAt,
    };
  }

  // Check if limit is exceeded
  if (entry.count >= config.maxAttempts) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    success: true,
    remaining: config.maxAttempts - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Reset rate limit for an identifier
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  // Check for Cloudflare, Vercel, or other proxy headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  if (cfConnectingIp) return cfConnectingIp;
  if (realIp) return realIp;
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  return "unknown";
}
