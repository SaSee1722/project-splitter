'use client';

import React, { useState } from 'react';
import { FolderTree, Folder, File, Copy, Check, Terminal } from 'lucide-react';
import { ProjectStructureNode } from '@/types/project';
import { useToast } from '@/components/Toast';

interface ProjectStructureSectionProps {
  structure: ProjectStructureNode[];
  projectName: string;
}

export default function ProjectStructureSection({ structure, projectName }: ProjectStructureSectionProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const formatTreeText = () => {
    return structure.map((n) => `${n.path} ${n.description ? `# ${n.description}` : ''}`).join('\n');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formatTreeText());
    setCopied(true);
    showToast('Project structure copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100 tracking-tight">GitHub-Ready Project Structure</h2>
            <p className="text-xs text-zinc-400">Clean starter directory layout adhering to industry best practices</p>
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

      {/* Terminal View */}
      <div className="bg-zinc-950 rounded-xl border border-zinc-800/80 overflow-hidden font-mono text-xs">
        <div className="bg-zinc-900/90 px-4 py-2.5 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-zinc-500 text-[11px] ml-2">{projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}/</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-sans">Starter Skeleton</span>
        </div>

        <div className="p-4 space-y-1.5 max-h-96 overflow-y-auto">
          {structure.map((node, idx) => {
            const isDir = node.type === 'dir' || node.path.endsWith('/');
            const depth = (node.path.match(/\//g) || []).length;
            const indent = Math.max(0, isDir ? depth - 1 : depth);

            return (
              <div
                key={idx}
                className="flex items-center justify-between hover:bg-zinc-900/60 px-2 py-1 rounded transition-colors group"
                style={{ paddingLeft: `${indent * 16 + 8}px` }}
              >
                <div className="flex items-center space-x-2 text-zinc-300">
                  {isDir ? (
                    <Folder className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  ) : (
                    <File className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                  )}
                  <span className={isDir ? 'text-indigo-300 font-medium' : 'text-zinc-300'}>
                    {node.path}
                  </span>
                </div>

                {node.description && (
                  <span className="text-[11px] text-zinc-500 group-hover:text-zinc-400 font-sans hidden sm:block">
                    {node.description}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
