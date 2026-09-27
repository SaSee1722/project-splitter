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
      fetch('/api/status')
        .then((res) => res.json())
        .then((data) => setHasEnvKey(data.hasEnvKey))
        .catch(() => setHasEnvKey(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setCustomApiKey(apiKey);
    showToast('Gemini API key saved successfully.', 'success');
    onKeyUpdated();
    onClose();
  };

  const handleClear = () => {
    setApiKey('');
    setCustomApiKey('');
    setTestResult(null);
    showToast('API key cleared. Using environment key or local engine.', 'info');
    onKeyUpdated();
  };

  const handleTestConnection = async () => {
    if (!apiKey && !hasEnvKey) {
      setTestResult({ success: false, message: 'No API key provided. Enter a key or set GEMINI_API_KEY in .env.local' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey.trim(),
        },
        body: JSON.stringify({
          input: {
            projectName: 'Ping Test',
            problemStatement: 'Quick API connection test.',
            technology: 'React',
            teamMembers: [{ id: '1', name: 'Tester', role: 'Engineer' }],
            hasPlannedScreens: false,
            plannedScreens: [],
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Connection failed');
      setTestResult({ success: true, message: `Connected successfully! Model: ${data.modelUsed || 'gemini-2.5-flash'}` });
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Verification failed. Check your API key.' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-t-2xl" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <Key className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Gemini AI Configuration</h3>
              <p className="text-xs text-slate-500">Configure your Google Gemini API access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {/* Environment status */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm">
            <div className="flex items-center space-x-2">
              <ShieldCheck className={`w-4 h-4 ${hasEnvKey ? 'text-emerald-500' : 'text-amber-500'}`} />
              <span className="text-slate-700 font-medium">Server Environment:</span>
            </div>
            {hasEnvKey ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-semibold border border-emerald-200">
                GEMINI_API_KEY Active ✓
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-mono text-xs font-semibold border border-amber-200">
                No env key — use custom key
              </span>
            )}
          </div>

          {/* Custom API Key input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Custom Gemini API Key <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Saved locally in browser only. Never sent to any server.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 font-medium"
              >
                Get API Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Test result */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-sm flex items-start space-x-2.5 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-600" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Fallback notice */}
          <div className="bg-indigo-50 p-3.5 rounded-xl border border-indigo-200 text-sm">
            <p className="font-semibold text-indigo-800 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Offline Fallback Available
            </p>
            <p className="text-xs text-indigo-700 leading-relaxed">
              Without a Gemini key, Project Splitter AI uses a built-in local engine so your team is never blocked.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="px-4 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl transition-colors disabled:opacity-50"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm shadow-indigo-200 transition-all"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
