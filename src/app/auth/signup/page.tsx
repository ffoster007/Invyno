"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handle signup logic
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#111318" }}
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(239,219,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,219,0,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(239,219,0,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <Image
            src="/Invyno.png"
            alt="invyno logo"
            width={36}
            height={36}
            className="object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <span
            className="text-2xl font-bold tracking-tight"
            style={{
              color: "#EFDB00",
              fontFamily: "'Syne', 'DM Sans', sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            invyno
          </span>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            backgroundColor: "#1a1d24",
            border: "1px solid rgba(239,219,0,0.10)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.04), 0 24px 48px rgba(0,0,0,0.5)",
          }}
        >
          <h1
            className="text-xl font-semibold mb-1"
            style={{
              color: "#f5f5f5",
              fontFamily: "'Syne', 'DM Sans', sans-serif",
            }}
          >
            Create your account
          </h1>
          <p className="text-sm mb-7" style={{ color: "#6b7280" }}>
            Get started with invyno today.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "#9ca3af" }}
              >
                Full Name
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#4b5563" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    backgroundColor: "#22262f",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#e5e7eb",
                    caretColor: "#EFDB00",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(239,219,0,0.45)";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(239,219,0,0.07)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.08)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "#9ca3af" }}
              >
                Email
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#4b5563" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    backgroundColor: "#22262f",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#e5e7eb",
                    caretColor: "#EFDB00",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(239,219,0,0.45)";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(239,219,0,0.07)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.08)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "#9ca3af" }}
              >
                Password
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#4b5563" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    backgroundColor: "#22262f",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#e5e7eb",
                    caretColor: "#EFDB00",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(239,219,0,0.45)";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(239,219,0,0.07)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.08)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#4b5563" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#EFDB00")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#4b5563")
                  }
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "#9ca3af" }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#4b5563" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    backgroundColor: "#22262f",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#e5e7eb",
                    caretColor: "#EFDB00",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(239,219,0,0.45)";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(239,219,0,0.07)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.08)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#4b5563" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#EFDB00")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#4b5563")
                  }
                >
                  {showConfirm ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div
              className="my-6"
              style={{
                height: "1px",
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            />

            {/* Actions row */}
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/auth/signin"
                className="text-sm transition-colors"
                style={{ color: "#6b7280" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#EFDB00")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#6b7280")
                }
              >
                Already have an account?{" "}
              </Link>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
                style={{
                  backgroundColor: "#EFDB00",
                  color: "#111318",
                }}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: "#374151" }}>
          © {new Date().getFullYear()} invyno. All rights reserved.
        </p>
      </div>
    </main>
  );
}