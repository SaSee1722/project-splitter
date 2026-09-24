'use client';

import React from 'react';
import { Monitor, User, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';
import { ScreenItem } from '@/types/project';

interface ScreenArchitectureSectionProps {
  screens: ScreenItem[];
}

export default function ScreenArchitectureSection({ screens }: ScreenArchitectureSectionProps) {
  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-md">
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
          <Monitor className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">Screen Architecture & Ownership</h2>
          <p className="text-xs text-zinc-400">Strict one-to-one developer allocation with clear functional scope</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {screens.map((screen, idx) => {
          const priorityStyle =
            screen.priority.toLowerCase().includes('must')
              ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
              : screen.priority.toLowerCase().includes('should')
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
              : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';

          return (
            <div
              key={idx}
              className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/80 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Name & Priority */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm text-zinc-100">{screen.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider ${priorityStyle}`}>
                    {screen.priority}
                  </span>
                </div>

                {/* Developer assignment pill */}
                <div className="flex items-center space-x-2 text-xs mb-3">
                  <span className="text-zinc-500 font-medium">Assigned:</span>
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 font-medium text-[11px]">
                    <User className="w-3 h-3 text-indigo-400" />
                    <span>{screen.assignedMember}</span>
                  </span>
                </div>

                {/* Purpose */}
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">{screen.purpose}</p>

                {/* Responsibilities list */}
                {screen.responsibilities && screen.responsibilities.length > 0 && (
                  <div className="pt-3 border-t border-zinc-900">
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                      Key Deliverables
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {screen.responsibilities.map((resp, rIdx) => (
                        <li key={rIdx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                          <span className="leading-snug text-zinc-300">{resp}</span>
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
