'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  PlusCircle,
  Trash2,
  Edit3,
  Calendar,
  Users,
  Layers,
  Search,
  Sparkles,
  Cpu,
  Check,
  X,
  Code2,
  ArrowRight,
  FileCode2,
} from 'lucide-react';
import { getAllProjects, renameProject, deleteProject } from '@/services/projectStorage';
import { SavedProject } from '@/types/project';
import { useToast } from '@/components/Toast';

const AVATAR_COLORS = [
  { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
  { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
];

export default function ProjectsHistoryPage() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const loadProjects = () => setProjects(getAllProjects());

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteProject(id);
      loadProjects();
      showToast(`"${name}" deleted.`, 'info');
    }
  };

  const startRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setNewName(currentName);
  };

  const handleSaveRename = (id: string) => {
    if (!newName.trim()) {
      showToast('Name cannot be empty.', 'error');
      return;
    }
    renameProject(id, newName.trim());
    setRenamingId(null);
    loadProjects();
    showToast('Project renamed.', 'success');
  };

  const filteredProjects = projects.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.input.projectName.toLowerCase().includes(q) ||
      p.input.technology.toLowerCase().includes(q) ||
      p.input.teamMembers.some((m) => m.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                <FolderGit2 className="w-5 h-5 text-indigo-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Saved Blueprints
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              Access your previously generated project plans, screen assignments, and team blueprints.
            </p>
          </div>

          <Link
            href="/create"
            className="self-start sm:self-auto inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Plan</span>
          </Link>
        </div>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects, tech, or member..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
            />
          </div>
          <span className="text-xs font-mono font-medium text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm self-start sm:self-auto">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>

        {/* Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto mb-4">
              <FolderGit2 className="w-7 h-7 text-indigo-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {searchTerm ? 'No Matching Projects' : 'No Saved Projects Yet'}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
              {searchTerm
                ? 'Try different keywords or clear the search.'
                : 'Create your first project plan to see it here.'}
            </p>
            <Link
              href="/create"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Generate First Blueprint</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => {
              const totalScreens =
                project.blueprint.screens.length +
                (project.blueprint.aiSuggestedScreens?.length || 0);
              const totalFiles = project.blueprint.projectStructure.filter((n) => n.type === 'file').length;

              const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              const isRenaming = renamingId === project.id;

              return (
                <div
                  key={project.id}
                  className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  <div>
                    {/* Top badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1.5">
                        <Code2 className="w-3 h-3 text-indigo-500" />
                        {project.input.technology}
                      </span>
                      {project.source === 'gemini' ? (
                        <span className="text-xs text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 font-mono font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-500" />
                          Gemini
                        </span>
                      ) : (
                        <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-mono font-semibold flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-amber-500" />
                          Local
                        </span>
                      )}
                    </div>

                    {/* Project name or rename input */}
                    {isRenaming ? (
                      <div className="flex items-center space-x-1.5 mb-2">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(project.id)}
                          className="flex-1 px-3 py-1.5 text-sm bg-white border border-indigo-500 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRename(project.id)}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setRenamingId(null)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-700 transition-colors mb-2 line-clamp-1">
                        {project.input.projectName}
                      </h3>
                    )}

                    {/* Hackathon name if available */}
                    {project.input.hackathonName && (
                      <p className="text-xs text-indigo-600 font-medium mb-2 truncate">{project.input.hackathonName}</p>
                    )}

                    {/* Brief overview */}
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                      {project.blueprint.projectOverview?.split('\n')[0] || 'No overview available.'}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 p-2 rounded-lg">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="font-bold text-slate-800 text-xs">{project.input.teamMembers.length}</span>
                        <span className="text-slate-400 text-xs">Members</span>
                      </div>
                      <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 p-2 rounded-lg">
                        <Layers className="w-3.5 h-3.5 text-violet-500" />
                        <span className="font-bold text-slate-800 text-xs">{totalScreens}</span>
                        <span className="text-slate-400 text-xs">Screens</span>
                      </div>
                    </div>

                    {/* Team avatars */}
                    <div className="flex items-center flex-wrap gap-1.5 mb-3">
                      {project.input.teamMembers.map((m, mIdx) => {
                        const colors = AVATAR_COLORS[mIdx % AVATAR_COLORS.length];
                        const initials = m.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
                        return (
                          <div
                            key={mIdx}
                            className={`w-7 h-7 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center`}
                            title={m.name}
                          >
                            <span className={`text-[11px] font-bold font-mono ${colors.text}`}>{initials}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-300" />
                      {formattedDate}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => startRename(project.id, project.input.projectName)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Rename"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, project.input.projectName)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/blueprint/${project.id}`}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
