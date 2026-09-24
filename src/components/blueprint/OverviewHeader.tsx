'use client';

import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  FileCode2, 
  Copy, 
  GitBranch, 
  Users, 
  Layers, 
  Code2, 
  Sparkles, 
  Cpu, 
  Check, 
  Archive,
  ArrowDownToLine,
  Share2
} from 'lucide-react';
import { ProjectBlueprint, ProjectInput } from '@/types/project';
import { 
  downloadJsonFile, 
  downloadMarkdownFile, 
  generateMarkdownReport, 
  copyTeamAssignmentsToClipboard, 
  copyGithubPlanToClipboard 
} from '@/services/exportService';
import { generateProjectZip } from '@/services/structureGenerator';
import { useToast } from '@/components/Toast';

interface OverviewHeaderProps {
  input: ProjectInput;
  blueprint: ProjectBlueprint;
  source?: 'gemini' | 'architect-engine';
}

export default function OverviewHeader({ input, blueprint, source = 'gemini' }: OverviewHeaderProps) {
  const { showToast } = useToast();
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [copiedTeam, setCopiedTeam] = useState(false);
  const [copiedGit, setCopiedGit] = useState(false);

  const totalScreens = blueprint.screens.length + (blueprint.aiSuggestedScreens?.length || 0);

  const handleDownloadZip = async () => {
    try {
      setDownloadingZip(true);
      showToast('Packing framework starter files into ZIP...', 'info');
      const blob = await generateProjectZip(input, blueprint);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${input.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-starter.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Project structure downloaded successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast('Failed to generate project structure ZIP.', 'error');
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleExportJson = () => {
    downloadJsonFile(`${input.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-blueprint`, {
      project: input.projectName,
      technology: input.technology,
      input,
      blueprint,
    });
    showToast('Blueprint exported as JSON', 'success');
  };

  const handleExportMarkdown = () => {
    const md = generateMarkdownReport(input, blueprint);
    downloadMarkdownFile(`${input.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-blueprint`, md);
    showToast('Blueprint exported as Markdown', 'success');
  };

  const handleCopyTeam = async () => {
    const text = copyTeamAssignmentsToClipboard(blueprint);
    await navigator.clipboard.writeText(text);
    setCopiedTeam(true);
    showToast('Team file assignments copied to clipboard!', 'success');
    setTimeout(() => setCopiedTeam(false), 2000);
  };

  const handleCopyGit = async () => {
    const text = copyGithubPlanToClipboard(blueprint);
    await navigator.clipboard.writeText(text);
    setCopiedGit(true);
    showToast('GitHub collaboration plan copied to clipboard!', 'success');
    setTimeout(() => setCopiedGit(false), 2000);
  };

  return (
    <div className="bg-[#0B0F19] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Top subtle glow background */}
      <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-b from-indigo-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top row: Title and Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-zinc-800/80 relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              {input.technology}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-900 text-zinc-300 border border-zinc-800 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              {input.teamMembers.length} Developers
            </span>
            {source === 'gemini' ? (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Gemini 2.5 Flash Verified
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                Local Architect Engine
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            {input.projectName}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Architectural blueprint with exact file mapping and balanced workload distribution.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Download ZIP */}
          <button
            onClick={handleDownloadZip}
            disabled={downloadingZip}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-white shadow-xl shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            <Archive className="w-4 h-4" />
            <span>{downloadingZip ? 'Packing Starter ZIP...' : 'Download Project ZIP'}</span>
          </button>

          {/* Export JSON / MD */}
          <div className="flex items-center space-x-1 bg-[#080B12] p-1 rounded-xl border border-zinc-800">
            <button
              onClick={handleExportJson}
              title="Export as JSON"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
              <span>JSON</span>
            </button>
            <button
              onClick={handleExportMarkdown}
              title="Export as Markdown"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Markdown</span>
            </button>
          </div>

          {/* Copy Team & Git */}
          <div className="flex items-center space-x-1 bg-[#080B12] p-1 rounded-xl border border-zinc-800">
            <button
              onClick={handleCopyTeam}
              title="Copy Team Assignments & Files"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              {copiedTeam ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Users className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{copiedTeam ? 'Copied' : 'Copy Team'}</span>
            </button>
            <button
              onClick={handleCopyGit}
              title="Copy GitHub Collaboration Plan"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              {copiedGit ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <GitBranch className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedGit ? 'Copied' : 'Copy Git'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 relative z-10">
        <div className="bg-[#080B12] p-4 rounded-2xl border border-zinc-800/80">
          <div className="flex items-center space-x-2 text-zinc-400 text-xs mb-1">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Tech Stack</span>
          </div>
          <p className="text-base sm:text-lg font-black text-white">{input.technology}</p>
        </div>

        <div className="bg-[#080B12] p-4 rounded-2xl border border-zinc-800/80">
          <div className="flex items-center space-x-2 text-zinc-400 text-xs mb-1">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Engineers</span>
          </div>
          <p className="text-base sm:text-lg font-black text-white">{input.teamMembers.length} Members</p>
        </div>

        <div className="bg-[#080B12] p-4 rounded-2xl border border-zinc-800/80">
          <div className="flex items-center space-x-2 text-zinc-400 text-xs mb-1">
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Total Screens</span>
          </div>
          <p className="text-base sm:text-lg font-black text-white">
            {totalScreens}
            {blueprint.aiSuggestedScreens && blueprint.aiSuggestedScreens.length > 0 && (
              <span className="text-xs font-normal text-amber-400 ml-1.5 font-mono">
                (+{blueprint.aiSuggestedScreens.length} suggested)
              </span>
            )}
          </p>
        </div>

        <div className="bg-[#080B12] p-4 rounded-2xl border border-zinc-800/80">
          <div className="flex items-center space-x-2 text-zinc-400 text-xs mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Core Features</span>
          </div>
          <p className="text-base sm:text-lg font-black text-white">{blueprint.coreFeatures.length} Modules</p>
        </div>
      </div>
    </div>
  );
}
