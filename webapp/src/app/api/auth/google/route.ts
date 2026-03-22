import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/auth/db";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth/jwt";
import { storeRefreshToken } from "@/lib/auth/refresh-token";
import { checkRateLimit, getClientIP } from "@/lib/auth/rate-limit";

/**
 * Google OAuth callback handler
 * This endpoint receives the authorization code from Google
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/signin?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=missing_code", request.url)
      );
    }

    const clientIP = getClientIP(request);
    const rateLimit = await checkRateLimit(clientIP, "/api/auth/google");
    if (!rateLimit.allowed) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=rate_limit_exceeded", request.url)
      );
    }

    // Exchange code for tokens with Google
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_ID!,
        client_secret: process.env.GOOGLE_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=oauth_failed", request.url)
      );
    }

    const tokens = await tokenResponse.json();
    const { access_token } = tokens;

    // Get user info from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=user_info_failed", request.url)
      );
    }

    const googleUser = await userResponse.json();
    const { id: providerId, email, name, picture } = googleUser;

    if (!email) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=no_email", request.url)
      );
    }

    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { providerId, provider: "google" },
        ],
      },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          username: email.split("@")[0].toLowerCase() + Math.random().toString(36).substring(7),
          provider: "google",
          providerId,
          emailVerified: true,
          image: picture,
        },
      });
    } else {
      // Update existing user if needed
      if (!user.providerId || user.provider !== "google") {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            provider: "google",
            providerId,
            emailVerified: true,
            image: picture || user.image,
          },
        });
      }
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    // Store refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await storeRefreshToken(user.id, refreshToken, expiresAt);

    // Redirect to dashboard
    const redirectUrl = new URL("/components/page", request.url);

    const response = NextResponse.redirect(redirectUrl);

    // Set refresh token in HttpOnly cookie
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(
      new URL("/auth/signin?error=internal_error", request.url)
    );
  }
}

/**
 * Get Google OAuth URL
 */
export async function POST(request: NextRequest) {
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google`;
  
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", process.env.GOOGLE_ID!);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");

  return NextResponse.json({ authUrl: authUrl.toString() });
}
