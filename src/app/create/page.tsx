'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Plus,
  Trash2,
  Users,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Wand2,
  UserPlus,
  ChevronDown,
  Building2,
  FileText,
  Lightbulb,
  Loader2,
  Brain,
  Edit3,
  Check,
  X,
  Trophy,
} from 'lucide-react';
import { TechStack, TeamMemberInput, PlannedScreenInput, ProjectInput } from '@/types/project';
import { saveProject, getCustomApiKey } from '@/services/projectStorage';
import { useToast } from '@/components/Toast';
import LoadingOverlay from '@/components/LoadingOverlay';

const TECH_OPTIONS: { name: TechStack; icon: string; desc: string }[] = [
  { name: 'React', icon: '⚛️', desc: 'Web SPA' },
  { name: 'Next.js', icon: '▲', desc: 'Full-Stack' },
  { name: 'React Native', icon: '📱', desc: 'Mobile' },
  { name: 'Flutter', icon: '💙', desc: 'Cross-Platform' },
  { name: 'Vite', icon: '⚡', desc: 'Fast Web' },
  { name: 'Node.js', icon: '🟢', desc: 'Backend' },
  { name: 'Vue.js', icon: '💚', desc: 'Vue Web' },
  { name: 'Svelte', icon: '🧡', desc: 'Svelte' },
  { name: 'Other', icon: '💻', desc: 'Custom' },
];

const ROLE_OPTIONS = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'Database Developer',
  'AI/ML Developer',
  'Mobile App Developer',
  'Web Developer',
  'DevOps Engineer',
  'Testing / QA',
  'Project Lead',
  'Security Engineer',
  'Other',
];

const EXPERIENCE_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const SAMPLE_PROJECT = {
  name: 'Smart Habit Tracker',
  hackathon: 'National College Hackathon 2024',
  problem: 'Many students struggle to maintain consistent daily habits because they forget tasks, lack motivation, and cannot easily track their progress.',
  solution: 'An application that allows students to create habits, receive reminders, track daily completion, monitor progress, and receive AI-based suggestions.',
  tech: 'React Native' as TechStack,
  members: [
    { id: '1', name: 'Arun', role: 'Frontend Developer', experience: 'Intermediate', skills: 'React, TypeScript, CSS' },
    { id: '2', name: 'Kumar', role: 'Backend Developer', experience: 'Advanced', skills: 'Node.js, PostgreSQL, REST APIs' },
    { id: '3', name: 'Priya', role: 'UI/UX Designer', experience: 'Intermediate', skills: 'Figma, User Research, Design Systems' },
    { id: '4', name: 'Rahul', role: 'AI/ML Developer', experience: 'Intermediate', skills: 'Python, TensorFlow, NLP' },
  ],
};

