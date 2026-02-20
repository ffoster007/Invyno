// app/page.tsx
"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Finance Dashboard — main page.
// Sidebar is fixed (position: fixed), so main content uses ml-14 (56px)
// to stay permanently offset — it never shifts on sidebar expand/collapse.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from "react";
import Sidebar from "@/components/ui/activitybar/page";

// ── Types ─────────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const HEATMAP_INTENSITY = [
  "bg-[#161b22]", // 0 — none
  "bg-[#0e4429]", // 1 — low
  "bg-[#006d32]", // 2
  "bg-[#26a641]", // 3
  "bg-[#39d353]", // 4 — high
] as const;

const BAR_HEIGHTS = [40, 65, 50, 80, 55, 90, 70, 85, 60, 95];

const PRIMARY_STATS: StatCardProps[] = [
  { label: "Today's Focus",      value: "1.8",   sub: "/ 8h" },
  { label: "Paid Invoices",      value: "24",    sub: "/ 32  ·  $8,000 / $12,000" },
  { label: "Total Balance (BTC)",value: "1.592", sub: "↑ 2.3% 24h", accent: true },
  { label: "Work-Life Balance",  value: "7.89",  sub: "/ 10.0" },
];

const SECONDARY_STATS: StatCardProps[] = [
  { label: "Completed Tasks",  value: "2",    sub: "/ 5" },
  { label: "KJ Fast Hours",    value: "6.9",  sub: "/ 15h" },
  { label: "ChatGPT API Usage",value: "5.01", sub: "/ $10.00" },
];

// ── Utility ───────────────────────────────────────────────────────────────────

function buildHeatmap(weeks = 26, days = 7): number[][] {
  return Array.from({ length: weeks }, () =>
    Array.from({ length: days }, () => Math.floor(Math.random() * 5))
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={["bg-[#0d1117] border border-[#21262d] rounded-xl hover:border-[#30363d] transition-colors", className].join(" ")}>
      {children}
    </div>
  );
}

function StatCard({ label, value, sub, accent = false }: StatCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-1 group">
      <p className="text-[#8b949e] text-xs uppercase tracking-widest font-medium">{label}</p>
      <p className={["text-3xl font-light tracking-tight transition-colors", accent ? "text-[#39d353]" : "text-[#e6edf3] group-hover:text-white"].join(" ")}>
        {value}
      </p>
      {sub && <p className="text-[#8b949e] text-xs">{sub}</p>}
    </Card>
  );
}

function MiniBarChart() {
  return (
    <div className="flex items-end gap-[3px] h-12">
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className={["flex-1 rounded-sm", i === BAR_HEIGHTS.length - 1 ? "bg-[#39d353]" : "bg-[#1f6feb]"].join(" ")}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function DonutRing({ value, max = 10 }: { value: number; max?: number }) {
  const r    = 36;
  const circ = 2 * Math.PI * r;
  const dash = (value / max) * circ;
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#161b22"  strokeWidth="10" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1f6feb"  strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
    </svg>
  );
}

function ActivityHeatmap({ data }: { data: number[][] }) {
  return (
    <div className="flex gap-[3px]">
      {data.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((val, di) => (
            <div
              key={di}
              title={`Week ${wi + 1} · Day ${di + 1} · level ${val}`}
              className={["w-[10px] h-[10px] rounded-[2px] cursor-default hover:opacity-70 transition-opacity", HEATMAP_INTENSITY[val]].join(" ")}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function HeatmapLegend() {
  return (
    <div className="flex items-center gap-1.5 text-[#8b949e] text-xs">
      <span>Less</span>
      {HEATMAP_INTENSITY.map((cls, i) => (
        <div key={i} className={["w-[10px] h-[10px] rounded-[2px]", cls].join(" ")} />
      ))}
      <span>More</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  const [active, setActive]   = useState("dashboard");
  const heatmapData           = useMemo(() => buildHeatmap(), []);

  return (
    <div className="bg-[#010409] text-[#c9d1d9] font-mono">

      {/* Sidebar — fixed overlay, z-20, never affects document flow */}
      <Sidebar active={active} onNavigate={setActive} />

      {/* Main — permanent ml-14 (56px) matches collapsed sidebar width.
          Sidebar expanding on hover is an overlay and does NOT shift this. */}
      <main className="ml-14 min-h-screen p-6">

        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[#e6edf3] text-xl font-semibold tracking-tight">Invyno</h1>

          </div>
        </header>

        {/* Row 1 — Primary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {PRIMARY_STATS.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Row 2 — Secondary stats + BTC bar chart */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {SECONDARY_STATS.map((s) => <StatCard key={s.label} {...s} />)}
          <Card className="p-4 flex flex-col justify-between">
            <p className="text-[#8b949e] text-xs uppercase tracking-widest font-medium">BTC Balance</p>
            <MiniBarChart />
          </Card>
        </div>

        {/* Activity heatmap */}
        <Card className="p-5 mb-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#8b949e] text-xs uppercase tracking-widest font-medium">Activity — Last 26 Weeks</p>
            <HeatmapLegend />
          </div>
          <ActivityHeatmap data={heatmapData} />
        </Card>

        {/* Row 3 — Insight + Work-life donut */}
        <div className="grid grid-cols-2 gap-3 mb-3">

          <Card className="p-5">
            <p className="text-[#8b949e] text-xs uppercase tracking-widest font-medium mb-2">Insight</p>
            <h3 className="text-[#e6edf3] text-sm font-semibold leading-snug mb-2">Aesthetic-Usability Effect</h3>
            <p className="text-[#8b949e] text-xs leading-relaxed">
              Users often perceive aesthetically pleasing design as design that's more usable.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[#39d353] text-xs">● Active</span>
              <span className="text-[#8b949e] text-xs">/ 20 templates</span>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-5">
            <div className="relative shrink-0">
              <DonutRing value={7.89} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#e6edf3] text-sm font-semibold">7.89</span>
              </div>
            </div>
            <div>
              <p className="text-[#8b949e] text-xs uppercase tracking-widest font-medium mb-1">Work-Life Balance</p>
              <p className="text-[#e6edf3] text-2xl font-light">
                78.9<span className="text-sm text-[#8b949e]">%</span>
              </p>
              <p className="text-[#39d353] text-xs mt-1">↑ +1.2 this week</p>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="border border-[#21262d] border-dashed rounded-xl px-5 py-3 flex items-center justify-between hover:border-[#30363d] transition-colors">
          <span className="text-[#8b949e] text-xs uppercase tracking-widest">Custom Dashboard</span>
          <span className="text-[#8b949e] text-xs">10 / 20 templates</span>
        </div>

      </main>
    </div>
  );
}