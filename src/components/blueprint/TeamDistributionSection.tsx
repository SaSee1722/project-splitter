'use client';

import React from 'react';
import { Users, Briefcase, CheckCircle, Monitor, BarChart3 } from 'lucide-react';
import { TeamAssignmentItem } from '@/types/project';

interface TeamDistributionSectionProps {
  assignments: TeamAssignmentItem[];
}

export default function TeamDistributionSection({ assignments }: TeamDistributionSectionProps) {
  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-md">
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">Team Workload Distribution</h2>
          <p className="text-xs text-zinc-400">Fair workload division based on developer roles and screen complexity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {assignments.map((assign, idx) => {
          const workload = assign.workloadPercentage || Math.round(100 / assignments.length);

          return (
            <div
              key={idx}
              className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/80 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Member Name & Role */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-zinc-100">{assign.member}</h3>
                    <p className="text-xs text-indigo-400 font-medium flex items-center gap-1.5 mt-0.5">
                      <Briefcase className="w-3 h-3 text-zinc-500" />
                      {assign.role}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-zinc-200">{workload}%</span>
                    <span className="block text-[9px] uppercase tracking-wider text-zinc-500">Share</span>
                  </div>
                </div>

                {/* Workload Progress Bar */}
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-4 border border-zinc-800">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(10, workload))}%` }}
                  />
                </div>

                {/* Assigned Screens */}
                <div className="mb-4">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
                    <Monitor className="w-3 h-3 text-zinc-400" />
                    Assigned Screens ({assign.assignedScreens.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {assign.assignedScreens.map((screen, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-300"
                      >
                        {screen}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Responsibilities */}
                {assign.responsibilities && assign.responsibilities.length > 0 && (
                  <div className="pt-3 border-t border-zinc-900">
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                      Core Responsibilities
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-400">
                      {assign.responsibilities.map((r, rIdx) => (
                        <li key={rIdx} className="flex items-start space-x-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400/70 mt-0.5 flex-shrink-0" />
                          <span className="leading-snug">{r}</span>
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
