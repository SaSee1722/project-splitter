'use client';

import React, { useState } from 'react';
import { ProjectStructureNode } from '@/types/project';
import { FolderTree, FileCode2, Folder, Copy, CheckCircle2, Search, Filter } from 'lucide-react';
import { useToast } from '@/components/Toast';

interface ProjectStructureSectionProps {
  structure: ProjectStructureNode[];
  projectName: string;
}

export default function ProjectStructureSection({ structure, projectName }: ProjectStructureSectionProps) {
  const { showToast } = useToast();
  const [filterMember, setFilterMember] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const members = ['all', ...Array.from(new Set(
    structure
      .filter((n) => n.type === 'file' && n.assignedMember)
      .map((n) => n.assignedMember as string)
  ))];

  const filteredStructure = structure.filter((node) => {
    const matchesMember = filterMember === 'all' || node.assignedMember === filterMember || node.type === 'dir';
    const matchesSearch = !searchQuery || node.path.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMember && matchesSearch;
  });

  const files = structure.filter((n) => n.type === 'file');
  const dirs = structure.filter((n) => n.type === 'dir');

  const handleCopyStructure = async () => {
    const text = structure.map((n) => {
      const indent = '  '.repeat(n.path.split('/').length - 1);
      const icon = n.type === 'dir' ? '📁' : '📄';
      const memberInfo = n.assignedMember ? ` (${n.assignedMember})` : '';
      return `${indent}${icon} ${n.path.split('/').pop()}${memberInfo}`;
    }).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('File structure copied!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Copy failed.', 'error');
    }
  };

  const MEMBER_COLORS: Record<string, string> = {};
  const colorPalette = [
    'bg-indigo-100 text-indigo-700 border-indigo-200',
    'bg-violet-100 text-violet-700 border-violet-200',
    'bg-emerald-100 text-emerald-700 border-emerald-200',
    'bg-amber-100 text-amber-700 border-amber-200',
    'bg-rose-100 text-rose-700 border-rose-200',
    'bg-sky-100 text-sky-700 border-sky-200',
  ];
  members.filter(m => m !== 'all').forEach((member, idx) => {
    MEMBER_COLORS[member] = colorPalette[idx % colorPalette.length];
  });

  const getIndentLevel = (path: string) => {
    const parts = path.split('/');
    return parts.length - 1;
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              <FolderTree className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Project File Structure</h3>
              <p className="text-sm text-slate-500">{dirs.length} folders · {files.length} files</p>
            </div>
          </div>

          <button
            onClick={handleCopyStructure}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              copied
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {copied ? (
              <><CheckCircle2 className="w-4 h-4" /><span>Copied!</span></>
            ) : (
              <><Copy className="w-4 h-4 text-slate-400" /><span>Copy Structure</span></>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 border-b border-slate-200 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          {members.map((member) => (
            <button
              key={member}
              onClick={() => setFilterMember(member)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-all border ${
                filterMember === member
                  ? member === 'all'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : `${MEMBER_COLORS[member]} border`
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {member === 'all' ? 'All Files' : member}
            </button>
          ))}
        </div>
      </div>

      {/* File Tree */}
      <div className="p-4 overflow-x-auto">
        <div className="bg-slate-950 rounded-xl p-4 min-w-0 font-mono text-sm">
          <div className="text-slate-400 mb-3 text-xs">
            📁 {projectName.toLowerCase().replace(/\s+/g, '-')}/
          </div>
          <div className="space-y-0.5">
            {filteredStructure.map((node, idx) => {
              const indent = getIndentLevel(node.path);
              const name = node.path.split('/').pop() || node.path;

              return (
                <div
                  key={idx}
                  className="flex items-center group hover:bg-slate-900 rounded-lg px-2 py-0.5 -mx-2 transition-colors"
                  style={{ paddingLeft: `${indent * 16 + 8}px` }}
                >
                  {node.type === 'dir' ? (
                    <Folder className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mr-2" />
                  ) : (
                    <FileCode2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mr-2" />
                  )}
                  <span className={`${node.type === 'dir' ? 'text-amber-300' : 'text-slate-200'} text-xs`}>
                    {name}
                  </span>
                  {node.assignedMember && node.type === 'file' && (
                    <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded border ${MEMBER_COLORS[node.assignedMember] || 'bg-slate-700 text-slate-300 border-slate-600'} flex-shrink-0`}>
                      {node.assignedMember}
                    </span>
                  )}
                  {node.description && (
                    <span className="ml-2 text-[10px] text-slate-500 hidden group-hover:inline truncate">
                      — {node.description}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
