'use client';

import React, { useState } from 'react';
import { GitBranch, GitPullRequest, GitMerge, Copy, Check, Terminal, ExternalLink, HelpCircle } from 'lucide-react';
import { GitHubPlan } from '@/types/project';
import { useToast } from '@/components/Toast';

interface GithubPlanSectionProps {
  githubPlan: GitHubPlan;
}

export default function GithubPlanSection({ githubPlan }: GithubPlanSectionProps) {
  const { showToast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCommand = async (command: string, idx: number) => {
    await navigator.clipboard.writeText(command);
    setCopiedIndex(idx);
    showToast(`Copied: ${command}`, 'success');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-md">
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <GitBranch className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">GitHub Collaboration Plan</h2>
          <p className="text-xs text-zinc-400">Team branching strategy and beginner-friendly Git collaboration lifecycle</p>
        </div>
      </div>

      {/* Recommended Branches */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
          Recommended Feature Branches
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Base main branch */}
          <div className="bg-zinc-950/70 border border-emerald-500/20 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <code className="text-xs font-mono font-bold text-emerald-300">{githubPlan.baseBranch || 'main'}</code>
            </div>
            <span className="text-[11px] text-zinc-400">Protected Production Trunk</span>
          </div>

          {/* Feature branches */}
          {githubPlan.branches.map((branch, idx) => (
            <div
              key={idx}
              className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3.5 flex items-center justify-between hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <GitBranch className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <code className="text-xs font-mono text-zinc-200">{branch.name}</code>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                  {branch.member}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Step Collaboration Lifecycle */}
      <div>
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <GitPullRequest className="w-3.5 h-3.5 text-indigo-400" />
          Beginner-Friendly 7-Step Git Workflow
        </h3>

        <div className="space-y-3">
          {githubPlan.workflowSteps.map((step, idx) => {
            const isCopied = copiedIndex === idx;

            return (
              <div
                key={idx}
                className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 hover:border-zinc-700/80 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-bold flex items-center justify-center">
                      {step.step || idx + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                      {step.phase}
                    </span>
                    <span className="text-xs font-semibold text-zinc-200">— {step.title}</span>
                  </div>
                  <p className="text-xs text-zinc-400 pl-8">{step.description}</p>
                </div>

                {/* Command with copy */}
                <div className="pl-8 md:pl-0 flex items-center space-x-2">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 font-mono text-xs text-zinc-300 max-w-xs md:max-w-md truncate">
                    {step.command}
                  </div>
                  <button
                    onClick={() => handleCopyCommand(step.command, idx)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                    title="Copy Git command"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
