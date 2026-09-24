'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle, AlertCircle, Sparkles, ExternalLink, ShieldCheck, Terminal, Cpu } from 'lucide-react';
import { getCustomApiKey, setCustomApiKey } from '@/services/projectStorage';
import { useToast } from './Toast';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
}

export default function ApiKeyModal({ isOpen, onClose, onKeyUpdated }: ApiKeyModalProps) {
  const { showToast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [hasEnvKey, setHasEnvKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getCustomApiKey());
      setTestResult(null);

      // Check if server environment key is available
      fetch('/api/status')
        .then((res) => res.json())
        .then((data) => setHasEnvKey(data.hasEnvKey))
        .catch(() => setHasEnvKey(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setCustomApiKey(apiKey);
    showToast('Gemini API settings saved successfully.', 'success');
    onKeyUpdated();
    onClose();
  };

  const handleClear = () => {
    setApiKey('');
    setCustomApiKey('');
    setTestResult(null);
    showToast('Custom API Key cleared. Reverting to environment or local engine.', 'info');
    onKeyUpdated();
  };

  const handleTestConnection = async () => {
    if (!apiKey && !hasEnvKey) {
      setTestResult({
        success: false,
        message: 'No API key provided. Please enter a key or set GEMINI_API_KEY in .env',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      // Send a lightweight test request
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey.trim(),
        },
        body: JSON.stringify({
          input: {
            projectName: 'Ping Test',
            problemStatement: 'Quick API connection diagnostic test verifying Gemini connectivity.',
            technology: 'React',
            teamMembers: [{ id: '1', name: 'Tester', role: 'Engineer' }],
            hasPlannedScreens: false,
            plannedScreens: [],
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Connection failed');
      }

      setTestResult({
        success: true,
        message: `Successfully connected! Active Intelligence Layer: ${data.modelUsed}`,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Verification failed. Check your API key and network.',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0B0F19] border border-zinc-800/90 rounded-3xl shadow-2xl p-6 sm:p-7 text-zinc-100 overflow-hidden">
        {/* Ambient glow accent */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-inner">
              <Key className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white tracking-tight">Gemini AI Intelligence Settings</h3>
              <p className="text-xs text-zinc-400">Configure your Google Gemini API access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 relative z-10">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#070A12] border border-zinc-800/80 text-xs">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-zinc-300 font-medium">Server Environment:</span>
            </div>
            {hasEnvKey ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-mono text-[11px] font-semibold border border-emerald-500/30">
                GEMINI_API_KEY Active (.env)
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 font-mono text-[11px] font-semibold border border-amber-500/30">
                Using Local Engine or Custom Key
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Custom Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2.5 bg-[#070A12] border border-zinc-800/90 rounded-2xl text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/80 shadow-inner transition-all"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
              <span>Saved locally in browser memory only.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 font-medium font-sans"
              >
                Get Gemini Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {testResult && (
            <div
              className={`p-3.5 rounded-2xl border text-xs flex items-start space-x-2.5 ${
                testResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-400" />
              )}
              <span className="leading-relaxed">{testResult.message}</span>
            </div>
          )}

          <div className="bg-[#070A12] p-3.5 rounded-2xl border border-zinc-800/80 text-xs text-zinc-400 space-y-1">
            <p className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Offline Fallback Engine
            </p>
            <p className="text-[11px] leading-relaxed text-zinc-400">
              If an external Gemini call ever times out, TeamForge AI seamlessly falls back to its deterministic local engine so your team is never blocked.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80 relative z-10">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="px-3.5 py-2 text-xs font-semibold bg-[#070A12] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl transition-colors disabled:opacity-50"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
