'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlusCircle, FolderOpen, Key, Sparkles, Menu, X } from 'lucide-react';
import ApiKeyModal from './ApiKeyModal';
import Logo from './Logo';
import { getCustomApiKey } from '@/services/projectStorage';

export default function Navbar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [hasEnvKey, setHasEnvKey] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const checkKeyStatus = () => {
    const custom = getCustomApiKey();
    setHasApiKey(Boolean(custom));
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setHasEnvKey(data.hasEnvKey);
      })
      .catch(() => setHasEnvKey(false));
  };

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const isActiveKey = hasApiKey || hasEnvKey;

  const navLinks = [
    { href: '/create', label: 'New Project', icon: PlusCircle, iconColor: 'text-indigo-600' },
    { href: '/projects', label: 'Saved Plans', icon: FolderOpen, iconColor: 'text-violet-600' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="transition-transform hover:scale-[1.01] active:scale-[0.99]">
            <Logo size="md" showTagline={true} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-2">
            <nav className="flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : link.iconColor}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="h-5 w-px bg-slate-200" />

            {/* API Key Status */}
            <button
              onClick={() => setIsModalOpen(true)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm border font-medium transition-all ${
                isActiveKey
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
              }`}
              title="Configure Gemini API Key"
            >
              <Key className={`w-3.5 h-3.5 ${isActiveKey ? 'text-emerald-600' : 'text-amber-600'}`} />
              <span className="hidden md:inline text-xs font-mono">
                {isActiveKey ? 'AI Connected' : 'Setup AI Key'}
              </span>
              <span className="relative flex h-2 w-2">
                {isActiveKey && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isActiveKey ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 animate-fade-in">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : link.iconColor}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => { setIsModalOpen(true); setMobileOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActiveKey
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              <Key className={`w-4 h-4 ${isActiveKey ? 'text-emerald-600' : 'text-amber-600'}`} />
              <span>{isActiveKey ? 'AI Connected (Gemini)' : 'Setup Gemini API Key'}</span>
            </button>
          </div>
        )}
      </header>

      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onKeyUpdated={checkKeyStatus}
      />
    </>
  );
}
