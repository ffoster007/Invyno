"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Workspace Component - Investment workspace and portfolio management
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PortfolioItem {
  id: string;
  name: string;
  type: 'stock' | 'crypto' | 'bond';
  value: number;
  change: number;
  changePercent: number;
  quantity: number;
}

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { id: '1', name: 'Bitcoin', type: 'crypto', value: 45230, change: 1230, changePercent: 2.8, quantity: 1.2 },
  { id: '2', name: 'Apple Inc.', type: 'stock', value: 8900, change: -120, changePercent: -1.3, quantity: 50 },
  { id: '3', name: 'Ethereum', type: 'crypto', value: 12340, change: 890, changePercent: 7.8, quantity: 6.5 },
  { id: '4', name: 'US Treasury Bond', type: 'bond', value: 10000, change: 50, changePercent: 0.5, quantity: 1 },
  { id: '5', name: 'Tesla Inc.', type: 'stock', value: 15600, change: 340, changePercent: 2.2, quantity: 40 },
];

const WATCHLIST_ITEMS: WatchlistItem[] = [
  { id: '1', symbol: 'NVDA', name: 'NVIDIA Corporation', price: 485.09, change: 12.45, changePercent: 2.6 },
  { id: '2', symbol: 'SOL', name: 'Solana', price: 98.45, change: -3.21, changePercent: -3.2 },
  { id: '3', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.67, change: 2.89, changePercent: 2.1 },
  { id: '4', symbol: 'ADA', name: 'Cardano', price: 0.58, change: 0.02, changePercent: 3.6 },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={["bg-[#0d1117] border border-[#21262d] rounded-xl hover:border-[#30363d] transition-colors", className].join(" ")}>
      {children}
    </div>
  );
}

