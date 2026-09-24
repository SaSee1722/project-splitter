'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, PlusCircle, FolderGit2, Key, Sparkles } from 'lucide-react';
import ApiKeyModal from './ApiKeyModal';
import { getCustomApiKey } from '@/services/projectStorage';

export default function Navbar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [hasEnvKey, setHasEnvKey] = useState(false);

  const checkKeyStatus = () => {
    const custom = getCustomApiKey();
    setHasApiKey(Boolean(custom));
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => setHasEnvKey(data.hasEnvKey))
      .catch(() => setHasEnvKey(false));
  };

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const isActiveKey = hasApiKey || hasEnvKey;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-zinc-950 rounded-[7px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base tracking-tight text-zinc-100">TeamForge</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 hidden sm:block">Turn Ideas Into Team-Ready Projects</span>
            </div>
          </Link>

          {/* Nav Links & Action */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <nav className="flex items-center space-x-1 sm:space-x-2">
              <Link
                href="/create"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  pathname === '/create'
                    ? 'bg-zinc-800 text-indigo-300 shadow-sm border border-zinc-700/60'
                    : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Create Project</span>
              </Link>

              <Link
                href="/projects"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  pathname === '/projects'
                    ? 'bg-zinc-800 text-indigo-300 shadow-sm border border-zinc-700/60'
                    : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Saved Projects</span>
              </Link>
            </nav>

            <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />

            {/* Gemini API Key status / button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                isActiveKey
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
              title="Configure Gemini API Key"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-mono text-[11px]">
                {isActiveKey ? 'Gemini Ready' : 'Gemini Config'}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isActiveKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onKeyUpdated={checkKeyStatus}
      />
    </>
  );
}
