'use client';

import React from 'react';
import { Component, Shield, Network, LayoutTemplate, Database, Hash, FileCode, Layers } from 'lucide-react';
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
    <section className="bg-[#0B0F19] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Subtle atmospheric glow */}
      <div className="absolute top-0 right-0 w-72 h-44 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-inner">
          <Component className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Shared Architectural Modules</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {modules.length} Reusable Modules
            </span>
          </div>
          <p className="text-xs text-zinc-400">Common components, utilities, and services shared across all developers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {modules.map((mod, idx) => (
          <div
            key={idx}
            className="bg-[#070A12] border border-zinc-800/80 hover:border-purple-500/30 rounded-2xl p-5 sm:p-6 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800/90 shadow-inner">
                  {getCategoryIcon(mod.category)}
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-zinc-100 group-hover:text-purple-300 transition-colors">
                    {mod.name}
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{mod.category}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pl-1">{mod.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
