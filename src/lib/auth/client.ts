/**
 * Client-side authentication utilities
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export interface AuthResponse {
  success: boolean;
  user?: {
    id: number;
    email: string;
    username: string;
    image?: string;
  };
  accessToken?: string;
  error?: string;
  message?: string;
}

/**
 * Store access token in localStorage
 */
export function setAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
}

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
}

/**
 * Remove access token from localStorage
 */
export function removeAccessToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.accessToken) {
      setAccessToken(data.accessToken);
      return data;
    }

    return { success: false, error: data.error || "Sign in failed" };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
}

/**
 * Sign up with email, username, and password
 */
export async function signUp(
  email: string,
  username: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await response.json();

    if (response.ok && data.accessToken) {
      setAccessToken(data.accessToken);
      return data;
    }

    return { success: false, error: data.error || "Sign up failed", details: data.details };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  const token = getAccessToken();
  
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    removeAccessToken();
    // Redirect to sign in page
    if (typeof window !== "undefined") {
      window.location.href = "/auth/signin";
    }
  }
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include", // Include cookies
    });

    const data = await response.json();

    if (response.ok && data.accessToken) {
      setAccessToken(data.accessToken);
      return data.accessToken;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Get Google OAuth URL
 */
export async function getGoogleAuthUrl(): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: "POST",
    });

    const data = await response.json();
    return data.authUrl;
  } catch (error) {
    throw new Error("Failed to get Google auth URL");
  }
}

/**
 * Make authenticated API request
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let token = getAccessToken();

  // Try to refresh token if not available
  if (!token) {
    token = await refreshAccessToken();
  }

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If token expired, try to refresh and retry
  if (response.status === 401 && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    }
  }

  return response;
}
