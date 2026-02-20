import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/auth/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth/jwt";
import { storeRefreshToken } from "@/lib/auth/refresh-token";
import { checkRateLimit, getClientIP } from "@/lib/auth/rate-limit";
import { isAccountLocked, recordFailedLoginAttempt, resetFailedLoginAttempts } from "@/lib/auth/account-lockout";
import { isTokenBlacklisted } from "@/lib/auth/token-blacklist";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientIP = getClientIP(request);
    
    // Rate limiting
    const rateLimit = await checkRateLimit(clientIP, "/api/auth/signin");
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests",
          message: `Rate limit exceeded. Please try again after ${new Date(rateLimit.resetAt).toISOString()}`,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": rateLimit.resetAt.toISOString(),
          },
        }
      );
    }

    // Validate input
    const validationResult = signInSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation error", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.password) {
      // Don't reveal if user exists
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check account lockout
    const locked = await isAccountLocked(user.id);
    if (locked) {
      return NextResponse.json(
        { error: "Account is locked. Please try again later." },
        { status: 423 }
      );
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.password);
    if (!passwordValid) {
      const lockoutResult = await recordFailedLoginAttempt(user.id);
      return NextResponse.json(
        {
          error: "Invalid email or password",
          ...(lockoutResult.locked && {
            message: `Account locked due to too many failed attempts. Try again after ${lockoutResult.lockedUntil?.toISOString()}`,
          }),
        },
        { status: 401 }
      );
    }

    // Reset failed attempts on successful login
    await resetFailedLoginAttempts(user.id);

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

    // Set refresh token in HttpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          image: user.image,
        },
        accessToken,
      },
      { status: 200 }
    );

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
