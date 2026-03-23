"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Analytics Component - Investment analytics and insights
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AnalyticsCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ANALYTICS_STATS: AnalyticsCardProps[] = [
  { title: "Total Portfolio Value", value: "$124,563", change: "+12.5%", trend: "up" },
  { title: "Monthly Returns", value: "$3,421", change: "+8.3%", trend: "up" },
  { title: "Risk Score", value: "7.2/10", change: "-0.5", trend: "down" },
  { title: "Active Investments", value: "24", change: "+3", trend: "up" },
];

const PERFORMANCE_DATA = [
  { month: "Jan", value: 85000 },
  { month: "Feb", value: 92000 },
  { month: "Mar", value: 88000 },
  { month: "Apr", value: 95000 },
  { month: "May", value: 102000 },
  { month: "Jun", value: 110000 },
  { month: "Jul", value: 124563 },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={["bg-[#0d1117] border border-[#21262d] rounded-xl hover:border-[#30363d] transition-colors", className].join(" ")}>
      {children}
    </div>
  );
}

function AnalyticsCard({ title, value, change, trend }: AnalyticsCardProps) {
  const trendColor = trend === 'up' ? 'text-[#39d353]' : trend === 'down' ? 'text-[#f85149]' : 'text-[#8b949e]';
  
  return (
    <Card className="p-4">
      <p className="text-[#8b949e] text-xs uppercase tracking-widest font-medium mb-2">{title}</p>
      <p className="text-[#e6edf3] text-2xl font-light mb-1">{value}</p>
      {change && (
        <p className={`${trendColor} text-xs font-medium`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {change}
        </p>
      )}
    </Card>
  );
}

function PerformanceChart() {
  const maxValue = Math.max(...PERFORMANCE_DATA.map(d => d.value));
  
  return (
    <div className="h-32 flex items-end gap-2">
      {PERFORMANCE_DATA.map((data, index) => (
        <div key={data.month} className="flex-1 flex flex-col items-center gap-1">
          <div 
            className="w-full bg-[#1f6feb] rounded-t-sm hover:bg-[#39d353] transition-colors cursor-pointer"
            style={{ height: `${(data.value / maxValue) * 100}%` }}
            title={`${data.month}: $${data.value.toLocaleString()}`}
          />
          <span className="text-[#8b949e] text-xs">{data.month}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-[#e6edf3] text-xl font-semibold tracking-tight mb-2">Analytics</h2>
        <p className="text-[#8b949e] text-sm">Track your investment performance and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ANALYTICS_STATS.map((stat, index) => (
          <AnalyticsCard key={index} {...stat} />
        ))}
      </div>

      {/* Performance Chart */}
      <Card className="p-5">
        <h3 className="text-[#e6edf3] text-sm font-semibold mb-4">Portfolio Performance</h3>
        <PerformanceChart />
      </Card>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="p-5">
          <h3 className="text-[#e6edf3] text-sm font-semibold mb-3">Asset Allocation</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[#8b949e] text-xs">Stocks</span>
              <span className="text-[#e6edf3] text-xs">45%</span>
            </div>
            <div className="w-full bg-[#21262d] rounded-full h-2">
              <div className="bg-[#1f6feb] h-2 rounded-full" style={{ width: '45%' }} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8b949e] text-xs">Crypto</span>
              <span className="text-[#e6edf3] text-xs">30%</span>
            </div>
            <div className="w-full bg-[#21262d] rounded-full h-2">
              <div className="bg-[#39d353] h-2 rounded-full" style={{ width: '30%' }} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8b949e] text-xs">Bonds</span>
              <span className="text-[#e6edf3] text-xs">25%</span>
            </div>
            <div className="w-full bg-[#21262d] rounded-full h-2">
              <div className="bg-[#f85149] h-2 rounded-full" style={{ width: '25%' }} />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-[#e6edf3] text-sm font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-[#21262d]">
              <div>
                <p className="text-[#e6edf3] text-xs">BTC Purchase</p>
                <p className="text-[#8b949e] text-xs">2 hours ago</p>
              </div>
              <span className="text-[#39d353] text-xs">+$2,340</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#21262d]">
              <div>
                <p className="text-[#e6edf3] text-xs">AAPL Sold</p>
                <p className="text-[#8b949e] text-xs">5 hours ago</p>
              </div>
              <span className="text-[#f85149] text-xs">-$1,200</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-[#e6edf3] text-xs">ETH Transfer</p>
                <p className="text-[#8b949e] text-xs">1 day ago</p>
              </div>
              <span className="text-[#8b949e] text-xs">$0</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}