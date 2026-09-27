'use client';

import React, { useState } from 'react';
import { GitHubPlan } from '@/types/project';
import { GitBranch, GitMerge, Copy, CheckCircle2, Terminal } from 'lucide-react';
import { useToast } from '@/components/Toast';

interface GitHubPlanSectionProps {
  githubPlan: GitHubPlan;
}

const BRANCH_COLORS = [
  { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', dot: 'bg-violet-500' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' },
  { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', dot: 'bg-sky-500' },
];

export default function GithubPlanSection({ githubPlan }: GitHubPlanSectionProps) {
  const { showToast } = useToast();
  const [copiedBranch, setCopiedBranch] = useState<string | null>(null);

  const handleCopyBranch = async (branchName: string) => {
    try {
      await navigator.clipboard.writeText(`git checkout -b ${branchName}`);
      setCopiedBranch(branchName);
      showToast(`Branch checkout command copied!`, 'success');
      setTimeout(() => setCopiedBranch(null), 2500);
    } catch {
      showToast('Copy failed.', 'error');
    }
  };

  const handleCopyAllBranches = async () => {
    const commands = githubPlan.branches.map(
      (b) => `git checkout -b ${b.name}`
    ).join('\n');
    try {
      await navigator.clipboard.writeText(commands);
      showToast('All branch commands copied!', 'success');
    } catch {
      showToast('Copy failed.', 'error');
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">GitHub Collaboration Plan</h3>
              <p className="text-sm text-slate-500">
                {githubPlan.branches.length} feature branches · Base: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">{githubPlan.baseBranch}</code>
              </p>
            </div>
          </div>
          <button
            onClick={handleCopyAllBranches}
            className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 text-sm font-medium transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Copy All</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Branch List */}
        <div>
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">Feature Branches</p>
          <div className="space-y-2">
            {githubPlan.branches.map((branch, idx) => {
              const colors = BRANCH_COLORS[idx % BRANCH_COLORS.length];
              const isCopied = copiedBranch === branch.name;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-xl border ${colors.bg} ${colors.border} group hover:shadow-sm transition-all`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${colors.dot} flex-shrink-0`} />
                    <div className="min-w-0">
                      <p className={`text-xs font-mono font-semibold ${colors.text} truncate`}>
                        {branch.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{branch.member} — {branch.purpose}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyBranch(branch.name)}
                    className={`flex items-center space-x-1.5 ml-2 px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 transition-all ${
                      isCopied
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                        : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {isCopied ? (
                      <><CheckCircle2 className="w-3 h-3" /><span>Copied!</span></>
                    ) : (
                      <><Copy className="w-3 h-3" /><span>Checkout</span></>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7-Step Workflow */}
        {githubPlan.workflowSteps && githubPlan.workflowSteps.length > 0 && (
          <div>
            <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-4">Conflict-Free Workflow</p>
            <div className="space-y-2">
              {githubPlan.workflowSteps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-mono font-bold">{step.step}</span>
                  </div>
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-slate-900">{step.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono">
                        {step.phase}
                      </span>
                    </div>
                    {step.command && (
                      <div className="bg-slate-900 rounded-lg px-3 py-1.5 mb-2 font-mono text-xs text-emerald-400">
                        $ {step.command}
                      </div>
                    )}
                    <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
