'use client';

import React, { useState } from 'react';
import { ProjectInput, ProjectBlueprint } from '@/types/project';
import {
  Download,
  Copy,
  CheckCircle2,
  FileCode2,
  Users,
  Layers,
  GitBranch,
  Sparkles,
  Archive,
  FileJson,
  FileText,
  Share2,
  Calendar,
  Trophy,
  Code2,
  ExternalLink,
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { generateMarkdown, generateJsonExport } from '@/services/exportService';

interface OverviewHeaderProps {
  input: ProjectInput;
  blueprint: ProjectBlueprint;
  source: 'gemini' | 'architect-engine';
}

export default function OverviewHeader({ input, blueprint, source }: OverviewHeaderProps) {
  const { showToast } = useToast();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(key);
      showToast(`${label} copied!`, 'success');
      setTimeout(() => setCopiedItem(null), 2000);
    } catch {
      showToast('Copy failed — please try again.', 'error');
    }
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdown(input, blueprint);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${input.projectName.replace(/[^a-z0-9]/gi, '_')}_PROJECT_BLUEPRINT.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Blueprint Markdown downloaded!', 'success');
  };

  const handleDownloadJson = () => {
    const json = generateJsonExport(input, blueprint);
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${input.projectName.replace(/[^a-z0-9]/gi, '_')}_project_spec.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON specification downloaded!', 'success');
  };

  const handleDownloadZip = async () => {
    try {
      const { generateProjectZip } = await import('@/services/structureGenerator');
      const blob = await generateProjectZip(input, blueprint);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${input.projectName.replace(/[^a-z0-9]/gi, '_')}_project_structure.zip`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Project structure ZIP downloaded!', 'success');
    } catch (err: any) {
      showToast(err.message || 'ZIP generation failed', 'error');
    }
  };

  const totalScreens = blueprint.screens.length + (blueprint.aiSuggestedScreens?.length || 0);
  const totalFiles = blueprint.projectStructure.filter((n) => n.type === 'file').length;

  const stats = [
    { label: 'Screens', value: totalScreens, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { label: 'Files', value: totalFiles, icon: FileCode2, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
    { label: 'Features', value: blueprint.coreFeatures.length, icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'Members', value: blueprint.teamAssignments.length, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Gradient top bar */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              {input.hackathonName && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700">
                  <Trophy className="w-3.5 h-3.5" />
                  {input.hackathonName}
                </span>
              )}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium ${
                source === 'gemini'
                  ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                  : 'bg-amber-50 border border-amber-200 text-amber-700'
              }`}>
                {source === 'gemini' ? (
                  <><Sparkles className="w-3 h-3" /> Gemini AI</>
                ) : (
                  <><Code2 className="w-3 h-3" /> Local Engine</>
                )}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600">
                {input.technology}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              {input.projectName}
            </h1>

            {blueprint.projectOverview && (
              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl line-clamp-3">
                {blueprint.projectOverview.split('\n')[0]}
              </p>
            )}

            {input.solution && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-xs font-mono font-semibold text-emerald-700 mb-1">Solution</p>
                <p className="text-xs text-emerald-800 leading-relaxed line-clamp-2">{input.solution}</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className={`${stat.bg} ${stat.border} border rounded-xl p-3.5 text-center`}>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} border ${stat.border} flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Export Actions */}
        <div className="border-t border-slate-200 pt-5">
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">Export Options</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Download Markdown</span>
            </button>

            <button
              onClick={handleDownloadZip}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold shadow-sm transition-all"
            >
              <Archive className="w-4 h-4" />
              <span>Download ZIP</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-sm font-semibold shadow-sm transition-all"
            >
              <FileJson className="w-4 h-4 text-emerald-500" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => handleCopy(generateMarkdown(input, blueprint), 'blueprint', 'Blueprint')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-sm font-semibold shadow-sm transition-all"
            >
              {copiedItem === 'blueprint' ? (
                <><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>Copied!</span></>
              ) : (
                <><Copy className="w-4 h-4 text-slate-400" /><span>Copy Blueprint</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
