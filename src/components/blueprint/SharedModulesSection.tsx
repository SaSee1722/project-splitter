'use client';

import React from 'react';
import { Component, Shield, Network, LayoutTemplate, Database, FileCode } from 'lucide-react';
import { SharedModuleItem } from '@/types/project';

interface SharedModulesSectionProps {
  modules: SharedModuleItem[];
}

export default function SharedModulesSection({ modules }: SharedModulesSectionProps) {
  if (!modules || modules.length === 0) return null;

  const getCategoryConfig = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('sec') || cat.includes('auth'))
      return { icon: <Shield className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' };
    if (cat.includes('net') || cat.includes('api'))
      return { icon: <Network className="w-4 h-4 text-sky-600" />, bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700' };
    if (cat.includes('ui') || cat.includes('comp') || cat.includes('layout'))
      return { icon: <LayoutTemplate className="w-4 h-4 text-indigo-600" />, bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' };
    if (cat.includes('data') || cat.includes('db') || cat.includes('store'))
      return { icon: <Database className="w-4 h-4 text-amber-600" />, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' };
    if (cat.includes('type') || cat.includes('util'))
      return { icon: <FileCode className="w-4 h-4 text-violet-600" />, bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' };
    return { icon: <Component className="w-4 h-4 text-purple-600" />, bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' };
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center">
          <Component className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Shared Modules</h2>
          <p className="text-xs text-slate-500">{modules.length} shared components & utilities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {modules.map((mod, idx) => {
          const config = getCategoryConfig(mod.category);
          return (
            <div
              key={idx}
              className={`${config.bg} border ${config.border} rounded-xl p-4 hover:shadow-sm transition-all`}
            >
              <div className="flex items-center space-x-2.5 mb-2">
                <div className={`p-1.5 rounded-lg bg-white border ${config.border} shadow-sm flex-shrink-0`}>
                  {config.icon}
                </div>
                <div className="min-w-0">
                  <h3 className={`font-bold text-sm ${config.text} truncate`}>{mod.name}</h3>
                  <span className={`text-[10px] font-mono ${config.text} opacity-70 uppercase tracking-wider`}>{mod.category}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{mod.description}</p>
              {mod.sharedFiles && mod.sharedFiles.length > 0 && (
                <div className="mt-2 space-y-0.5">
                  {mod.sharedFiles.map((file, fIdx) => (
                    <div key={fIdx} className="text-xs font-mono text-slate-500 bg-white/70 rounded px-2 py-0.5 truncate">
                      {file}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
