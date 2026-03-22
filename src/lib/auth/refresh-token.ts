import { prisma } from "./db";
import { generateRefreshToken, generateAccessToken, verifyRefreshToken } from "./jwt";
import type { JWTPayload } from "./jwt";

/**
 * Store refresh token in database
 */
export async function storeRefreshToken(
  userId: number,
  token: string,
  expiresAt: Date
): Promise<void> {
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
}

/**
 * Verify and rotate refresh token
 * Returns new refresh token if valid, null if invalid
 */
export async function rotateRefreshToken(
  oldToken: string
): Promise<{ newRefreshToken: string; newAccessToken: string } | null> {
  // Verify token signature
  const payload = verifyRefreshToken(oldToken);
  if (!payload) {
    return null;
  }

  // Check if token exists in database
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: oldToken },
    include: { user: true },
  });

  if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
    return null;
  }

  // Revoke old token
  await prisma.refreshToken.update({
    where: { token: oldToken },
    data: { revokedAt: new Date() },
  });

  // Generate new tokens
  const newRefreshToken = generateRefreshToken({
    userId: payload.userId,
    email: payload.email,
  });
  const newAccessToken = generateAccessToken({
    userId: payload.userId,
    email: payload.email,
  });

  // Store new refresh token
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await storeRefreshToken(payload.userId, newRefreshToken, expiresAt);

  return {
    newRefreshToken,
    newAccessToken,
  };
}

/**
 * Revoke refresh token (for logout)
 */
export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: {
      token,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

/**
 * Revoke all refresh tokens for a user
 */
export async function revokeAllUserRefreshTokens(userId: number): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

/**
 * Clean up expired refresh tokens
 */
export async function cleanupExpiredRefreshTokens(): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}
