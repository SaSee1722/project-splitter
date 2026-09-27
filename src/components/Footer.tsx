'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, ShieldCheck, Terminal, Zap } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white relative overflow-hidden mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block transition-transform hover:scale-[1.01]">
              <Logo size="md" showTagline={false} />
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              AI-powered project planning for hackathon teams. Convert problem statements into complete blueprints with screen assignments, file ownership, and AI coding prompts.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Gemini 2.5 Flash</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-mono text-indigo-700 font-medium">
                <Zap className="w-3 h-3 text-indigo-500" />
                <span>Hackathon Ready</span>
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/create', label: 'New Project Plan' },
                { href: '/projects', label: 'Saved Blueprints' },
                { href: '/', label: 'How It Works' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center space-x-1 group"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Capabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
              Features
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              {[
                'AI Solution Generation',
                'Screen Architecture',
                'File Ownership System',
                'AI Coding IDE Prompts',
                'Download Blueprint ZIP',
              ].map((item) => (
                <li key={item} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Project Splitter AI. Built for hackathon teams worldwide.</p>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-mono text-slate-400">v2.0.0 • Gemini 2.5 Flash</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
