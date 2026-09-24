'use client';

import React from 'react';
import { GitMerge, ArrowRight, CornerDownRight, Navigation } from 'lucide-react';
import { UserFlowStep } from '@/types/project';

interface UserFlowSectionProps {
  userFlow: UserFlowStep[];
}

export default function UserFlowSection({ userFlow }: UserFlowSectionProps) {
  if (!userFlow || userFlow.length === 0) return null;

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-md">
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Navigation className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">Interactive User Flow</h2>
          <p className="text-xs text-zinc-400">End-to-end screen transition progression across the user journey</p>
        </div>
      </div>

      {/* Visual Sequence */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {userFlow.map((flow, idx) => (
          <div
            key={idx}
            className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between relative group hover:border-cyan-500/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-bold flex items-center justify-center">
                  {flow.step || idx + 1}
                </span>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Step {flow.step || idx + 1}
                </span>
              </div>

              <div className="space-y-2">
                <div className="bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800 text-xs font-medium text-zinc-200">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-0.5">From</span>
                  {flow.from}
                </div>

                <div className="flex items-center justify-center py-1">
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-medium text-indigo-300">
                    <ArrowRight className="w-3 h-3 text-indigo-400" />
                    <span>{flow.action}</span>
                  </div>
                </div>

                <div className="bg-zinc-900/80 p-2.5 rounded-lg border border-cyan-500/20 text-xs font-medium text-cyan-200">
                  <span className="text-[9px] uppercase tracking-wider text-cyan-500 block mb-0.5">To</span>
                  {flow.to}
                </div>
              </div>

              {flow.description && (
                <p className="mt-3 text-[11px] text-zinc-400 leading-normal">
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
