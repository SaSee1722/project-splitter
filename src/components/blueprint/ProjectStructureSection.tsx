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
        if (n.type === 'dir') return true; // keep directory markers or filter based on children
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
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100 tracking-tight">Project File Structure & Developer Ownership</h2>
            <p className="text-xs text-zinc-400">See the exact files your team needs to create, with developer owners tagged on each file</p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="self-start sm:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
          <span>{copied ? 'Tree Copied' : 'Copy File Tree'}</span>
        </button>
      </div>

      {/* Filter by Team Member */}
      {membersWithFiles.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-5 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
          <span className="text-[11px] text-zinc-400 font-medium px-2 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" />
            Show files for:
          </span>
          <button
            onClick={() => setSelectedMember('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              selectedMember === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Files ({structure.filter((n) => n.type === 'file').length})
          </button>
          {membersWithFiles.map((m) => {
            const count = structure.filter((n) => n.type === 'file' && n.assignedMember === m).length;
            return (
              <button
                key={m}
                onClick={() => setSelectedMember(m)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  selectedMember === m
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{m}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Terminal Tree View */}
      <div className="bg-zinc-950 rounded-xl border border-zinc-800/80 overflow-hidden font-mono text-xs">
        <div className="bg-zinc-900/90 px-4 py-2.5 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-zinc-400 text-[11px] ml-2">{projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}/</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-sans">
            {selectedMember === 'ALL' ? 'Showing complete project files' : `Showing assigned files for ${selectedMember}`}
          </span>
        </div>

        <div className="p-4 space-y-1.5 max-h-96 overflow-y-auto">
          {filteredStructure.map((node, idx) => {
            const isDir = node.type === 'dir' || node.path.endsWith('/');
            const depth = (node.path.match(/\//g) || []).length;
            const indent = Math.max(0, isDir ? depth - 1 : depth);

            const isOwner = selectedMember !== 'ALL' && node.assignedMember?.toLowerCase() === selectedMember.toLowerCase();

            return (
              <div
                key={idx}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded transition-colors group ${
                  isOwner ? 'bg-indigo-500/15 border border-indigo-500/30' : 'hover:bg-zinc-900/60'
                }`}
                style={{ paddingLeft: `${indent * 16 + 10}px` }}
              >
                <div className="flex items-center space-x-2 text-zinc-300 min-w-0">
                  {isDir ? (
                    <Folder className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  ) : (
                    <File className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                  )}
                  <span className={`truncate ${isDir ? 'text-indigo-300 font-medium' : isOwner ? 'text-white font-bold' : 'text-zinc-200'}`}>
                    {node.path}
                  </span>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                  {/* File purpose description */}
                  {node.description && (
                    <span className="text-[11px] text-zinc-500 group-hover:text-zinc-400 font-sans hidden md:block max-w-xs truncate">
                      {node.description}
                    </span>
                  )}

                  {/* Assigned member tag */}
                  {node.assignedMember && (
                    <span
                      className={`text-[10px] font-sans px-2 py-0.5 rounded-full font-medium ${
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