const MEMBER_COLORS = [
  { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', badge: 'bg-indigo-600' },
  { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200', badge: 'bg-violet-600' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-600' },
  { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-600' },
  { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200', badge: 'bg-rose-600' },
  { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200', badge: 'bg-sky-600' },
];

interface TeamMemberExtended extends TeamMemberInput {
  experience?: string;
  skills?: string;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);

  // Project details
  const [projectName, setProjectName] = useState('');
  const [hackathonName, setHackathonName] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [solutionMode, setSolutionMode] = useState<'custom' | 'ai'>('custom');
  const [customSolution, setCustomSolution] = useState('');
  const [aiGeneratedSolution, setAiGeneratedSolution] = useState('');
  const [isGeneratingSolution, setIsGeneratingSolution] = useState(false);
  const [editingAiSolution, setEditingAiSolution] = useState(false);
  const [technology, setTechnology] = useState<TechStack>('React Native');

  // Team members
  const [teamMembers, setTeamMembers] = useState<TeamMemberExtended[]>([
    { id: '1', name: 'Arun', role: 'Frontend Developer', experience: 'Intermediate', skills: '' },
    { id: '2', name: 'Kumar', role: 'Backend Developer', experience: 'Intermediate', skills: '' },
  ]);

  // Screens (optional)
  const [hasPlannedScreens, setHasPlannedScreens] = useState(false);
  const [plannedScreens, setPlannedScreens] = useState<PlannedScreenInput[]>([
    { id: 's1', name: 'Home' },
    { id: 's2', name: 'Dashboard' },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ─── Load Sample Data ───────────────────────────────────────
  const handleLoadSample = () => {
    setProjectName(SAMPLE_PROJECT.name);
    setHackathonName(SAMPLE_PROJECT.hackathon);
    setProblemStatement(SAMPLE_PROJECT.problem);
    setSolutionMode('custom');
    setCustomSolution(SAMPLE_PROJECT.solution);
    setTechnology(SAMPLE_PROJECT.tech);
    setTeamMembers(SAMPLE_PROJECT.members);
    setHasPlannedScreens(false);
    showToast('Sample project loaded!', 'info');
  };

  // ─── AI Solution Generation ──────────────────────────────────
  const handleGenerateAiSolution = async () => {
    if (!problemStatement.trim() || problemStatement.trim().length < 10) {
      showToast('Please enter a problem statement first.', 'error');
      return;
    }
    setIsGeneratingSolution(true);
    setAiGeneratedSolution('');
    try {
      const customKey = getCustomApiKey();
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customKey ? { 'x-gemini-api-key': customKey } : {}),
        },
        body: JSON.stringify({
          mode: 'generate-solution',
          problemStatement: problemStatement.trim(),
          projectName: projectName.trim() || 'Project',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate solution');
      if (data.solution) {
        setAiGeneratedSolution(data.solution);
        setSolutionMode('ai');
        showToast('AI solution generated!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to generate solution', 'error');
    } finally {
      setIsGeneratingSolution(false);
    }
  };

  // ─── Team Member Management ──────────────────────────────────
  const handleAddMember = () => {
    setTeamMembers((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        name: '',
        role: 'Frontend Developer',
        experience: 'Intermediate',
        skills: '',
      },
    ]);
  };

  const handleRemoveMember = (id: string) => {
    if (teamMembers.length <= 1) {
      showToast('At least one team member is required.', 'error');
      return;
    }
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleUpdateMember = (id: string, field: keyof TeamMemberExtended, val: string) => {
    setTeamMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: val } : m)));
  };

  // ─── Screen Management ───────────────────────────────────────
  const handleAddScreen = () => {
    setPlannedScreens((prev) => [...prev, { id: Math.random().toString(36).substring(2, 9), name: '' }]);
  };

  const handleRemoveScreen = (id: string) => {
    setPlannedScreens((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateScreen = (id: string, name: string) => {
    setPlannedScreens((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
  };

  // ─── Validation ──────────────────────────────────────────────
  const validateStep1 = () => {
    if (!projectName.trim()) { showToast('Project name is required.', 'error'); return false; }
    if (!problemStatement.trim() || problemStatement.trim().length < 10) {
      showToast('Problem statement must be at least 10 characters.', 'error'); return false;
    }
    const solution = solutionMode === 'ai' ? aiGeneratedSolution : customSolution;
    if (!solution.trim()) { showToast('Please provide or generate a solution.', 'error'); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (teamMembers.length === 0) { showToast('Add at least one team member.', 'error'); return false; }
    const names = new Set<string>();
    for (const m of teamMembers) {
      if (!m.name.trim()) { showToast('All team members need a name.', 'error'); return false; }
      if (names.has(m.name.toLowerCase())) { showToast(`Duplicate name: "${m.name}". Names must be unique.`, 'error'); return false; }
      names.add(m.name.toLowerCase());
    }
    return true;
  };

  // ─── Main Submit ─────────────────────────────────────────────
  const handleAnalyze = async () => {
    setErrorMessage(null);
    if (!validateStep1() || !validateStep2()) return;

    if (hasPlannedScreens) {
      const empty = plannedScreens.filter((s) => !s.name.trim());
      if (empty.length > 0) { showToast('Please fill in all screen names.', 'error'); return; }
    }

    const solution = solutionMode === 'ai' ? aiGeneratedSolution : customSolution;

    const payload: ProjectInput = {
      projectName: projectName.trim(),
      problemStatement: problemStatement.trim(),
      technology,
      teamMembers: teamMembers.map((m) => ({
        id: m.id,
        name: m.name.trim(),
        role: m.role.trim() || 'Software Engineer',
        experience: m.experience,
        skills: m.skills,
      })),
      hasPlannedScreens,
      plannedScreens: hasPlannedScreens
        ? plannedScreens.map((s) => ({ id: s.id, name: s.name.trim() }))
        : [],
      hackathonName: hackathonName.trim(),
      solution: solution.trim(),
    };

    setIsLoading(true);
    try {
      const customKey = getCustomApiKey();
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customKey ? { 'x-gemini-api-key': customKey } : {}),
        },
        body: JSON.stringify({ input: payload }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to analyze project.');
      if (!data.blueprint) throw new Error('Invalid response from AI service.');
      const saved = saveProject(payload, data.blueprint, data.source);
      showToast('Blueprint generated successfully!', 'success');
      router.push(`/blueprint/${saved.id}`);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
      showToast(err.message || 'Analysis failed', 'error');
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) =>
    name.split(' ').filter(Boolean).map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  const steps = [
    { num: 1, label: 'Project Details' },
    { num: 2, label: 'Team Members' },
    { num: 3, label: 'Review & Generate' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      {isLoading && <LoadingOverlay projectName={projectName} />}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Project Splitter AI</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Create Your Project Plan
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Fill in your project details and let AI generate a complete team blueprint.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLoadSample}
              className="hidden sm:flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-sm font-medium transition-all"
            >
              <Trophy className="w-4 h-4" />
              <span>Load Sample</span>
            </button>
          </div>

          {/* Step progress */}
          <div className="flex items-center space-x-2">
            {steps.map((step, idx) => (
              <React.Fragment key={step.num}>
                <button
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    currentStep === step.num
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : currentStep > step.num
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  {currentStep > step.num ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-xs font-mono">{step.num}</span>
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div className="h-0.5 w-6 bg-slate-200" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start space-x-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-800">Unable to generate blueprint</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* ── STEP 1: Project Details ── */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            {/* Project Identity */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Project Identity</h2>
                  <p className="text-xs text-slate-500">Basic project information</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Project Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., Smart Habit Tracker, FleetPulse, HealthConnect"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Hackathon / Event Name <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={hackathonName}
                      onChange={(e) => setHackathonName(e.target.value)}
                      placeholder="e.g., National College Hackathon 2024"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Problem Statement */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Problem Statement</h2>
                  <p className="text-xs text-slate-500">What problem are you solving?</p>
                </div>
              </div>

              <textarea
                rows={4}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="Describe the problem clearly. Who has this problem? What are they struggling with? Why is this important to solve?"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all leading-relaxed resize-none"
              />
              <p className="mt-2 text-xs text-slate-400">
                Tip: The more detailed your problem statement, the better the AI can generate screens and architecture.
              </p>
            </div>

            {/* Solution */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Solution</h2>
                  <p className="text-xs text-slate-500">How will you solve the problem?</p>
                </div>
              </div>

              {/* Solution mode toggle */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => setSolutionMode('custom')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    solutionMode === 'custom'
                      ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <Edit3 className={`w-4 h-4 ${solutionMode === 'custom' ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className={`text-sm font-bold ${solutionMode === 'custom' ? 'text-indigo-900' : 'text-slate-600'}`}>
                        Use My Solution
                      </span>
                    </div>
                    {solutionMode === 'custom' && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <p className="text-xs text-slate-500">Enter your own proposed solution</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSolutionMode('ai')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    solutionMode === 'ai'
                      ? 'bg-violet-50 border-violet-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <Brain className={`w-4 h-4 ${solutionMode === 'ai' ? 'text-violet-600' : 'text-slate-400'}`} />
                      <span className={`text-sm font-bold ${solutionMode === 'ai' ? 'text-violet-900' : 'text-slate-600'}`}>
                        Generate with AI
                      </span>
                    </div>
                    {solutionMode === 'ai' && aiGeneratedSolution && <Check className="w-4 h-4 text-violet-600" />}
                  </div>
                  <p className="text-xs text-slate-500">Let Gemini propose a solution</p>
                </button>
              </div>

              {solutionMode === 'custom' && (
                <textarea
                  rows={4}
                  value={customSolution}
                  onChange={(e) => setCustomSolution(e.target.value)}
                  placeholder="Describe your proposed solution. What will the app do? What are the main features? How will it solve the problem?"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all leading-relaxed resize-none"
                />
              )}

              {solutionMode === 'ai' && (
                <div className="space-y-3">
                  {!aiGeneratedSolution ? (
                    <button
                      type="button"
                      onClick={handleGenerateAiSolution}
                      disabled={isGeneratingSolution || !problemStatement.trim()}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-sm disabled:opacity-50 transition-all"
                    >
                      {isGeneratingSolution ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating Solution...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Solution with Gemini</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-violet-700 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> AI Generated Solution
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setEditingAiSolution(!editingAiSolution)}
                            className="text-xs text-slate-500 hover:text-indigo-600 transition-colors flex items-center space-x-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{editingAiSolution ? 'Done' : 'Edit'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleGenerateAiSolution}
                            disabled={isGeneratingSolution}
                            className="text-xs text-slate-500 hover:text-violet-600 transition-colors"
                          >
                            {isGeneratingSolution ? 'Generating...' : 'Regenerate'}
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={6}
                        value={aiGeneratedSolution}
                        onChange={(e) => setAiGeneratedSolution(e.target.value)}
                        readOnly={!editingAiSolution}
                        className={`w-full px-4 py-3 border rounded-xl text-sm text-slate-900 leading-relaxed resize-none transition-all ${
                          editingAiSolution
                            ? 'bg-white border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100'
                            : 'bg-violet-50 border-violet-200 cursor-default'
                        }`}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Technology Stack */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <span className="text-base">⚙️</span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Technology Stack</h2>
                  <p className="text-xs text-slate-500">Choose your primary framework</p>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {TECH_OPTIONS.map((tech) => (
                  <button
                    key={tech.name}
                    type="button"
                    onClick={() => setTechnology(tech.name)}
                    className={`px-2 py-3 rounded-xl text-xs font-medium border flex flex-col items-center space-y-1 transition-all ${
                      technology === tech.name
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <span className="text-lg">{tech.icon}</span>
                    <span className="font-semibold leading-tight text-center">{tech.name}</span>
                    <span className="text-[10px] text-slate-400">{tech.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => { if (validateStep1()) setCurrentStep(2); }}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all"
              >
                <span>Next: Team Members</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Team Members ── */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center">
                    <Users className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Team Members</h2>
                    <p className="text-xs text-slate-500">{teamMembers.length} members added</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              </div>

              <p className="text-sm text-slate-500 mb-5">
                AI will distribute work intelligently based on each member&apos;s role and skills.
              </p>

              <div className="space-y-3">
                {teamMembers.map((member, index) => {
                  const colors = MEMBER_COLORS[index % MEMBER_COLORS.length];
                  const initials = getInitials(member.name);
                  return (
                    <div
                      key={member.id}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center flex-shrink-0`}>
                          <span className={`text-sm font-bold font-mono ${colors.text}`}>{initials}</span>
                        </div>

                        {/* Name */}
                        <div className="flex-1">
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleUpdateMember(member.id, 'name', e.target.value)}
                            placeholder="Member name"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition-all"
                          />
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={teamMembers.length <= 1}
                          className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {/* Role */}
                        <div className="sm:col-span-1">
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Role</label>
                          <div className="relative">
                            <select
                              value={member.role}
                              onChange={(e) => handleUpdateMember(member.id, 'role', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 appearance-none pr-8"
                            >
                              {ROLE_OPTIONS.map((r) => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        {/* Experience */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Experience</label>
                          <div className="relative">
                            <select
                              value={member.experience || 'Intermediate'}
                              onChange={(e) => handleUpdateMember(member.id, 'experience', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 appearance-none pr-8"
                            >
                              {EXPERIENCE_OPTIONS.map((e) => (
                                <option key={e} value={e}>{e}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        {/* Skills */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Skills <span className="text-slate-400 font-normal">(optional)</span>
                          </label>
                          <input
                            type="text"
                            value={member.skills || ''}
                            onChange={(e) => handleUpdateMember(member.id, 'skills', e.target.value)}
                            placeholder="React, Node.js, Python..."
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Optional Screens */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-1">Do you have screens planned?</h2>
              <p className="text-sm text-slate-500 mb-4">Optional — AI can generate screens for you automatically.</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setHasPlannedScreens(false)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    !hasPlannedScreens
                      ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <Sparkles className={`w-4 h-4 ${!hasPlannedScreens ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className={`text-sm font-bold ${!hasPlannedScreens ? 'text-indigo-900' : 'text-slate-600'}`}>
                        Let AI Decide
                      </span>
                    </div>
                    {!hasPlannedScreens && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <p className="text-xs text-slate-500">AI generates the perfect screens for your solution</p>
                </button>

                <button
                  type="button"
                  onClick={() => setHasPlannedScreens(true)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    hasPlannedScreens
                      ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <FileText className={`w-4 h-4 ${hasPlannedScreens ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className={`text-sm font-bold ${hasPlannedScreens ? 'text-indigo-900' : 'text-slate-600'}`}>
                        I Have Screens
                      </span>
                    </div>
                    {hasPlannedScreens && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <p className="text-xs text-slate-500">Enter your planned screens manually</p>
                </button>
              </div>

              {hasPlannedScreens && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">Enter your planned screens below</p>
                    <button
                      type="button"
                      onClick={handleAddScreen}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Add Screen</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {plannedScreens.map((screen, idx) => (
                      <div key={screen.id} className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                        <span className="text-xs text-slate-400 font-mono w-5 flex-shrink-0">{idx + 1}.</span>
                        <input
                          type="text"
                          value={screen.name}
                          onChange={(e) => handleUpdateScreen(screen.id, e.target.value)}
                          placeholder="Screen name"
                          className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none min-w-0"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveScreen(screen.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors flex-shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-medium text-sm hover:bg-slate-100 transition-all"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => { if (validateStep2()) setCurrentStep(3); }}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all"
              >
                <span>Review & Generate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Review & Generate ── */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fade-in">
            {/* Project Summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Review Your Project
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">Project</p>
                    <p className="text-sm font-bold text-slate-900">{projectName || '—'}</p>
                    {hackathonName && <p className="text-xs text-slate-500 mt-0.5">{hackathonName}</p>}
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">Tech Stack</p>
                    <p className="text-sm font-bold text-slate-900">{technology}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{teamMembers.length} team members</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">Problem</p>
                  <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">{problemStatement}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
                    Solution {solutionMode === 'ai' ? '(AI Generated)' : '(Custom)'}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                    {solutionMode === 'ai' ? aiGeneratedSolution : customSolution}
                  </p>
                </div>

                {/* Team summary */}
                <div>
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Team</p>
                  <div className="flex flex-wrap gap-2">
                    {teamMembers.map((m, idx) => {
                      const colors = MEMBER_COLORS[idx % MEMBER_COLORS.length];
                      return (
                        <div key={m.id} className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border ${colors.bg} ${colors.border}`}>
                          <span className={`text-xs font-bold ${colors.text}`}>{m.name}</span>
                          <span className="text-slate-400">•</span>
                          <span className={`text-xs ${colors.text} opacity-80`}>{m.role}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* What will be generated */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                AI will generate for you:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Project Architecture',
                  'Required Screens',
                  'User Flow',
                  'File Ownership Map',
                  'Team Work Distribution',
                  'AI Coding Prompts',
                  'GitHub Branch Strategy',
                  'Blueprint Markdown',
                  'Downloadable ZIP',
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span className="text-xs text-indigo-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-base shadow-xl shadow-indigo-200 transition-all flex items-center justify-center space-x-3 disabled:opacity-60 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>Generate Complete Blueprint with Gemini</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-center text-xs text-slate-400">
              Takes 15–30 seconds • Powered by Gemini 2.5 Flash • Strict JSON validation
            </p>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2 rounded-xl border border-slate-300 text-slate-600 font-medium text-sm hover:bg-slate-100 transition-all"
              >
                ← Back to Team
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
