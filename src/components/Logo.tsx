'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export default function Logo({ className = '', size = 'md', showTagline = false }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
  };

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* Precision Geometric Forge + AI Crystal SVG */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 group`}>
        {/* Ambient atmospheric glow */}
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-500/20 via-indigo-500/25 to-cyan-500/20 blur-md opacity-75 group-hover:opacity-100 transition-opacity" />

        {/* Outer Frame with beveled metallic border */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-b from-zinc-800 to-zinc-950 p-[1px] shadow-xl">
          <div className="w-full h-full rounded-[11px] bg-gradient-to-br from-[#0c101c] via-[#090d16] to-[#04060a] flex items-center justify-center overflow-hidden">
            {/* Custom SVG: The Anvil & The Spark */}
            <svg
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full p-1.5"
            >
              <defs>
                {/* Forge Amber/Orange to AI Indigo/Cyan Gradients */}
                <linearGradient id="tf-forge-grad" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="45%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
                <linearGradient id="tf-flame-grad" x1="18" y1="6" x2="18" y2="24" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="50%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
                <filter id="tf-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Anvil Base Structure */}
              <path
                d="M7 27C7 25.8954 7.89543 25 9 25H27C28.1046 25 29 25.8954 29 27C29 28.1046 28.1046 29 27 29H9C7.89543 29 7 28.1046 7 27Z"
                fill="#334155"
                opacity="0.9"
              />
              <path
                d="M11 25L14 18H22L25 25H11Z"
                fill="#1E293B"
              />

              {/* Upper Anvil Horn & Face */}
              <path
                d="M5 14C5 12.8954 5.89543 12 7 12H27C28.6569 12 30 13.3431 30 15C30 16.6569 28.6569 18 27 18H8C6.34315 18 5 16.6569 5 15V14Z"
                fill="url(#tf-forge-grad)"
              />

              {/* The AI Intelligence Spark / Diamond Core */}
              <polygon
                points="18,5 22,12 18,17 14,12"
                fill="url(#tf-flame-grad)"
                filter="url(#tf-glow)"
              />
              <circle cx="18" cy="12" r="1.5" fill="#FFFFFF" />

              {/* Connecting circuit lines */}
              <line x1="18" y1="18" x2="18" y2="24" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
              <circle cx="18" cy="24" r="1.5" fill="#06B6D4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Typography Brand Mark */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-1.5">
          <span className={`font-black tracking-tight text-white ${textSizes[size]} font-sans`}>
            Team<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-300 to-cyan-400">Forge</span>
          </span>
          <span className="px-1.5 py-0.2 rounded-md bg-gradient-to-r from-amber-500/15 to-indigo-500/15 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest shadow-sm">
            AI
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-zinc-400 tracking-tight font-medium hidden sm:block">
            Turn Ideas Into Team-Ready Projects
          </span>
        )}
      </div>
    </div>
  );
}
