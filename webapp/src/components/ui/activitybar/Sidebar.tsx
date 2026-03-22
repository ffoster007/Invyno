// components/Sidebar.tsx
"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar — fixed position, hover to expand.
// Width is always w-14 (56px) in collapsed state and w-52 (208px) when hovered.
// Main content uses ml-14 and is never affected by sidebar expand/collapse.
// ─────────────────────────────────────────────────────────────────────────────

import Image from "next/image";
import { useEffect, useState } from "react";
import { House, LineChart } from "lucide-react";
import Avatar from "./Avatar";
import { getAccessToken, refreshAccessToken } from "@/lib/auth/client";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
}

interface SidebarProps {
  active: string;
  onNavigate: (id: string) => void;
}

interface User {
  id: number;
  email: string;
  username: string;
  image?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", icon: <House className="w-5 h-5 shrink-0" />, label: "Dashboard" },
  { id: "portfolio", icon: <LineChart       className="w-5 h-5 shrink-0" />, label: "Portfolio"  },
];

// ── Utility Functions ─────────────────────────────────────────────────────────

function getInitials(username: string): string {
  if (!username) return "U";
  
  // Split by space or take first two characters
  const parts = username.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  // If single word, take first two characters
  return username.substring(0, 2).toUpperCase();
}

// ── Sub-component: NavButton ──────────────────────────────────────────────────

function NavButton({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
      className={[
        "w-full h-10 px-2.5 rounded-lg",
        "flex items-center gap-3",
        "transition-colors cursor-pointer",
        isActive
          ? "bg-[#EFDB00] text-white"
          : "text-[#8b949e] hover:bg-[#EFDB00] hover:text-[#c9d1d9]",
      ].join(" ")}
    >
      {item.icon}
      {/* Label fades in — overflow hidden on parent clips it during collapse */}
      <span className="text-xs font-medium tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {item.label}
      </span>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        let token = getAccessToken();
        
        // If no token, try to refresh using refresh token cookie
        if (!token) {
          token = await refreshAccessToken();
        }

        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch user data from API
        const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const userInitials = user ? getInitials(user.username) : "U";
  const displayName = user?.username || "User";

  return (
    // `group` drives child label/name reveal via group-hover utilities.
    // `fixed` + full height keeps sidebar on top without shifting main content.
    <aside className="group fixed left-0 top-0 h-screen z-20 flex flex-col py-5 bg-[#0d1117] border-r border-[#21262d] w-14 hover:w-52 transition-[width] duration-300 ease-in-out overflow-hidden">

      {/* Logo ───────────────────────────────────────────────────────────────── */}
      <div className="flex items-center px-3.5 mb-6 shrink-0">
        <Image
          src="/Invyno.png"
          alt="Invyno logo"
          width={28}
          height={28}
          className="shrink-0 select-none"
        />
        {/* App name fades in beside logo on hover */}
        <span className="ml-3 text-[#e6edf3] text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Invyno
        </span>
      </div>

      {/* Navigation ─────────────────────────────────────────────────────────── */}
      <nav className="flex flex-col gap-1 flex-1 w-full px-2">
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            isActive={active === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </nav>

      {/* User profile ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-3 shrink-0">
        {loading ? (
          <div className="w-8 h-8 rounded-full bg-[#21262d] animate-pulse" />
        ) : (
          <>
            <Avatar 
              initials={userInitials} 
              size="md" 
              name={displayName} 
              email={user?.email} 
            />
            {/* Name fade in on hover */}
            <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <p className="text-[#e6edf3] text-xs font-medium whitespace-nowrap">{displayName}</p>
              {user?.email && (
                <p className="text-[#8b949e] text-[10px] whitespace-nowrap truncate">{user.email}</p>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
