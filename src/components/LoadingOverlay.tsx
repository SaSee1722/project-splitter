'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, Layers, GitBranch, Check } from 'lucide-react';

interface LoadingOverlayProps {
  projectName: string;
}

const STEPS = [
  { icon: Sparkles, label: 'Connecting to Gemini AI reasoning engine...' },
  { icon: Layers, label: 'Deconstructing problem domain and core features...' },
  { icon: Cpu, label: 'Analyzing screen architecture & identifying missing modules...' },
  { icon: GitBranch, label: 'Balancing team workload and drafting GitHub branch plan...' },
];

export default function LoadingOverlay({ projectName }: LoadingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
        {/* Animated Icon Radar */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-indigo-500/10 border border-indigo-500/30" />
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-zinc-100 tracking-tight mb-1">
          Architecting Blueprint
        </h3>
        <p className="text-xs text-zinc-400 mb-6 font-mono">
          Project: <span className="text-indigo-400 font-semibold">{projectName}</span>
        </p>

        {/* Step list */}
        <div className="space-y-3 text-left bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80 mb-6">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const Icon = step.icon;

            return (
              <div
                key={idx}
                className={`flex items-center space-x-3 text-xs transition-opacity duration-300 ${
                  isCurrent
                    ? 'text-indigo-300 font-medium opacity-100'
                    : isCompleted
                    ? 'text-zinc-400 opacity-90'
                    : 'text-zinc-600 opacity-50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border flex-shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : isCurrent
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400 animate-pulse'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 text-emerald-400" /> : <Icon className="w-3 h-3" />}
                </div>
                <span className="truncate">{step.label}</span>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-zinc-500">
          Enforcing strict JSON schema & equitable developer workload balance.
        </p>
      </div>
    </div>
  );
}
