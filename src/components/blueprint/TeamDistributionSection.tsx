'use client';

import React from 'react';
import { Users, Briefcase, CheckCircle, Monitor, FileCode2, Copy, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { TeamAssignmentItem } from '@/types/project';
import { useToast } from '@/components/Toast';

interface TeamDistributionSectionProps {
  assignments: TeamAssignmentItem[];
}

const avatarGradients = [
  'from-amber-400 to-orange-500',
  'from-indigo-400 to-purple-500',
  'from-cyan-400 to-blue-500',
  'from-emerald-400 to-teal-500',
  'from-rose-400 to-pink-500',
];

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
    <section className="bg-[#0B0F19] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Subtle atmospheric glow */}
      <div className="absolute top-0 right-0 w-80 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner">
          <Users className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Team Workload & File Ownership</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Balanced Distribution
            </span>
          </div>
          <p className="text-xs text-zinc-400">Clear breakdown of what files and screens each team member needs to build</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
        {assignments.map((assign, idx) => {
          const workload = assign.workloadPercentage || Math.round(100 / assignments.length);
          const isCopied = copiedMember === assign.member;
          const gradient = avatarGradients[idx % avatarGradients.length];
          const initials = assign.member
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          return (
            <div
              key={idx}
              className="bg-[#070A12] border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl p-5 sm:p-6 transition-all flex flex-col justify-between group shadow-sm hover:shadow-emerald-950/20"
            >
              <div>
                {/* Member Header with Avatar */}
                <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-zinc-850">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${gradient} p-[1.5px] shadow-sm flex-shrink-0`}>
                      <div className="w-full h-full rounded-[10px] bg-zinc-950 flex items-center justify-center text-xs font-bold text-white">
                        {initials}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                        {assign.member}
                      </h3>
                      <p className="text-xs text-indigo-300 font-medium flex items-center gap-1 mt-0.5">
                        <Briefcase className="w-3 h-3 text-zinc-500" />
                        <span>{assign.role}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {workload}%
                    </span>
                    <span className="block text-[9px] uppercase font-mono tracking-wider text-zinc-500 mt-1">Workload</span>
                  </div>
                </div>

                {/* Workload Progress Bar */}
                <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden mb-5 border border-zinc-800/80">
                  <div
                    className="bg-gradient-to-r from-amber-400 via-indigo-500 to-emerald-400 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(10, workload))}%` }}
                  />
                </div>

                {/* Assigned Screens */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <Monitor className="w-3 h-3 text-cyan-400" />
                    <span>Assigned Screens ({assign.assignedScreens.length})</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {assign.assignedScreens.map((screen, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-200"
                      >
                        {screen}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CRITICAL: Exactly what files they need to work on! */}
                <div className="mb-5 bg-[#0B0F19] p-4 rounded-2xl border border-emerald-500/20 shadow-inner">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                      <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Files To Work On ({assign.assignedFiles?.length || 0})</span>
                    </span>
                    {assign.assignedFiles && assign.assignedFiles.length > 0 && (
                      <button
                        onClick={() => handleCopyFiles(assign.member, assign.assignedFiles)}
                        className="text-[10px] font-medium text-zinc-400 hover:text-white px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex items-center gap-1 transition-colors"
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
                          className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-[11px] text-cyan-300 truncate"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                          <span className="truncate">{file}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-zinc-500 italic">No specific files allocated yet</p>
                    )}
                  </div>
                </div>

                {/* Plain English Responsibilities */}
                {assign.responsibilities && assign.responsibilities.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider block mb-2.5">
                      What You Need To Do
                    </span>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      {assign.responsibilities.map((r, rIdx) => (
                        <li key={rIdx} className="flex items-start space-x-2.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{r}</span>
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
