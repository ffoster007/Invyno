// components/Sidebar.tsx
"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar — fixed position, hover to expand.
// Width is always w-14 (56px) in collapsed state and w-52 (208px) when hovered.
// Main content uses ml-14 and is never affected by sidebar expand/collapse.
// ─────────────────────────────────────────────────────────────────────────────

import Image from "next/image";
import { House, LineChart } from "lucide-react";
import Avatar from "./Avatar";

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

// ── Constants ─────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", icon: <House className="w-5 h-5 shrink-0" />, label: "Dashboard" },
  { id: "portfolio", icon: <LineChart       className="w-5 h-5 shrink-0" />, label: "Portfolio"  },
];

const USER = { initials: "AK", name: "Anek K.", role: "Finance Pro" };

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
          ? "bg-[#1f6feb] text-white shadow-lg shadow-[#1f6feb]/30"
          : "text-[#8b949e] hover:bg-[#161b22] hover:text-[#c9d1d9]",
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
        <Avatar initials={USER.initials} size="md" />
        {/* Name + role fade in on hover */}
        <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-[#e6edf3] text-xs font-medium whitespace-nowrap">{USER.name}</p>
          <p className="text-[#8b949e] text-[10px] whitespace-nowrap">{USER.role}</p>
        </div>
      </div>
    </aside>
  );
}