'use client';

import React from 'react';
import { Sparkles, UserCheck, Target } from 'lucide-react';
import { ProjectBlueprint } from '@/types/project';

interface AiSummarySectionProps {
  blueprint: ProjectBlueprint;
}

export default function AiSummarySection({ blueprint }: AiSummarySectionProps) {
  if (!blueprint.projectOverview && (!blueprint.targetUsers || blueprint.targetUsers.length === 0)) {
    return null;
  }

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">AI Project Analysis</h2>
          <p className="text-xs text-slate-500">Architecture summary and target user personas</p>
        </div>
      </div>

      {blueprint.projectOverview && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
          <div className="flex items-center space-x-2 mb-2 text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            <span>Product Vision</span>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            {blueprint.projectOverview}
          </p>
        </div>
      )}

      {blueprint.targetUsers && blueprint.targetUsers.length > 0 && (
        <div>
          <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-500" />
            Target Users ({blueprint.targetUsers.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {blueprint.targetUsers.map((persona, idx) => (
              <div
                key={idx}
                className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start space-x-3 hover:shadow-sm transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-200 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                  {idx + 1}
                </div>
                <span className="text-sm text-emerald-900 leading-snug font-medium">{persona}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
