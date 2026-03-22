"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard page - Protected route
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Page from "@/components/page";
import { getAccessToken, refreshAccessToken } from "@/lib/auth/client";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      // Check for access token in localStorage
      let token = getAccessToken();
      
      // If no token, try to refresh using refresh token cookie
      if (!token) {
        token = await refreshAccessToken();
      }

      if (token) {
        setIsAuthenticated(true);
        setLoading(false);
      } else {
        // Redirect to sign in if not authenticated
        router.push("/auth/signin");
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#010409] flex items-center justify-center">
        <div className="text-[#8b949e]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Page />;
}
