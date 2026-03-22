import { NextRequest, NextResponse } from "next/server";
import { revokeRefreshToken, revokeAllUserRefreshTokens } from "@/lib/auth/refresh-token";
import { blacklistToken } from "@/lib/auth/token-blacklist";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function POST(request: NextRequest) {
  try {
    // Get tokens
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const authHeader = request.headers.get("authorization");
    const accessToken = authHeader?.replace("Bearer ", "");

    // Revoke refresh token if present
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    // Blacklist access token if present
    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      if (payload) {
        await blacklistToken(accessToken);
      }
    }

    // Clear refresh token cookie
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.delete("refreshToken");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
