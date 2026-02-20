"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp, getGoogleAuthUrl } from "@/lib/auth/client";

// ─── Styles ──────────────────────────────────────────────────────────────────

const colors = {
  bg: "#111318",
  card: "#1a1d24",
  input: "#22262f",
  yellow: "#EFDB00",
  text: "#e5e7eb",
  muted: "#9ca3af",
  dim: "#6b7280",
  icon: "#4b5563",
};

const inputStyle = {
  backgroundColor: colors.input,
  border: "1px solid rgba(255,255,255,0.08)",
  color: colors.text,
  caretColor: colors.yellow,
};

const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = "rgba(239,219,0,0.45)";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(239,219,0,0.07)";
};

const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
  e.currentTarget.style.boxShadow = "none";
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const ICONS = {
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  email: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
};

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon: React.ReactNode;
  toggle?: { show: boolean; onToggle: () => void };
}

function InputField({ label, name, type = "text", value, onChange, placeholder, icon, toggle }: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: colors.muted }}>
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.icon }}>
          {icon}
        </span>
        <input
          type={toggle ? (toggle.show ? "text" : "password") : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm outline-none transition-all"
          style={inputStyle}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        {toggle && (
          <button
            type="button"
            onClick={toggle.onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: colors.icon }}
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.yellow)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.icon)}
          >
            <EyeIcon open={toggle.show} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(errorParam === "rate_limit_exceeded" ? "Too many requests. Please try again later." : "An error occurred");
    }
  }, [searchParams]);

  // Check if user is already authenticated and redirect to dashboard
  useEffect(() => {
    async function checkAuth() {
      const { getAccessToken, refreshAccessToken } = await import("@/lib/auth/client");
      let token = getAccessToken();
      
      // If no token, try to refresh using refresh token cookie
      if (!token) {
        token = await refreshAccessToken();
      }

      // If authenticated, redirect to dashboard
      if (token) {
        router.replace("/dashboard");
      }
    }

    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setValidationErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors([]);

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(formData.email, formData.name, formData.password);
      
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Sign up failed");
        if ((result as any).details) {
          setValidationErrors((result as any).details.map((d: any) => d.message));
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const authUrl = await getGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError("Failed to initiate Google sign up");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(239,219,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,219,0,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center top, rgba(239,219,0,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <Image src="/Invyno.png" alt="invyno logo" width={36} height={36} className="object-contain"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <span className="text-2xl font-bold tracking-tight"
            style={{ color: colors.yellow, fontFamily: "'Syne', 'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
            invyno
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8"
          style={{
            backgroundColor: colors.card,
            border: "1px solid rgba(239,219,0,0.10)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 24px 48px rgba(0,0,0,0.5)",
          }}>
          <h1 className="text-xl font-semibold mb-1"
            style={{ color: "#f5f5f5", fontFamily: "'Syne', 'DM Sans', sans-serif" }}>
            Create your account
          </h1>
          <p className="text-sm mb-7" style={{ color: colors.dim }}>Get started with invyno today.</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#fca5a5", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
              {error}
              {validationErrors.length > 0 && (
                <ul className="mt-2 list-disc list-inside">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Full Name"        name="name"            value={formData.name}            onChange={handleChange} placeholder="Username"  icon={ICONS.user} />
            <InputField label="Email"            name="email"           value={formData.email}           onChange={handleChange} placeholder="Email"     icon={ICONS.email} type="email" />
            <InputField label="Password"         name="password"        value={formData.password}        onChange={handleChange} placeholder="••••••••" icon={ICONS.lock} toggle={{ show: showPassword, onToggle: () => setShowPassword(!showPassword) }} />
            <InputField label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" icon={ICONS.lock} toggle={{ show: showConfirm,  onToggle: () => setShowConfirm(!showConfirm) }} />

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.yellow, color: colors.bg, letterSpacing: "0.01em" }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = "#f5e633"; e.currentTarget.style.boxShadow = "0 0 20px rgba(239,219,0,0.3)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.yellow; e.currentTarget.style.boxShadow = "none"; }}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            <div className="my-6 flex items-center gap-3">
              <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)", flex: 1 }} />
              <span className="text-xs" style={{ color: colors.dim }}>OR</span>
              <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)", flex: 1 }} />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: colors.input, 
                color: colors.text, 
                border: "1px solid rgba(255,255,255,0.08)",
                letterSpacing: "0.01em" 
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = "#2a2f38"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.input; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="my-6" style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }} />

            <div className="flex items-center justify-center">
              <Link href="/auth/signin" className="text-sm transition-colors" style={{ color: colors.dim }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.yellow)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.dim)}>
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#374151" }}>
          © {new Date().getFullYear()} invyno. All rights reserved.
        </p>
      </div>
    </main>
  );
}