'use client';

import React from 'react';
import { Layers } from 'lucide-react';
import { CoreFeatureItem } from '@/types/project';

interface CoreFeaturesSectionProps {
  features: CoreFeatureItem[];
}

export default function CoreFeaturesSection({ features }: CoreFeaturesSectionProps) {
  if (!features || features.length === 0) return null;

  const complexityConfig = {
    High: { color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
    Medium: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    Low: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
          <Layers className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Core Features</h2>
          <p className="text-xs text-slate-500">{features.length} functional modules to build</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {features.map((feat, idx) => {
          const config = complexityConfig[feat.complexity as keyof typeof complexityConfig] || complexityConfig.Low;
          return (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 hover:border-amber-300 rounded-xl p-4 flex flex-col justify-between group hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-600 text-xs flex items-center justify-center font-mono font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  {feat.title}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-semibold border flex-shrink-0 ${config.bg} ${config.border} ${config.color}`}>
                  {feat.complexity}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pl-8">
                {feat.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
