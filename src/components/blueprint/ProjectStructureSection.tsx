'use client';

import React, { useState } from 'react';
import { FolderTree, Folder, File, Copy, Check, Terminal, User, Filter } from 'lucide-react';
import { ProjectStructureNode } from '@/types/project';
import { useToast } from '@/components/Toast';

interface ProjectStructureSectionProps {
  structure: ProjectStructureNode[];
  projectName: string;
}

export default function ProjectStructureSection({ structure, projectName }: ProjectStructureSectionProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string>('ALL');

  // Collect unique team members who own files
  const membersWithFiles = Array.from(
    new Set(
      structure
        .filter((n) => n.type === 'file' && n.assignedMember && n.assignedMember !== 'Shared / All')
        .map((n) => n.assignedMember as string)
    )
  );

  const filteredStructure = selectedMember === 'ALL'
    ? structure
    : structure.filter((n) => {
        if (n.type === 'dir') return true;
        return n.assignedMember?.toLowerCase() === selectedMember.toLowerCase();
      });

  const formatTreeText = () => {
    return filteredStructure
      .map((n) => `${n.path} ${n.assignedMember ? `[Assigned: ${n.assignedMember}]` : ''} ${n.description ? `# ${n.description}` : ''}`)
      .join('\n');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formatTreeText());
    setCopied(true);
    showToast('Project file structure copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-[#0B0F19] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Subtle atmospheric glow */}
      <div className="absolute top-0 right-0 w-80 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-inner">
            <FolderTree className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Project File Structure & Developer Ownership</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Direct File Mapping
              </span>
            </div>
            <p className="text-xs text-zinc-400">See the exact files your team needs to create, with developer owners tagged on each file</p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="self-start sm:self-auto flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#070A12] hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white transition-all shadow-sm"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
          <span>{copied ? 'Tree Copied' : 'Copy File Tree'}</span>
        </button>
      </div>

      {/* Filter by Team Member */}
      {membersWithFiles.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-5 p-2 rounded-2xl bg-[#070A12] border border-zinc-800/80 relative z-10">
          <span className="text-[11px] font-mono text-zinc-400 font-semibold px-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Show files for:</span>
          </span>
          <button
            onClick={() => setSelectedMember('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedMember === 'ALL'
                ? 'bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-cyan-500/20 text-white border border-indigo-500/40 shadow-sm'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-850'
            }`}
          >
            All Files ({structure.filter((n) => n.type === 'file').length})
          </button>
          {membersWithFiles.map((m) => {
            const count = structure.filter((n) => n.type === 'file' && n.assignedMember === m).length;
            const isSelected = selectedMember === m;
            return (
              <button
                key={m}
                onClick={() => setSelectedMember(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-cyan-500/20 text-white border border-indigo-500/40 shadow-sm'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-850'
                }`}
              >
                <span>{m}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-zinc-800/80 text-zinc-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Terminal Tree View */}
      <div className="bg-[#070A12] rounded-2xl border border-zinc-800/90 overflow-hidden font-mono text-xs shadow-inner relative z-10">
        <div className="bg-[#05080E] px-4 py-3 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-zinc-400 text-xs ml-2 font-mono">{projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}/</span>
          </div>
          <span className="text-[11px] font-sans text-zinc-400">
            {selectedMember === 'ALL' ? 'Showing complete project files' : `Showing assigned files for ${selectedMember}`}
          </span>
        </div>

        <div className="p-4 space-y-1 max-h-96 overflow-y-auto">
          {filteredStructure.map((node, idx) => {
            const isDir = node.type === 'dir' || node.path.endsWith('/');
            const depth = (node.path.match(/\//g) || []).length;
            const indent = Math.max(0, isDir ? depth - 1 : depth);

            const isOwner = selectedMember !== 'ALL' && node.assignedMember?.toLowerCase() === selectedMember.toLowerCase();

            return (
              <div
                key={idx}
                className={`flex items-center justify-between px-3 py-1.5 rounded-xl transition-colors group ${
                  isOwner ? 'bg-indigo-500/15 border border-indigo-500/30' : 'hover:bg-zinc-900/60'
                }`}
                style={{ paddingLeft: `${indent * 16 + 12}px` }}
              >
                <div className="flex items-center space-x-2.5 text-zinc-300 min-w-0">
                  {isDir ? (
                    <Folder className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  ) : (
                    <File className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  )}
                  <span className={`truncate ${isDir ? 'text-zinc-200 font-bold' : isOwner ? 'text-white font-bold' : 'text-zinc-300'}`}>
                    {node.path}
                  </span>
                </div>

                <div className="flex items-center space-x-2.5 flex-shrink-0 ml-3">
                  {/* File purpose description */}
                  {node.description && (
                    <span className="text-[11px] text-zinc-500 group-hover:text-zinc-400 font-sans hidden md:block max-w-xs truncate">
                      {node.description}
                    </span>
                  )}

                  {/* Assigned member tag */}
                  {node.assignedMember && (
                    <span
                      className={`text-[10px] font-sans px-2.5 py-0.5 rounded-full font-semibold ${
                        node.assignedMember === 'Shared / All'
                          ? 'bg-zinc-800 text-zinc-400 border border-zinc-700/60'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {node.assignedMember}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
