'use client';

import React from 'react';
import { Sparkles, UserCheck, Compass, Target, ArrowRight } from 'lucide-react';
import { ProjectBlueprint } from '@/types/project';

interface AiSummarySectionProps {
  blueprint: ProjectBlueprint;
}

export default function AiSummarySection({ blueprint }: AiSummarySectionProps) {
  return (
    <section className="bg-[#0B0F19] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Ambient background accent */}
      <div className="absolute top-0 right-0 w-80 h-48 bg-gradient-to-bl from-indigo-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-inner">
          <Sparkles className="w-5 h-5 text-indigo-300" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">AI Project Architectural Summary</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Plain English Analysis
            </span>
          </div>
          <p className="text-xs text-zinc-400">Gemini breakdown of the core problem, user goals, and target personas</p>
        </div>
      </div>

      {/* Overview Body */}
      <div className="relative z-10 mb-6 bg-[#070A12] p-5 sm:p-6 rounded-2xl border border-zinc-800/80 shadow-inner">
        <div className="flex items-center space-x-2 mb-3 text-xs font-mono font-semibold text-indigo-300 uppercase tracking-wider">
          <Target className="w-3.5 h-3.5 text-indigo-400" />
          <span>Executive Overview & Product Vision</span>
        </div>
        <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-line font-normal">
          {blueprint.projectOverview}
        </p>
      </div>

      {/* User Personas */}
      {blueprint.targetUsers && blueprint.targetUsers.length > 0 && (
        <div className="relative z-10 pt-2">
          <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-3.5 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>Target User Personas ({blueprint.targetUsers.length})</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {blueprint.targetUsers.map((persona, idx) => (
              <div
                key={idx}
                className="bg-[#070A12] border border-zinc-800/80 hover:border-cyan-500/30 rounded-2xl p-4 flex items-start space-x-3 text-xs transition-all group"
              >
                <div className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                  0{idx + 1}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">User Persona</span>
                  <span className="text-zinc-100 font-medium text-xs leading-snug">{persona}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
