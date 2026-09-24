'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle, AlertCircle, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 text-zinc-100">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-zinc-100">Gemini API Intelligence Settings</h3>
              <p className="text-xs text-zinc-400">Configure your Google Gemini API access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-xs">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Server Environment Status:</span>
            </div>
            {hasEnvKey ? (
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[11px] border border-emerald-500/20">
                GEMINI_API_KEY Configured in .env
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[11px] border border-amber-500/20">
                No .env key (Offline Engine or Custom Key)
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Custom Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            <p className="mt-1.5 text-xs text-zinc-500 flex items-center justify-between">
              <span>Saved locally in browser memory. Never shared or committed.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 font-sans"
              >
                Get Gemini Key <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-start space-x-2 ${
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
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/60 text-xs text-zinc-400 space-y-1">
            <p className="font-medium text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Offline Fallback Engine
            </p>
            <p>
              If no API key is specified, TeamForge AI uses its built-in deterministic Senior Architect Engine so you can evaluate the full workflow smoothly.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="px-3 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors disabled:opacity-50"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Clear Key
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
