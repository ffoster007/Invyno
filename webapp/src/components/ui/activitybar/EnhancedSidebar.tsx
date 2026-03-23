// ─────────────────────────────────────────────────────────────────────────────
// Enhanced Sidebar - Uses centralized navigation system
// ─────────────────────────────────────────────────────────────────────────────

import Image from "next/image";
import { useEffect, useState } from "react";
import { House, Box, ChartSpline } from "lucide-react";
import Avatar from "./Avatar";
import { getAccessToken, refreshAccessToken } from "@/lib/auth/client";
import { useNavigation, UseNavigationReturn } from "@/hooks/useNavigation";
import { NAVIGATION_ROUTES } from "@/lib/navigation/routes";

// Icon mapping
const ICON_MAP = {
  House: <House className="w-5 h-5 shrink-0" />,
  Box: <Box className="w-5 h-5 shrink-0" />,
  ChartSpline: <ChartSpline className="w-5 h-5 shrink-0" />,
};

interface User {
  id: number;
  email: string;
  username: string;
  image?: string;
}

function getInitials(username: string): string {
  if (!username) return "U";
  
  const parts = username.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  return username.substring(0, 2).toUpperCase();
}

function NavButton({
  routeId,
  label,
  icon,
  isActive,
  onClick,
}: {
  routeId: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      className={[
        "w-full h-10 px-2.5 rounded-lg",
        "flex items-center gap-3",
        " cursor-pointer",
        isActive
          ? "bg-[#1f6feb] text-white"
          : "text-[#8b949e] hover:bg-[#707070] hover:text-[#c9d1d9]",
      ].join(" ")}
    >
      {icon}
      <span className="text-xs font-medium tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {label}
      </span>
    </button>
  );
}

interface EnhancedSidebarProps {
  navigation: UseNavigationReturn;
}

export default function EnhancedSidebar({ navigation }: EnhancedSidebarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        let token = getAccessToken();
        
        if (!token) {
          token = await refreshAccessToken();
        }

        if (!token) {
          setLoading(false);
          return;
        }

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
    <aside className="group fixed left-0 top-0 h-screen z-20 flex flex-col py-5 bg-[#0d1117] border-r border-[#21262d] w-14 hover:w-52 overflow-hidden">
      
      {/* Logo */}
      <div className="flex items-center px-3.5 mb-6 shrink-0">
        <Image
          src="/Invyno.png"
          alt="Invyno logo"
          width={28}
          height={28}
          className="shrink-0 select-none"
        />
        <span className="ml-3 text-[#e6edf3] text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100">
          Invyno
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1 w-full px-2">
        {NAVIGATION_ROUTES.map((route) => (
          <NavButton
            key={route.id}
            routeId={route.id}
            label={route.label}
            icon={ICON_MAP[route.icon as keyof typeof ICON_MAP] || <Box className="w-5 h-5 shrink-0" />}
            isActive={navigation.isRouteActive(route.id)}
            onClick={() => navigation.setActiveRoute(route.id)}
          />
        ))}
      </nav>

      {/* User profile */}
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
