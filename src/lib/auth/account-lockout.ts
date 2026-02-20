import { prisma } from "./db";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Check if account is locked
 */
export async function isAccountLocked(userId: number): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lockedUntil: true },
  });

  if (!user || !user.lockedUntil) {
    return false;
  }

  if (user.lockedUntil > new Date()) {
    return true;
  }

  // Lock expired, unlock account
  await prisma.user.update({
    where: { id: userId },
    data: { lockedUntil: null, failedLoginAttempts: 0 },
  });

  return false;
}

/**
 * Record failed login attempt
 */
export async function recordFailedLoginAttempt(userId: number): Promise<{
  locked: boolean;
  attemptsRemaining: number;
  lockedUntil?: Date;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { failedLoginAttempts: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const newAttempts = user.failedLoginAttempts + 1;
  const shouldLock = newAttempts >= MAX_FAILED_ATTEMPTS;

  if (shouldLock) {
    const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: newAttempts,
        lockedUntil,
      },
    });

    await prisma.accountLockout.create({
      data: {
        userId,
        lockedUntil,
        reason: "too_many_failed_attempts",
      },
    });

    return {
      locked: true,
      attemptsRemaining: 0,
      lockedUntil,
    };
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: { failedLoginAttempts: newAttempts },
    });

    return {
      locked: false,
      attemptsRemaining: MAX_FAILED_ATTEMPTS - newAttempts,
    };
  }
}

/**
 * Reset failed login attempts on successful login
 */
export async function resetFailedLoginAttempts(userId: number): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });
}
