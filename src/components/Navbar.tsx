'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlusCircle, FolderGit2, Key, Sparkles, Terminal, BookOpen } from 'lucide-react';
import ApiKeyModal from './ApiKeyModal';
import Logo from './Logo';
import { getCustomApiKey } from '@/services/projectStorage';

export default function Navbar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [hasEnvKey, setHasEnvKey] = useState(false);
  const [modelName, setModelName] = useState('gemini-2.5-flash');

  const checkKeyStatus = () => {
    const custom = getCustomApiKey();
    setHasApiKey(Boolean(custom));
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setHasEnvKey(data.hasEnvKey);
        if (data.model) setModelName(data.model);
      })
      .catch(() => setHasEnvKey(false));
  };

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const isActiveKey = hasApiKey || hasEnvKey;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo with Custom Anvil + Spark Badge */}
          <Link href="/" className="transition-transform hover:scale-[1.01] active:scale-[0.99]">
            <Logo size="md" showTagline={true} />
          </Link>

          {/* Navigation Links & Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <nav className="flex items-center space-x-1 sm:space-x-2">
              <Link
                href="/create"
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  pathname === '/create'
                    ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-500/20 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Create Project</span>
              </Link>

              <Link
                href="/projects"
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  pathname === '/projects'
                    ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-500/20 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Saved Projects</span>
              </Link>
            </nav>

            <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />

            {/* Gemini API Key status / button with Live Beacon */}
            <button
              onClick={() => setIsModalOpen(true)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs border transition-all ${
                isActiveKey
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/30 hover:border-emerald-400/60 shadow-sm shadow-emerald-900/20'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
              title="Configure Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline font-mono text-[11px] font-medium">
                {isActiveKey ? 'Gemini 2.5 Flash' : 'AI Config'}
              </span>
              <span className="relative flex h-2 w-2">
                {isActiveKey && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isActiveKey ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </span>
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
