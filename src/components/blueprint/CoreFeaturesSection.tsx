'use client';

import React from 'react';
import { Layers, ShieldAlert, Zap, Cpu, CheckCircle } from 'lucide-react';
import { CoreFeatureItem } from '@/types/project';

interface CoreFeaturesSectionProps {
  features: CoreFeatureItem[];
}

export default function CoreFeaturesSection({ features }: CoreFeaturesSectionProps) {
  if (!features || features.length === 0) return null;

  return (
    <section className="bg-[#0B0F19] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Subtle atmospheric glow */}
      <div className="absolute top-0 right-0 w-72 h-44 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
          <Layers className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Core Functional Features</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {features.length} Modules
            </span>
          </div>
          <p className="text-xs text-zinc-400">Essential product capabilities and user features to build</p>
        </div>
      </div>

      {/* Grid of features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {features.map((feat, idx) => {
          const complexityColor =
            feat.complexity === 'High'
              ? 'text-rose-300 bg-rose-500/10 border-rose-500/30'
              : feat.complexity === 'Medium'
              ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
              : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30';

          return (
            <div
              key={idx}
              className="bg-[#070A12] border border-zinc-800/80 hover:border-amber-500/30 rounded-2xl p-5 sm:p-6 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-sm sm:text-base text-zinc-100 group-hover:text-amber-300 transition-colors flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-zinc-800/80 text-zinc-300 text-xs flex items-center justify-center font-mono font-bold border border-zinc-700/50">
                      {idx + 1}
                    </span>
                    <span>{feat.title}</span>
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${complexityColor}`}>
                    {feat.complexity}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pl-8">
                  {feat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
