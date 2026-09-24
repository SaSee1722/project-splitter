'use client';

import React from 'react';
import { Sparkles, AlertTriangle, User, CheckCircle2 } from 'lucide-react';
import { ScreenItem } from '@/types/project';

interface AiSuggestedScreensSectionProps {
  screens?: ScreenItem[];
}

export default function AiSuggestedScreensSection({ screens }: AiSuggestedScreensSectionProps) {
  // Only render if there are AI suggested missing screens
  if (!screens || screens.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-zinc-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Decorative subtle glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center space-x-2.5 mb-2 relative z-10">
        <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-zinc-100 tracking-tight">AI Suggested Screens</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500 text-white uppercase tracking-wider animate-pulse">
              AI Suggested
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Gemini identified these essential architectural screens as missing from your initial plan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 relative z-10">
        {screens.map((screen, idx) => (
          <div
            key={idx}
            className="bg-zinc-950/80 border border-indigo-500/25 rounded-xl p-5 hover:border-indigo-400/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Suggested #{idx + 1}
                  </span>
                  <h3 className="font-semibold text-sm text-zinc-100">{screen.name}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {screen.priority}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs mb-3">
                <span className="text-zinc-500 font-medium">Recommended Owner:</span>
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 text-[11px]">
                  <User className="w-3 h-3 text-cyan-400" />
                  <span>{screen.assignedMember}</span>
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed mb-4">{screen.purpose}</p>

              {screen.responsibilities && screen.responsibilities.length > 0 && (
                <div className="pt-3 border-t border-zinc-900">
                  <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block mb-2">
                    Scope of Work
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {screen.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <span className="leading-snug text-zinc-300">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
