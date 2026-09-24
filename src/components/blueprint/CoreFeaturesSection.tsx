'use client';

import React from 'react';
import { Layers, ShieldAlert, Zap, Cpu } from 'lucide-react';
import { CoreFeatureItem } from '@/types/project';

interface CoreFeaturesSectionProps {
  features: CoreFeatureItem[];
}

export default function CoreFeaturesSection({ features }: CoreFeaturesSectionProps) {
  if (!features || features.length === 0) return null;

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-md">
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">Core Functional Features</h2>
          <p className="text-xs text-zinc-400">Architectural modules and product requirements identified by AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feat, idx) => {
          const complexityColor =
            feat.complexity === 'High'
              ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
              : feat.complexity === 'Medium'
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
              : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

          return (
            <div
              key={idx}
              className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700/80 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <h3 className="font-semibold text-sm text-zinc-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-zinc-800 text-zinc-400 text-[11px] flex items-center justify-center font-mono font-bold">
                      {idx + 1}
                    </span>
                    {feat.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${complexityColor}`}>
                    {feat.complexity}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{feat.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
