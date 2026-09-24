'use client';

import React from 'react';
import { Sparkles, UserCheck, Compass } from 'lucide-react';
import { ProjectBlueprint } from '@/types/project';

interface AiSummarySectionProps {
  blueprint: ProjectBlueprint;
}

export default function AiSummarySection({ blueprint }: AiSummarySectionProps) {
  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-md">
      <div className="flex items-center space-x-2.5 mb-4">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">AI Project Architectural Summary</h2>
          <p className="text-xs text-zinc-400">Gemini deconstruction of problem domain, objectives & personas</p>
        </div>
      </div>

      <div className="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed mb-6 bg-zinc-950/50 p-5 rounded-xl border border-zinc-800/80">
        <p className="whitespace-pre-line">{blueprint.projectOverview}</p>
      </div>

      {blueprint.targetUsers && blueprint.targetUsers.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            Target User Personas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {blueprint.targetUsers.map((persona, idx) => (
              <div
                key={idx}
                className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3.5 flex items-start space-x-3 text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                  {idx + 1}
                </div>
                <span className="text-zinc-200 font-medium">{persona}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
