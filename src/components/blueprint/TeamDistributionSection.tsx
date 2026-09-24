'use client';

import React from 'react';
import { Users, Briefcase, CheckCircle, Monitor, FileCode2, Copy, Check } from 'lucide-react';
import { TeamAssignmentItem } from '@/types/project';
import { useToast } from '@/components/Toast';

interface TeamDistributionSectionProps {
  assignments: TeamAssignmentItem[];
}

export default function TeamDistributionSection({ assignments }: TeamDistributionSectionProps) {
  const { showToast } = useToast();
  const [copiedMember, setCopiedMember] = React.useState<string | null>(null);

  const handleCopyFiles = async (member: string, files: string[]) => {
    await navigator.clipboard.writeText(files.join('\n'));
    setCopiedMember(member);
    showToast(`Copied file list for ${member}!`, 'success');
    setTimeout(() => setCopiedMember(null), 2000);
  };

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-md">
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">Team Workload & File Ownership</h2>
          <p className="text-xs text-zinc-400">Clear breakdown of what files and screens each team member needs to build</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assignments.map((assign, idx) => {
          const workload = assign.workloadPercentage || Math.round(100 / assignments.length);
          const isCopied = copiedMember === assign.member;

          return (
            <div
              key={idx}
              className="bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-5 hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Member Header */}
                <div className="flex items-start justify-between gap-2 mb-3 pb-3 border-b border-zinc-900">
                  <div>
                    <h3 className="font-bold text-base text-zinc-100">{assign.member}</h3>
                    <p className="text-xs text-indigo-400 font-medium flex items-center gap-1.5 mt-0.5">
                      <Briefcase className="w-3 h-3 text-zinc-500" />
                      {assign.role}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-zinc-200">{workload}%</span>
                    <span className="block text-[9px] uppercase tracking-wider text-zinc-500">Workload</span>
                  </div>
                </div>

                {/* Workload Meter */}
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-4 border border-zinc-800">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(10, workload))}%` }}
                  />
                </div>

                {/* Assigned Screens */}
                <div className="mb-4">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <Monitor className="w-3 h-3 text-cyan-400" />
                    Assigned Screens ({assign.assignedScreens.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {assign.assignedScreens.map((screen, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-200"
                      >
                        {screen}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CRITICAL: Exactly what files they need to work on! */}
                <div className="mb-4 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileCode2 className="w-3.5 h-3.5" />
                      Files To Work On ({assign.assignedFiles?.length || 0})
                    </span>
                    {assign.assignedFiles && assign.assignedFiles.length > 0 && (
                      <button
                        onClick={() => handleCopyFiles(assign.member, assign.assignedFiles)}
                        className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
                        title="Copy file paths"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    {assign.assignedFiles && assign.assignedFiles.length > 0 ? (
                      assign.assignedFiles.map((file, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center space-x-1.5 px-2 py-1 rounded bg-zinc-950 border border-zinc-800/80 font-mono text-[11px] text-indigo-300 truncate"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                          <span className="truncate">{file}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-zinc-500 italic">No specific files allocated yet</p>
                    )}
                  </div>
                </div>

                {/* Responsibilities in Plain English */}
                {assign.responsibilities && assign.responsibilities.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                      What You Need To Do
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {assign.responsibilities.map((r, rIdx) => (
                        <li key={rIdx} className="flex items-start space-x-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
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
