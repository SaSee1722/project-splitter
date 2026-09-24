'use client';

import React from 'react';
import { Monitor, User, CheckCircle2, FileCode } from 'lucide-react';
import { ScreenItem } from '@/types/project';

interface ScreenArchitectureSectionProps {
  screens: ScreenItem[];
}

export default function ScreenArchitectureSection({ screens }: ScreenArchitectureSectionProps) {
  return (
    <section className="bg-[#0B0F19] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Subtle atmospheric glow */}
      <div className="absolute top-0 right-0 w-72 h-44 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shadow-inner">
          <Monitor className="w-5 h-5 text-sky-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Screen Architecture & File Locations</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
              {screens.length} Screens
            </span>
          </div>
          <p className="text-xs text-zinc-400">Every planned screen mapped to its exact starter file and responsible developer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {screens.map((screen, idx) => {
          const priorityStyle =
            screen.priority.toLowerCase().includes('must')
              ? 'text-rose-300 bg-rose-500/10 border-rose-500/30'
              : screen.priority.toLowerCase().includes('should')
              ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
              : 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30';

          return (
            <div
              key={idx}
              className="bg-[#070A12] border border-zinc-800/80 hover:border-sky-500/30 rounded-2xl p-5 sm:p-6 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                {/* Header: Name & Priority */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-bold text-sm sm:text-base text-zinc-100 group-hover:text-sky-300 transition-colors">
                    {screen.name}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border uppercase tracking-wider ${priorityStyle}`}>
                    {screen.priority}
                  </span>
                </div>

                {/* Developer assignment pill */}
                <div className="flex items-center space-x-2 text-xs mb-3">
                  <span className="text-zinc-500 font-medium">Assigned:</span>
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold text-xs">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{screen.assignedMember}</span>
                  </span>
                </div>

                {/* Assigned File path */}
                {screen.assignedFile && (
                  <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/90 text-xs font-mono text-cyan-300 mb-3 truncate">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{screen.assignedFile}</span>
                  </div>
                )}

                {/* Purpose in Plain English */}
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">{screen.purpose}</p>

                {/* Responsibilities list */}
                {screen.responsibilities && screen.responsibilities.length > 0 && (
                  <div className="pt-3 border-t border-zinc-850">
                    <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                      Tasks to Complete
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {screen.responsibilities.map((resp, rIdx) => (
                        <li key={rIdx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className="leading-snug">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
