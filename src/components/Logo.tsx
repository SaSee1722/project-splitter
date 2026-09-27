'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export default function Logo({ className = '', size = 'md', showTagline = false }: LogoProps) {
  const iconSizes = {
    sm: 'w-8 h-8',
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
      {/* Modern Icon */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0`}>
        <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200">
          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full p-2"
          >
            <defs>
              <linearGradient id="ps-grad" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {/* Split/fork icon representing project splitting */}
            <path
              d="M18 6 L18 14"
              stroke="url(#ps-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M18 14 L10 22 M18 14 L26 22"
              stroke="url(#ps-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="18" cy="6" r="3" fill="white" opacity="0.95" />
            <circle cx="10" cy="25" r="3" fill="white" opacity="0.85" />
            <circle cx="26" cy="25" r="3" fill="white" opacity="0.85" />
            {/* Sparkle */}
            <circle cx="18" cy="14" r="2" fill="white" opacity="0.7" />
          </svg>
        </div>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-1.5">
          <span className={`font-black tracking-tight text-slate-900 ${textSizes[size]} font-sans`}>
            Project<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Splitter</span>
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest">
            AI
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-500 tracking-tight font-medium hidden sm:block">
            Turn Problems Into Team-Ready Plans
          </span>
        )}
      </div>
    </div>
  );
}
