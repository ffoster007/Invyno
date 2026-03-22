import { prisma } from "./db";
import jwt from "jsonwebtoken";

/**
 * Add token to blacklist
 */
export async function blacklistToken(token: string): Promise<void> {
  let expiresAt: Date;
  
  try {
    const decoded = jwt.decode(token, { complete: false }) as jwt.JwtPayload | null;
    if (decoded && decoded.exp) {
      expiresAt = new Date(decoded.exp * 1000);
    } else {
      // Default to 7 days if expiry not found
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  } catch {
    expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  await prisma.tokenBlacklist.upsert({
    where: { token },
    create: {
      token,
      expiresAt,
    },
    update: {
      expiresAt,
    },
  });
}

/**
 * Check if token is blacklisted
 */
export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const blacklisted = await prisma.tokenBlacklist.findUnique({
    where: { token },
  });

  if (!blacklisted) {
    return false;
  }

  // Clean up expired tokens
  if (blacklisted.expiresAt < new Date()) {
    await prisma.tokenBlacklist.delete({
      where: { token },
    });
    return false;
  }

  return true;
}

/**
 * Clean up expired blacklisted tokens
 */
export async function cleanupExpiredBlacklistTokens(): Promise<void> {
  await prisma.tokenBlacklist.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}
