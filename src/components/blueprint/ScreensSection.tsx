'use client';

import React from 'react';
import { ScreenItem } from '@/types/project';
import { Monitor, Sparkles, Code2, CheckCircle2, AlertCircle, Minus, FileCode2, Zap } from 'lucide-react';

interface ScreensSectionProps {
  screens: ScreenItem[];
  aiSuggestedScreens?: ScreenItem[];
}

const PRIORITY_CONFIG = {
  'Must Have': { color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
  'Should Have': { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  'Nice to Have': { color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
};

const MEMBER_COLORS = [
  { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
  { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
  { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700' },
];

function ScreenCard({ screen, memberColorMap }: { screen: ScreenItem; memberColorMap: Record<string, typeof MEMBER_COLORS[0]> }) {
  const priorityConfig = PRIORITY_CONFIG[screen.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG['Nice to Have'];
  const memberColor = memberColorMap[screen.assignedMember] || MEMBER_COLORS[0];

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-indigo-300 transition-all">
      {/* Color accent at top */}
      <div className={`h-1 ${priorityConfig.bg.replace('bg-', 'bg-').replace('-50', '-400')} opacity-70`} />
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
              <Monitor className="w-4 h-4 text-slate-600" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 leading-tight">{screen.name}</h4>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-lg border font-mono font-semibold flex-shrink-0 ${priorityConfig.bg} ${priorityConfig.border} ${priorityConfig.color}`}>
            {screen.priority}
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-3 leading-relaxed line-clamp-2">
          {screen.purpose}
        </p>

        {/* Assigned file */}
        {screen.assignedFile && (
          <div className="flex items-center space-x-1.5 mb-3 bg-slate-900 px-2.5 py-1.5 rounded-lg">
            <FileCode2 className="w-3 h-3 text-sky-400 flex-shrink-0" />
            <span className="text-[11px] font-mono text-emerald-400 truncate">{screen.assignedFile}</span>
          </div>
        )}

        {/* Responsibilities */}
        {screen.responsibilities.length > 0 && (
          <div className="space-y-1 mb-3">
            {screen.responsibilities.slice(0, 3).map((r, rIdx) => (
              <div key={rIdx} className="flex items-start space-x-1.5 text-xs text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{r}</span>
              </div>
            ))}
            {screen.responsibilities.length > 3 && (
              <p className="text-xs text-slate-400 pl-5">+{screen.responsibilities.length - 3} more</p>
            )}
          </div>
        )}

        {/* Footer: Owner */}
        <div className={`flex items-center justify-between pt-2 border-t border-slate-100`}>
          <span className="text-xs text-slate-400">Owner</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${memberColor.bg} ${memberColor.border} ${memberColor.text}`}>
            {screen.assignedMember}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ScreensSection({ screens, aiSuggestedScreens }: ScreensSectionProps) {
  const allMembers = Array.from(new Set([
    ...screens.map((s) => s.assignedMember),
    ...(aiSuggestedScreens || []).map((s) => s.assignedMember),
  ]));

  const memberColorMap: Record<string, typeof MEMBER_COLORS[0]> = {};
  allMembers.forEach((member, idx) => {
    memberColorMap[member] = MEMBER_COLORS[idx % MEMBER_COLORS.length];
  });

  const mustHave = screens.filter((s) => s.priority === 'Must Have');
  const shouldHave = screens.filter((s) => s.priority === 'Should Have');
  const niceToHave = screens.filter((s) => s.priority === 'Nice to Have');

  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <Monitor className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">Screen Architecture</h3>
            <p className="text-sm text-slate-500">{screens.length} screens identified</p>
          </div>
        </div>

        {/* Priority legend */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          {Object.entries(PRIORITY_CONFIG).map(([priority, config]) => (
            <span key={priority} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border font-medium ${config.bg} ${config.border} ${config.color}`}>
              <Minus className="w-3 h-3" />
              {priority} ({priority === 'Must Have' ? mustHave.length : priority === 'Should Have' ? shouldHave.length : niceToHave.length})
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Required Screens */}
        {mustHave.length > 0 && (
          <div>
            <h4 className="text-xs font-mono font-bold text-rose-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Must Have ({mustHave.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mustHave.map((screen, idx) => (
                <ScreenCard key={idx} screen={screen} memberColorMap={memberColorMap} />
              ))}
            </div>
          </div>
        )}

        {/* Should Have */}
        {shouldHave.length > 0 && (
          <div>
            <h4 className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Should Have ({shouldHave.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {shouldHave.map((screen, idx) => (
                <ScreenCard key={idx} screen={screen} memberColorMap={memberColorMap} />
              ))}
            </div>
          </div>
        )}

        {/* Nice to Have */}
        {niceToHave.length > 0 && (
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">
              Nice to Have ({niceToHave.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {niceToHave.map((screen, idx) => (
                <ScreenCard key={idx} screen={screen} memberColorMap={memberColorMap} />
              ))}
            </div>
          </div>
        )}

        {/* AI Suggested Screens */}
        {aiSuggestedScreens && aiSuggestedScreens.length > 0 && (
          <div>
            <h4 className="text-xs font-mono font-bold text-violet-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Suggested Screens ({aiSuggestedScreens.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {aiSuggestedScreens.map((screen, idx) => (
                <div key={idx} className="relative">
                  <ScreenCard screen={screen} memberColorMap={memberColorMap} />
                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-50 border border-violet-200 text-violet-600 font-mono">AI</span>
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
