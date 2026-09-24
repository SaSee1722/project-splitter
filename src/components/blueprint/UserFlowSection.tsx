'use client';

import React from 'react';
import { Navigation, ArrowRight, CornerDownRight } from 'lucide-react';
import { UserFlowStep } from '@/types/project';

interface UserFlowSectionProps {
  userFlow: UserFlowStep[];
}

export default function UserFlowSection({ userFlow }: UserFlowSectionProps) {
  if (!userFlow || userFlow.length === 0) return null;

  return (
    <section className="bg-[#0B0F19] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Subtle atmospheric glow */}
      <div className="absolute top-0 right-0 w-72 h-44 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-sky-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-inner">
          <Navigation className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Interactive User Flow</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {userFlow.length} Key Transitions
            </span>
          </div>
          <p className="text-xs text-zinc-400">Step-by-step navigation progression across the user journey</p>
        </div>
      </div>

      {/* Visual Sequence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {userFlow.map((flow, idx) => (
          <div
            key={idx}
            className="bg-[#070A12] border border-zinc-800/80 hover:border-cyan-500/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative group transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono font-bold flex items-center justify-center">
                  0{flow.step || idx + 1}
                </span>
                <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">
                  Step {flow.step || idx + 1}
                </span>
              </div>

              <div className="space-y-2">
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/90 text-xs font-semibold text-zinc-200">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">From Screen</span>
                  <span className="truncate block">{flow.from}</span>
                </div>

                <div className="flex items-center justify-center py-1">
                  <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-[11px] font-medium text-indigo-300 shadow-sm">
                    <ArrowRight className="w-3 h-3 text-indigo-400" />
                    <span>{flow.action}</span>
                  </div>
                </div>

                <div className="bg-zinc-950 p-3 rounded-xl border border-cyan-500/30 text-xs font-semibold text-cyan-200">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-cyan-400 block mb-1">To Screen</span>
                  <span className="truncate block">{flow.to}</span>
                </div>
              </div>

              {flow.description && (
                <p className="mt-3.5 text-xs text-zinc-400 leading-relaxed">
                  {flow.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
