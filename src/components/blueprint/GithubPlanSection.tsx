'use client';

import React, { useState } from 'react';
import { GitBranch, GitPullRequest, GitMerge, Copy, Check, Terminal, ExternalLink, HelpCircle, ShieldCheck } from 'lucide-react';
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
    <section className="bg-[#0B0F19] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Atmospheric ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-inner">
          <GitBranch className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">GitHub Collaboration Plan</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Branching & PR Strategy
            </span>
          </div>
          <p className="text-xs text-zinc-400">Step-by-step Git workflow to avoid merge conflicts and keep code clean</p>
        </div>
      </div>

      {/* Recommended Branches */}
      <div className="mb-8 relative z-10">
        <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-3.5 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <span>Recommended Feature Branches</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Base main branch */}
          <div className="bg-[#070A12] border border-emerald-500/25 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Production Trunk</span>
                <code className="text-xs font-mono font-bold text-emerald-300">{githubPlan.baseBranch || 'main'}</code>
              </div>
            </div>
            <span className="text-[11px] font-mono text-emerald-400/90 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Protected
            </span>
          </div>

          {/* Feature branches */}
          {githubPlan.branches.map((branch, idx) => (
            <div
              key={idx}
              className="bg-[#070A12] border border-zinc-800/80 hover:border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <GitBranch className="w-4 h-4 text-indigo-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Assigned Developer</span>
                  <code className="text-xs font-mono text-zinc-200 group-hover:text-indigo-200 transition-colors">
                    {branch.name}
                  </code>
                </div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold">
                {branch.member}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Step Collaboration Lifecycle */}
      <div className="relative z-10">
        <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <GitPullRequest className="w-4 h-4 text-indigo-400" />
          <span>Beginner-Friendly 7-Step Git Workflow</span>
        </h3>

        <div className="space-y-3">
          {githubPlan.workflowSteps.map((step, idx) => {
            const isCopied = copiedIndex === idx;

            return (
              <div
                key={idx}
                className="bg-[#070A12] border border-zinc-800/80 hover:border-indigo-500/30 rounded-2xl p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-mono font-bold flex items-center justify-center">
                      0{step.step || idx + 1}
                    </span>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-300">
                      {step.phase}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-zinc-200">— {step.title}</span>
                  </div>
                  <p className="text-xs text-zinc-400 pl-8 leading-relaxed">{step.description}</p>
                </div>

                {/* Command with copy */}
                <div className="pl-8 md:pl-0 flex items-center space-x-2">
                  <div className="bg-zinc-950 border border-zinc-800/90 rounded-xl px-3.5 py-2 font-mono text-xs text-indigo-200 max-w-xs md:max-w-md truncate shadow-inner">
                    {step.command}
                  </div>
                  <button
                    onClick={() => handleCopyCommand(step.command, idx)}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
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
