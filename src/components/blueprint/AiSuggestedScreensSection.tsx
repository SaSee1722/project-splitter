'use client';

import React from 'react';
import { Sparkles, AlertTriangle, User, CheckCircle2, FileCode, ArrowRight } from 'lucide-react';
import { ScreenItem } from '@/types/project';

interface AiSuggestedScreensSectionProps {
  screens?: ScreenItem[];
}

export default function AiSuggestedScreensSection({ screens }: AiSuggestedScreensSectionProps) {
  // Only render if there are AI suggested missing screens
  if (!screens || screens.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-[#120F24] via-[#0B0F19] to-[#07090E] border-2 border-indigo-500/35 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/25 to-purple-500/20 border border-indigo-400/40 text-indigo-300 flex items-center justify-center shadow-lg shadow-indigo-500/10">
          <Sparkles className="w-5 h-5 text-indigo-300" />
        </div>
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">AI Suggested Missing Screens</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500 text-white uppercase tracking-wider shadow-sm shadow-indigo-500/30">
              AI Added
            </span>
          </div>
          <p className="text-xs text-zinc-300 mt-0.5">
            Gemini noticed these screens were missing from your initial list and automatically added them to keep your app complete.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 relative z-10">
        {screens.map((screen, idx) => (
          <div
            key={idx}
            className="bg-[#070A12]/90 border border-indigo-500/30 hover:border-indigo-400/50 rounded-2xl p-5 sm:p-6 transition-all flex flex-col justify-between group shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Suggested #{idx + 1}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-indigo-200 transition-colors">
                    {screen.name}
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {screen.priority}
                </span>
              </div>

              {/* Developer assignment */}
              <div className="flex items-center space-x-2 text-xs mb-3">
                <span className="text-zinc-500 font-medium">Assigned Developer:</span>
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{screen.assignedMember}</span>
                </span>
              </div>

              {/* File location if present */}
              {screen.assignedFile && (
                <div className="flex items-center space-x-1.5 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-cyan-300 mb-3 truncate">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">{screen.assignedFile}</span>
                </div>
              )}

              {/* Plain English Purpose */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">{screen.purpose}</p>

              {/* Responsibilities / Checklist */}
              {screen.responsibilities && screen.responsibilities.length > 0 && (
                <div className="pt-3 border-t border-zinc-800/80">
                  <span className="text-[10px] font-mono font-semibold text-indigo-300 uppercase tracking-wider block mb-2">
                    Scope of Work
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {screen.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <span className="leading-snug">{resp}</span>
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
