'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FolderGit2, 
  PlusCircle, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Calendar, 
  Users, 
  Layers, 
  Search, 
  Sparkles, 
  Cpu,
  Check,
  X
} from 'lucide-react';
import { getAllProjects, renameProject, deleteProject } from '@/services/projectStorage';
import { SavedProject } from '@/types/project';
import { useToast } from '@/components/Toast';

export default function ProjectsHistoryPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const loadProjects = () => {
    const list = getAllProjects();
    setProjects(list);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProject(id);
      loadProjects();
      showToast(`Project "${name}" deleted.`, 'info');
    }
  };

  const startRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setNewName(currentName);
  };

  const handleSaveRename = (id: string) => {
    if (!newName.trim()) {
      showToast('Project name cannot be empty', 'error');
      return;
    }
    renameProject(id, newName.trim());
    setRenamingId(null);
    loadProjects();
    showToast('Project renamed successfully.', 'success');
  };

  const filteredProjects = projects.filter((p) => {
    const nameMatch = p.input.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const techMatch = p.input.technology.toLowerCase().includes(searchTerm.toLowerCase());
    const memberMatch = p.input.teamMembers.some((m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return nameMatch || techMatch || memberMatch;
  });

  return (
    <div className="min-h-screen bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
              <FolderGit2 className="w-7 h-7 text-cyan-400" />
              <span>Project History</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Review, manage, rename, and export previously generated project blueprints.
            </p>
          </div>

          <Link
            href="/create"
            className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Project</span>
          </Link>
        </div>

        {/* Search bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by project name, tech, or developer..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-zinc-500">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
          </span>
        </div>

        {/* Project List */}
        {filteredProjects.length === 0 ? (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto mb-4">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-200 mb-1">No Projects Found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">
              {searchTerm
                ? 'No projects match your current search query. Try searching for a different keyword.'
                : 'You have not created any projects yet. Start by defining your first project idea.'}
            </p>
            <Link
              href="/create"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create First Project</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const totalScreens =
                project.blueprint.screens.length +
                (project.blueprint.aiSuggestedScreens?.length || 0);

              const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              const isRenaming = renamingId === project.id;

              return (
                <div
                  key={project.id}
                  className="bg-zinc-900 border border-zinc-800/90 rounded-2xl p-5 hover:border-zinc-700/80 transition-all flex flex-col justify-between group shadow-sm"
                >
                  <div>
                    {/* Header: Tech badge & Intelligence badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {project.input.technology}
                      </span>
                      {project.source === 'gemini' ? (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Gemini
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono flex items-center gap-1">
                          <Cpu className="w-3 h-3" />
                          Architect
                        </span>
                      )}
                    </div>

                    {/* Title or Rename input */}
                    {isRenaming ? (
                      <div className="flex items-center space-x-1.5 mb-2">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="flex-1 px-2.5 py-1 text-xs bg-zinc-950 border border-indigo-500 rounded-lg text-zinc-100 focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRename(project.id)}
                          className="p-1 text-emerald-400 hover:text-emerald-300"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setRenamingId(null)}
                          className="p-1 text-zinc-400 hover:text-zinc-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <h3 className="font-bold text-base text-zinc-100 group-hover:text-indigo-300 transition-colors mb-2 line-clamp-1">
                        {project.input.projectName}
                      </h3>
                    )}

                    {/* Summary snippet */}
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                      {project.blueprint.projectOverview}
                    </p>

                    {/* Stats pills */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400 mb-4 bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800/80">
                      <div className="flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{project.input.teamMembers.length} Members</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                        <span>{totalScreens} Screens</span>
                      </div>
                    </div>

                    {/* Team Members List */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.input.teamMembers.map((m, mIdx) => (
                        <span
                          key={mIdx}
                          className="text-[10px] px-2 py-0.5 rounded bg-zinc-800/90 text-zinc-300"
                        >
                          {m.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </span>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => startRename(project.id, project.input.projectName)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
                        title="Rename Project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, project.input.projectName)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/blueprint/${project.id}`}
                        className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold text-xs transition-colors"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
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
