'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Terminal, ShieldCheck, Heart, Github, Layers, ArrowUpRight } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-[#06080D] relative overflow-hidden mt-auto">
      {/* Subtle atmospheric glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-amber-500/5 via-indigo-500/10 to-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block transition-transform hover:scale-[1.01]">
              <Logo size="md" showTagline={false} />
            </Link>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
              AI-powered architecture and project decompilation engine. Converts problem statements into complete screen specifications, file structures, and balanced developer workloads.
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Gemini 2.5 Flash Active</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-[11px] font-mono text-indigo-300 font-medium">
                <Terminal className="w-3 h-3 text-indigo-400" />
                <span>Zero Hallucinated Code</span>
              </span>
            </div>
          </div>

          {/* Core Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/create"
                  className="text-zinc-400 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>New Project Wizard</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-zinc-400 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Saved Blueprints</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-zinc-400 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Architecture Studio Demo</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-600" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Capabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
              System Capabilities
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center space-x-2">
                <span className="w-1 h-1 rounded-full bg-indigo-400" />
                <span>Exact File-to-Developer Mapping</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1 h-1 rounded-full bg-cyan-400" />
                <span>Downloadable Starter Framework ZIP</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                <span>AI Missing Screen Detection</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                <span>7-Step Git Conflict-Free Strategy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} TeamForge AI. Built for high-velocity software engineering teams.</p>
          <div className="flex items-center space-x-4">
            <span className="text-[11px] font-mono text-zinc-600">Engine v2.5.0-flash</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
