"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Avatar with dropdown menu for logout
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import { signOut } from "@/lib/auth/client";
import { LogOut, User } from "lucide-react";

const SIZE = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
} as const;

interface AvatarProps {
  initials?: string;
  size?: keyof typeof SIZE;
  onClick?: () => void;
  name?: string;
  email?: string;
}

export default function Avatar({ 
  initials = "A", 
  size = "md", 
  onClick,
  name,
  email 
}: AvatarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAvatarClick = () => {
    setIsOpen(!isOpen);
    onClick?.();
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Create tooltip text from name or email
  const tooltipText = name || email || "Profile";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        title={tooltipText}
        aria-label={tooltipText}
        onClick={handleAvatarClick}
        className={[
          SIZE[size],
          "rounded-full shrink-0 select-none",
          "bg-gradient-to-br from-[#39d353] to-[#1f6feb]",
          "flex items-center justify-center",
          "font-bold text-white",
          "ring-2 ring-transparent hover:ring-[#39d353]/50",
          "transition-all duration-200",
          isOpen && "ring-[#39d353]/50",
        ].join(" ")}
      >
        {initials.slice(0, 2).toUpperCase()}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-48 rounded-lg shadow-lg z-50"
          style={{
            backgroundColor: "#1a1d24",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}>
          {/* User Info */}
          {(name || email) && (
            <div className="px-4 py-3 border-b border-[#21262d]">
              {name && (
                <p className="text-[#e6edf3] text-sm font-medium" title={name}>{name}</p>
              )}
              {email && (
                <p className="text-[#8b949e] text-xs mt-0.5 truncate" title={email}>{email}</p>
              )}
            </div>
          )}

          {/* Menu Items */}
          <div className="py-1">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-4 py-2.5 text-left text-sm text-[#e6edf3] hover:bg-[#161b22] transition-colors flex items-center gap-3"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
