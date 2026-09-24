'use client';

import React from 'react';
import { Component, Shield, Network, LayoutTemplate, Database, Hash, FileCode } from 'lucide-react';
import { SharedModuleItem } from '@/types/project';

interface SharedModulesSectionProps {
  modules: SharedModuleItem[];
}

export default function SharedModulesSection({ modules }: SharedModulesSectionProps) {
  if (!modules || modules.length === 0) return null;

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('sec') || cat.includes('auth')) return <Shield className="w-4 h-4 text-emerald-400" />;
    if (cat.includes('net') || cat.includes('api')) return <Network className="w-4 h-4 text-sky-400" />;
    if (cat.includes('ui') || cat.includes('comp')) return <LayoutTemplate className="w-4 h-4 text-indigo-400" />;
    if (cat.includes('data') || cat.includes('db')) return <Database className="w-4 h-4 text-amber-400" />;
    if (cat.includes('type')) return <FileCode className="w-4 h-4 text-cyan-400" />;
    return <Component className="w-4 h-4 text-purple-400" />;
  };

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-md">
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Component className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">Shared Architectural Modules</h2>
          <p className="text-xs text-zinc-400">Cross-cutting infrastructure elements maintained collaboratively</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod, idx) => (
          <div
            key={idx}
            className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4 hover:border-zinc-700/80 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-2.5 mb-2.5">
                <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  {getCategoryIcon(mod.category)}
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-zinc-100">{mod.name}</h3>
                  <span className="text-[10px] text-zinc-500 font-mono">{mod.category}</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{mod.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
