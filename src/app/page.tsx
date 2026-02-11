'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    chains: 0,
    transactions: 0,
    tvl: 0
  });

  useEffect(() => {
    setMounted(true);
    
    // Animate stats
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setStats({
        chains: Math.floor(42 * progress),
        transactions: Math.floor(2100000 * progress),
        tvl: Math.floor(1720000000 * progress)
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(#EFDB00 1px, transparent 1px),
            linear-gradient(90deg, #EFDB00 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center center'
        }} />
      </div>

      {/* Crosshair decorations */}
      <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-[#EFDB00]/30" />
      <div className="absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-[#EFDB00]/30" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-l-2 border-b-2 border-[#EFDB00]/30" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-[#EFDB00]/30" />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-12 py-6 border-b border-[#EFDB00]/10">
       <div className="flex items-center gap-3">
          {/* Custom Logo */}
          <Image 
            src="/Invyno.png" 
            alt="Invyno Logo" 
            width={40} 
            height={40}
            className="w-10 h-10"
          />
          <span className="text-xl font-light tracking-tight">Invyno</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="#" className="text-gray-400 hover:text-[#EFDB00] transition-colors tracking-wider">INVESTORS</a>
          <a href="#" className="text-gray-400 hover:text-[#EFDB00] transition-colors tracking-wider">ANALYTICS</a>
          <a href="#" className="text-gray-400 hover:text-[#EFDB00] transition-colors tracking-wider">PRICING</a>
        </div>
        
        <button className="px-6 py-2 border border-[#EFDB00] text-[#EFDB00] hover:bg-[#EFDB00] hover:text-black text-sm tracking-wider cursor-pointer">
          Get Started
        </button>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-12 pt-20 pb-16 flex items-start justify-between">
        {/* Left Content */}
        <div className={`w-1/2 space-y-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block">
            <div className="text-xs tracking-[0.3em] text-[#EFDB00] font-light mb-2">
              Layer-0 connectivity —
            </div>
          </div>
          
          <h1 className="text-7xl font-light leading-tight tracking-tight">
            The Investment
            <br />
            <span className="font-normal">Layer for All</span>
            <br />
            <span className="font-normal">Portfolios</span>
          </h1>
          
          <p className="text-lg text-gray-400 leading-relaxed max-w-xl font-light">
            Fast, verifiable, and trust-minimized investment management. Bridge assets, 
            route capital, and confirm returns — without traditional intermediaries.
          </p>
          
          <div className="flex items-center gap-4 pt-4">
            <button className="px-8 py-3 border border-[#EFDB00]/30 text-white hover:border-[#EFDB00] text-sm tracking-wider cursor-pointer">
              Read Docs
            </button>
            <button className="px-8 py-3 bg-[#EFDB00] text-black hover:bg-[#EFDB00]/90 transition-all duration-300 text-sm font-medium tracking-wider cursor-pointer shadow-lg shadow-[#EFDB00]/20">
              Launch Demo
            </button>
          </div>
          
          {/* Partner Logos */}
          <div className="flex items-center gap-8 pt-8 opacity-50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#EFDB00]/20 rounded" />
              <span className="text-xs tracking-wider text-gray-500">ETHEREUM</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#EFDB00]/20 rounded-full" />
              <span className="text-xs tracking-wider text-gray-500">POLYGON</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#EFDB00]/20" />
              <span className="text-xs tracking-wider text-gray-500">ARBITRUM</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#EFDB00]/20 rounded-full" />
              <span className="text-xs tracking-wider text-gray-500">OPTIMISM</span>
            </div>
          </div>
        </div>

        {/* Right Visual - Dot Matrix Globe */}
        <div className={`w-1/2 flex flex-col items-end transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-4 text-xs tracking-[0.3em] text-[#EFDB00] text-right">
            ALL SYSTEMS OPERATIONAL
          </div>
          
          
          {/* Stats */}
          <div className="flex gap-12 mt-8">
            <div className="text-right">
              <div className="text-xs tracking-[0.2em] text-gray-500 mb-1">CONNECTED CHAINS</div>
              <div className="text-4xl font-light text-[#EFDB00] tabular-nums">
                {stats.chains}
                <span className="text-2xl">_</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xs tracking-[0.2em] text-gray-500 mb-1">TRANSACTIONS PROCESSED</div>
              <div className="text-4xl font-light text-[#EFDB00] tabular-nums">
                {(stats.transactions / 1000000).toFixed(1)}M
                <span className="text-2xl">_</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xs tracking-[0.2em] text-gray-500 mb-1">TOTAL VALUE LOCKED</div>
              <div className="text-4xl font-light text-[#EFDB00] tabular-nums">
                ${(stats.tvl / 1000000000).toFixed(2)}B
                <span className="text-2xl">_</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Status indicator */}
      <div className="absolute bottom-8 left-12 flex items-center gap-3 text-xs tracking-wider text-gray-500">
        <div className="w-2 h-2 bg-[#EFDB00] rounded-full animate-pulse" />
        NETWORK STATUS: ACTIVE
      </div>

    </div>
  );
}