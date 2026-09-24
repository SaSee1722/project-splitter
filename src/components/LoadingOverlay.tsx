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
  { icon: GitBranch, label: 'Balancing team workload and mapping file ownership...' },
];

export default function LoadingOverlay({ projectName }: LoadingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#0B0F19] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Ambient glow accent */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Icon Radar */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-cyan-500/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-indigo-500/10 border border-indigo-500/30" />
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-cyan-500 p-0.5 shadow-xl shadow-indigo-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#07090E] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-300 animate-pulse" />
            </div>
          </div>
        </div>

        <h3 className="text-xl font-black text-white tracking-tight mb-1">
          Architecting Blueprint
        </h3>
        <p className="text-xs text-zinc-400 mb-6 font-mono">
          Project: <span className="text-indigo-400 font-semibold">{projectName}</span>
        </p>

        {/* Step list */}
        <div className="space-y-3 text-left bg-[#070A12] p-4 sm:p-5 rounded-2xl border border-zinc-800/80 mb-6 shadow-inner">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const Icon = step.icon;

            return (
              <div
                key={idx}
                className={`flex items-center space-x-3 text-xs transition-opacity duration-300 ${
                  isCurrent
                    ? 'text-indigo-300 font-semibold opacity-100'
                    : isCompleted
                    ? 'text-zinc-400 opacity-90'
                    : 'text-zinc-600 opacity-40'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs border flex-shrink-0 transition-all ${
                    isCompleted
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : isCurrent
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400 animate-pulse'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Icon className="w-3.5 h-3.5" />}
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
