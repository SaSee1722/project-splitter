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
  Archive
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
      showToast('Generating project structure ZIP...', 'info');
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
    showToast('Team assignments copied to clipboard!', 'success');
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      {/* Top row: Title and Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {input.technology}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              {input.teamMembers.length} Engineers
            </span>
            {source === 'gemini' ? (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini AI Intelligence Layer
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Senior Architect Engine (Local AI)
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
            {input.projectName}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Complete architectural blueprint, screen allocation & team collaboration matrix
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={handleDownloadZip}
            disabled={downloadingZip}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
          >
            <Archive className="w-4 h-4" />
            <span>{downloadingZip ? 'Packing ZIP...' : 'Download Project Structure'}</span>
          </button>

          <div className="flex items-center space-x-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={handleExportJson}
              title="Export as JSON"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
              <span>JSON</span>
            </button>
            <button
              onClick={handleExportMarkdown}
              title="Export as Markdown"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Markdown</span>
            </button>
          </div>

          <div className="flex items-center space-x-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={handleCopyTeam}
              title="Copy Team Assignments"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              {copiedTeam ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Users className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{copiedTeam ? 'Copied' : 'Copy Team'}</span>
            </button>
            <button
              onClick={handleCopyGit}
              title="Copy GitHub Collaboration Plan"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              {copiedGit ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <GitBranch className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedGit ? 'Copied' : 'Copy Git Plan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
        <div className="bg-zinc-950/70 p-4 rounded-xl border border-zinc-800/80">
          <div className="flex items-center space-x-2 text-zinc-400 text-xs mb-1">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>Framework</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-zinc-100">{input.technology}</p>
        </div>

        <div className="bg-zinc-950/70 p-4 rounded-xl border border-zinc-800/80">
          <div className="flex items-center space-x-2 text-zinc-400 text-xs mb-1">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Developers</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-zinc-100">{input.teamMembers.length} Members</p>
        </div>

        <div className="bg-zinc-950/70 p-4 rounded-xl border border-zinc-800/80">
          <div className="flex items-center space-x-2 text-zinc-400 text-xs mb-1">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Total Screens</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-zinc-100">
            {totalScreens}
            {blueprint.aiSuggestedScreens && blueprint.aiSuggestedScreens.length > 0 && (
              <span className="text-xs font-normal text-indigo-400 ml-1.5">
                ({blueprint.aiSuggestedScreens.length} suggested)
              </span>
            )}
          </p>
        </div>

        <div className="bg-zinc-950/70 p-4 rounded-xl border border-zinc-800/80">
          <div className="flex items-center space-x-2 text-zinc-400 text-xs mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Core Features</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-zinc-100">{blueprint.coreFeatures.length} Modules</p>
        </div>
      </div>
    </div>
  );
}