function PortfolioTable() {
  const totalValue = PORTFOLIO_ITEMS.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#21262d]">
            <th className="text-left py-3 px-2 text-[#8b949e] font-medium">Asset</th>
            <th className="text-right py-3 px-2 text-[#8b949e] font-medium">Quantity</th>
            <th className="text-right py-3 px-2 text-[#8b949e] font-medium">Value</th>
            <th className="text-right py-3 px-2 text-[#8b949e] font-medium">Change</th>
            <th className="text-right py-3 px-2 text-[#8b949e] font-medium">% Change</th>
          </tr>
        </thead>
        <tbody>
          {PORTFOLIO_ITEMS.map((item) => (
            <tr key={item.id} className="border-b border-[#21262d] hover:bg-[#161b22] transition-colors">
              <td className="py-3 px-2">
                <div>
                  <p className="text-[#e6edf3] font-medium">{item.name}</p>
                  <p className="text-[#8b949e] text-xs capitalize">{item.type}</p>
                </div>
              </td>
              <td className="text-right py-3 px-2 text-[#e6edf3]">{item.quantity}</td>
              <td className="text-right py-3 px-2 text-[#e6edf3]">${item.value.toLocaleString()}</td>
              <td className={`text-right py-3 px-2 ${item.change >= 0 ? 'text-[#39d353]' : 'text-[#f85149]'}`}>
                {item.change >= 0 ? '+' : ''}{item.change.toLocaleString()}
              </td>
              <td className={`text-right py-3 px-2 ${item.changePercent >= 0 ? 'text-[#39d353]' : 'text-[#f85149]'}`}>
                {item.changePercent >= 0 ? '+' : ''}{item.changePercent}%
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-[#30363d]">
            <td className="py-3 px-2 font-semibold text-[#e6edf3]">Total</td>
            <td colSpan={2} className="text-right py-3 px-2 font-semibold text-[#e6edf3]">
              ${totalValue.toLocaleString()}
            </td>
            <td className="text-right py-3 px-2 text-[#39d353] font-semibold">
              +{PORTFOLIO_ITEMS.reduce((sum, item) => sum + item.change, 0).toLocaleString()}
            </td>
            <td className="text-right py-3 px-2 text-[#39d353] font-semibold">
              +{((PORTFOLIO_ITEMS.reduce((sum, item) => sum + item.change, 0) / totalValue) * 100).toFixed(2)}%
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function WatchlistTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#21262d]">
            <th className="text-left py-3 px-2 text-[#8b949e] font-medium">Symbol</th>
            <th className="text-left py-3 px-2 text-[#8b949e] font-medium">Name</th>
            <th className="text-right py-3 px-2 text-[#8b949e] font-medium">Price</th>
            <th className="text-right py-3 px-2 text-[#8b949e] font-medium">Change</th>
            <th className="text-right py-3 px-2 text-[#8b949e] font-medium">% Change</th>
          </tr>
        </thead>
        <tbody>
          {WATCHLIST_ITEMS.map((item) => (
            <tr key={item.id} className="border-b border-[#21262d] hover:bg-[#161b22] transition-colors">
              <td className="py-3 px-2 text-[#e6edf3] font-medium">{item.symbol}</td>
              <td className="py-3 px-2 text-[#8b949e] text-xs">{item.name}</td>
              <td className="text-right py-3 px-2 text-[#e6edf3]">${item.price.toFixed(2)}</td>
              <td className={`text-right py-3 px-2 ${item.change >= 0 ? 'text-[#39d353]' : 'text-[#f85149]'}`}>
                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
              </td>
              <td className={`text-right py-3 px-2 ${item.changePercent >= 0 ? 'text-[#39d353]' : 'text-[#f85149]'}`}>
                {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <button className="bg-[#1f6feb] hover:bg-[#2c7fdb] text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors">
        Buy Assets
      </button>
      <button className="bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] px-4 py-3 rounded-lg text-sm font-medium transition-colors">
        Sell Assets
      </button>
      <button className="bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] px-4 py-3 rounded-lg text-sm font-medium transition-colors">
        Transfer
      </button>
      <button className="bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] px-4 py-3 rounded-lg text-sm font-medium transition-colors">
        Reports
      </button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Workspace() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'watchlist'>('portfolio');
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-[#e6edf3] text-xl font-semibold tracking-tight mb-2">Workspace</h2>
        <p className="text-[#8b949e] text-sm">Manage your portfolio and track investments</p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#21262d]">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'portfolio'
              ? 'text-[#e6edf3] border-b-2 border-[#1f6feb]'
              : 'text-[#8b949e] hover:text-[#e6edf3]'
          }`}
        >
          Portfolio
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'watchlist'
              ? 'text-[#e6edf3] border-b-2 border-[#1f6feb]'
              : 'text-[#8b949e] hover:text-[#e6edf3]'
          }`}
        >
          Watchlist
        </button>
      </div>

      {/* Content */}
      <Card className="p-5">
        {activeTab === 'portfolio' ? (
          <div>
            <h3 className="text-[#e6edf3] text-sm font-semibold mb-4">Your Portfolio</h3>
            <PortfolioTable />
          </div>
        ) : (
          <div>
            <h3 className="text-[#e6edf3] text-sm font-semibold mb-4">Watchlist</h3>
            <WatchlistTable />
          </div>
        )}
      </Card>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="p-4">
          <p className="text-[#8b949e] text-xs uppercase tracking-widest font-medium mb-1">Total Value</p>
          <p className="text-[#e6edf3] text-2xl font-light">$91,070</p>
          <p className="text-[#39d353] text-xs mt-1">+2.8% today</p>
        </Card>
        <Card className="p-4">
          <p className="text-[#8b949e] text-xs uppercase tracking-widest font-medium mb-1">Today's Gain/Loss</p>
          <p className="text-[#39d353] text-2xl font-light">+$2,390</p>
          <p className="text-[#39d353] text-xs mt-1">+2.8%</p>
        </Card>
        <Card className="p-4">
          <p className="text-[#8b949e] text-xs uppercase tracking-widest font-medium mb-1">Total Positions</p>
          <p className="text-[#e6edf3] text-2xl font-light">5</p>
          <p className="text-[#8b949e] text-xs mt-1">3 assets</p>
        </Card>
      </div>
    </div>
  );
}