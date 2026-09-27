'use client';

import React, { useState } from 'react';
import { TeamAssignmentItem } from '@/types/project';
import { Users, Copy, CheckCircle2, FileCode2, Monitor, ChevronDown, ChevronUp, Terminal, Shield, Eye } from 'lucide-react';
import { useToast } from '@/components/Toast';

interface TeamDistributionSectionProps {
  assignments: TeamAssignmentItem[];
}

const MEMBER_COLORS = [
  { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-600', bar: 'from-indigo-500 to-violet-500', accent: 'text-indigo-600' },
  { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', badge: 'bg-violet-600', bar: 'from-violet-500 to-purple-500', accent: 'text-violet-600' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-600', bar: 'from-emerald-500 to-teal-500', accent: 'text-emerald-600' },
  { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-600', bar: 'from-amber-500 to-orange-500', accent: 'text-amber-600' },
  { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-600', bar: 'from-rose-500 to-pink-500', accent: 'text-rose-600' },
  { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', badge: 'bg-sky-600', bar: 'from-sky-500 to-blue-500', accent: 'text-sky-600' },
];

export default function TeamDistributionSection({ assignments }: TeamDistributionSectionProps) {
  const { showToast } = useToast();
  const [expandedMember, setExpandedMember] = useState<string | null>(assignments[0]?.member || null);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const getInitials = (name: string) =>
    name.split(' ').filter(Boolean).map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  const handleCopyPrompt = async (member: string, prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(member);
      showToast(`AI prompt for ${member} copied!`, 'success');
      setTimeout(() => setCopiedPrompt(null), 2500);
    } catch {
      showToast('Copy failed.', 'error');
    }
  };

  const handleCopyFiles = async (member: string, files: string[]) => {
    try {
      await navigator.clipboard.writeText(files.join('\n'));
      showToast(`${member}'s file list copied!`, 'success');
    } catch {
      showToast('Copy failed.', 'error');
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center">
            <Users className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Team Distribution</h3>
            <p className="text-sm text-slate-500">File ownership, responsibilities & AI coding prompts</p>
          </div>
        </div>
      </div>

      {/* Workload overview */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-200">
        <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">Workload Overview</p>
        <div className="space-y-3">
          {assignments.map((assignment, idx) => {
            const colors = MEMBER_COLORS[idx % MEMBER_COLORS.length];
            const pct = assignment.workloadPercentage || Math.round(100 / assignments.length);
            return (
              <div key={assignment.member} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-xs font-bold font-mono ${colors.text}`}>{getInitials(assignment.member)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800">{assignment.member}</span>
                    <span className={`font-mono font-bold ${colors.accent}`}>{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className={`text-xs px-2 py-0.5 rounded-lg ${colors.bg} ${colors.border} border ${colors.text} font-mono`}>
                    {assignment.assignedFiles.length} files
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Member detail cards */}
      <div className="p-6 space-y-3">
        {assignments.map((assignment, idx) => {
          const colors = MEMBER_COLORS[idx % MEMBER_COLORS.length];
          const isExpanded = expandedMember === assignment.member;

          return (
            <div key={assignment.member} className={`border ${isExpanded ? `border-${colors.accent.replace('text-', '')} bg-slate-50` : 'border-slate-200 bg-white'} rounded-xl overflow-hidden transition-all`}>
              {/* Collapsed header - always visible */}
              <button
                onClick={() => setExpandedMember(isExpanded ? null : assignment.member)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-sm font-bold font-mono ${colors.text}`}>{getInitials(assignment.member)}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-slate-900 text-sm">{assignment.member}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-lg ${colors.bg} border ${colors.border} ${colors.text} font-medium`}>
                        {assignment.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {assignment.assignedScreens.length} screens • {assignment.assignedFiles.length} files
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="border-t border-slate-200 p-4 space-y-4 animate-fade-in">
                  {/* Responsibilities */}
                  {assignment.responsibilities.length > 0 && (
                    <div>
                      <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Responsibilities</p>
                      <ul className="space-y-1">
                        {assignment.responsibilities.map((r, rIdx) => (
                          <li key={rIdx} className="flex items-start space-x-2 text-sm text-slate-700">
                            <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold ${colors.bg} ${colors.text} border ${colors.border} flex-shrink-0 mt-0.5`}>
                              {rIdx + 1}
                            </span>
                            <span className="leading-relaxed">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Assigned Screens */}
                  {assignment.assignedScreens.length > 0 && (
                    <div>
                      <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Assigned Screens</p>
                      <div className="flex flex-wrap gap-1.5">
                        {assignment.assignedScreens.map((screen, sIdx) => (
                          <span key={sIdx} className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg ${colors.bg} border ${colors.border} ${colors.text} font-medium`}>
                            <Monitor className="w-3 h-3" />
                            {screen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* File Ownership */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Files You Own</p>
                      <button
                        onClick={() => handleCopyFiles(assignment.member, assignment.assignedFiles)}
                        className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy list
                      </button>
                    </div>
                    <div className="bg-slate-900 rounded-xl p-3 max-h-48 overflow-y-auto">
                      {assignment.assignedFiles.map((file, fIdx) => (
                        <div key={fIdx} className="flex items-center space-x-2 py-0.5">
                          <FileCode2 className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                          <span className="text-xs font-mono text-emerald-400">{file}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Read-only files */}
                  {assignment.readOnlyFiles && assignment.readOnlyFiles.length > 0 && (
                    <div>
                      <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-blue-500" />
                        Read Only Files
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        {assignment.readOnlyFiles.map((file, fIdx) => (
                          <div key={fIdx} className="text-xs font-mono text-blue-700 py-0.5">{file}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Do not modify */}
                  {assignment.doNotModifyFiles && assignment.doNotModifyFiles.length > 0 && (
                    <div>
                      <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-rose-500" />
                        Do NOT Modify
                      </p>
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                        {assignment.doNotModifyFiles.map((file, fIdx) => (
                          <div key={fIdx} className="text-xs font-mono text-rose-700 py-0.5">{file}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Coding Prompt */}
                  {assignment.aiCodingPrompt && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-violet-500" />
                          AI Coding Prompt (Copy to Cursor/Claude)
                        </p>
                        <button
                          onClick={() => handleCopyPrompt(assignment.member, assignment.aiCodingPrompt!)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            copiedPrompt === assignment.member
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                              : 'bg-violet-50 border border-violet-200 text-violet-700 hover:bg-violet-100'
                          }`}
                        >
                          {copiedPrompt === assignment.member ? (
                            <><CheckCircle2 className="w-3.5 h-3.5" /> Copied!</>
                          ) : (
                            <><Copy className="w-3.5 h-3.5" /> Copy Prompt</>
                          )}
                        </button>
                      </div>
                      <div className="bg-slate-900 rounded-xl p-4 max-h-72 overflow-y-auto">
                        <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">{assignment.aiCodingPrompt}</pre>
                      </div>
                      <p className="mt-2 text-xs text-slate-400">
                        Paste this into Cursor, Claude Code, Antigravity, or any AI coding IDE.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
