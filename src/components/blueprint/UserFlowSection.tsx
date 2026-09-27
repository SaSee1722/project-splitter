'use client';

import React from 'react';
import { Navigation, ArrowRight } from 'lucide-react';
import { UserFlowStep } from '@/types/project';

interface UserFlowSectionProps {
  userFlow: UserFlowStep[];
}

export default function UserFlowSection({ userFlow }: UserFlowSectionProps) {
  if (!userFlow || userFlow.length === 0) return null;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center">
          <Navigation className="w-5 h-5 text-sky-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">User Flow</h2>
          <p className="text-xs text-slate-500">{userFlow.length} navigation transitions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {userFlow.map((flow, idx) => (
          <div
            key={idx}
            className="bg-slate-50 border border-slate-200 hover:border-sky-300 rounded-xl p-4 flex flex-col justify-between transition-all hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-lg bg-sky-100 border border-sky-200 text-sky-700 text-xs font-mono font-bold flex items-center justify-center">
                {flow.step || idx + 1}
              </span>
              <span className="text-xs font-mono text-slate-400">Step {flow.step || idx + 1}</span>
            </div>

            <div className="space-y-2">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">From</span>
                <span className="truncate block">{flow.from}</span>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-medium text-indigo-700">
                  <ArrowRight className="w-3 h-3 text-indigo-500" />
                  <span>{flow.action}</span>
                </div>
              </div>

              <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-200 text-xs font-semibold text-indigo-800">
                <span className="text-[9px] font-mono uppercase tracking-wider text-indigo-500 block mb-0.5">To</span>
                <span className="truncate block">{flow.to}</span>
              </div>
            </div>

            {flow.description && (
              <p className="mt-3 text-xs text-slate-500 leading-relaxed">{flow.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
