import { prisma } from "./db";

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Check and update rate limit for an identifier (IP or user ID)
 */
export async function checkRateLimit(
  identifier: string,
  endpoint: string
): Promise<RateLimitResult> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);

  // Clean up old rate limit records
  await prisma.rateLimit.deleteMany({
    where: {
      windowStart: {
        lt: windowStart,
      },
    },
  });

  // Find or create rate limit record for this window
  const existing = await prisma.rateLimit.findFirst({
    where: {
      identifier,
      endpoint,
      windowStart: {
        gte: windowStart,
      },
    },
  });

  if (existing) {
    // Increment count
    const updated = await prisma.rateLimit.update({
      where: { id: existing.id },
      data: { count: { increment: 1 } },
    });

    const allowed = updated.count <= MAX_REQUESTS_PER_WINDOW;
    const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - updated.count);
    const resetAt = new Date(existing.windowStart.getTime() + RATE_LIMIT_WINDOW_MS);

    return { allowed, remaining, resetAt };
  } else {
    // Create new record
    await prisma.rateLimit.create({
      data: {
        identifier,
        endpoint,
        count: 1,
        windowStart: now,
      },
    });

    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetAt: new Date(now.getTime() + RATE_LIMIT_WINDOW_MS),
    };
  }
}

/**
 * Get client IP from request
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return "unknown";
}
