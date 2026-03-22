import { NextRequest, NextResponse } from "next/server";
import { rotateRefreshToken } from "@/lib/auth/refresh-token";
import { isTokenBlacklisted } from "@/lib/auth/token-blacklist";

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 401 }
      );
    }

    // Check if token is blacklisted
    const blacklisted = await isTokenBlacklisted(refreshToken);
    if (blacklisted) {
      return NextResponse.json(
        { error: "Token has been revoked" },
        { status: 401 }
      );
    }

    // Rotate refresh token (returns new tokens)
    const result = await rotateRefreshToken(refreshToken);

    if (!result) {
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    // Set new refresh token in HttpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        accessToken: result.newAccessToken,
      },
      { status: 200 }
    );

    response.cookies.set("refreshToken", result.newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
