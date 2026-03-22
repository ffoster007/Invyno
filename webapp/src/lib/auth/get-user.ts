import { NextRequest } from "next/server";
import { verifyAccessToken } from "./jwt";
import { isTokenBlacklisted } from "./token-blacklist";

/**
 * Get authenticated user from request
 * Returns user info if authenticated, null otherwise
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<{
  userId: number;
  email: string;
} | null> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return null;
  }

  // Check if token is blacklisted
  const blacklisted = await isTokenBlacklisted(token);
  if (blacklisted) {
    return null;
  }

  // Verify token
  const payload = verifyAccessToken(token);
  if (!payload) {
    return null;
  }

  return {
    userId: payload.userId,
    email: payload.email,
  };
}
