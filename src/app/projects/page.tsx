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
  X,
  Code2,
  ArrowRight
} from 'lucide-react';
import { getAllProjects, renameProject, deleteProject } from '@/services/projectStorage';
import { SavedProject } from '@/types/project';
import { useToast } from '@/components/Toast';

const avatarGradients = [
  'from-amber-400 to-orange-500',
  'from-indigo-400 to-purple-500',
  'from-cyan-400 to-blue-500',
  'from-emerald-400 to-teal-500',
  'from-rose-400 to-pink-500',
];

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
    <div className="min-h-screen bg-[#07090E] text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-inner">
                <FolderGit2 className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Saved Blueprints
                </h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Access your previously generated architectural plans, screen specifications, and file assignments.
            </p>
          </div>

          <Link
            href="/create"
            className="self-start sm:self-auto inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 hover:from-amber-400 hover:to-cyan-400 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Plan</span>
          </Link>
        </div>

        {/* Search bar & project counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by project name, tech, or developer..."
              className="w-full pl-11 pr-4 py-2.5 bg-[#0B0F19] border border-zinc-800/90 rounded-2xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/70 shadow-inner"
            />
          </div>
          <span className="text-xs font-mono font-medium text-zinc-400 bg-[#0B0F19] px-3.5 py-1.5 rounded-xl border border-zinc-800/80 self-start sm:self-auto">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'Project Saved' : 'Projects Saved'}
          </span>
        </div>

        {/* Project List */}
        {filteredProjects.length === 0 ? (
          <div className="bg-[#0B0F19] border border-zinc-800/90 rounded-3xl p-12 text-center shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/5">
              <FolderGit2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {searchTerm ? 'No Matching Projects' : 'No Saved Projects Yet'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto mb-6 leading-relaxed">
              {searchTerm
                ? 'Try searching with different keywords or clear the search filter.'
                : 'Turn your first problem statement or project idea into an actionable team architecture.'}
            </p>
            <Link
              href="/create"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 hover:from-amber-400 hover:to-cyan-400 transition-all"
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

              const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              const isRenaming = renamingId === project.id;

              return (
                <div
                  key={project.id}
                  className="bg-[#0B0F19] border border-zinc-800/90 hover:border-zinc-700 rounded-3xl p-6 transition-all flex flex-col justify-between group shadow-xl hover:shadow-indigo-950/20"
                >
                  <div>
                    {/* Top row: Tech Badge & Source Beacon */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                        <Code2 className="w-3 h-3 text-indigo-400" />
                        {project.input.technology}
                      </span>
                      {project.source === 'gemini' ? (
                        <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-mono font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          Gemini 2.5
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-mono font-semibold flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-amber-400" />
                          Architect
                        </span>
                      )}
                    </div>

                    {/* Title or Rename Input */}
                    {isRenaming ? (
                      <div className="flex items-center space-x-1.5 mb-2">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs bg-zinc-950 border border-indigo-500 rounded-xl text-white focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRename(project.id)}
                          className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setRenamingId(null)}
                          className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-indigo-300 transition-colors mb-2 line-clamp-1">
                        {project.input.projectName}
                      </h3>
                    )}

                    {/* Summary snippet */}
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                      {project.blueprint.projectOverview}
                    </p>

                    {/* Stats pills */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 mb-4 bg-[#070A12] p-3 rounded-2xl border border-zinc-800/80">
                      <div className="flex items-center space-x-2">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-semibold text-white">{project.input.teamMembers.length}</span>
                        <span className="text-zinc-500 text-[11px]">Devs</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-semibold text-white">{totalScreens}</span>
                        <span className="text-zinc-500 text-[11px]">Screens</span>
                      </div>
                    </div>

                    {/* Team Members Avatar Stack */}
                    <div className="flex items-center space-x-1 mb-4 overflow-hidden">
                      {project.input.teamMembers.map((m, mIdx) => {
                        const gradient = avatarGradients[mIdx % avatarGradients.length];
                        const initials = m.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2);

                        return (
                          <div
                            key={mIdx}
                            className={`w-6 h-6 rounded-full bg-gradient-to-tr ${gradient} p-[1px] shadow-sm flex-shrink-0`}
                            title={m.name}
                          >
                            <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-[9px] font-bold text-white">
                              {initials}
                            </div>
                          </div>
                        );
                      })}
                      <span className="text-[11px] text-zinc-500 pl-1.5 font-medium">
                        {project.input.teamMembers.map((m) => m.name).join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3.5 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                      {formattedDate}
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => startRename(project.id, project.input.projectName)}
                        className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
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
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-cyan-500/15 text-white border border-indigo-500/30 hover:border-indigo-400/60 font-semibold text-xs transition-all shadow-sm"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3 text-cyan-400" />
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
