'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Users, 
  Code2, 
  Monitor, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Wand2,
  Truck,
  HeartPulse,
  ShoppingBag,
  Cpu,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { TechStack, TeamMemberInput, PlannedScreenInput, ProjectInput } from '@/types/project';
import { saveProject, getCustomApiKey } from '@/services/projectStorage';
import { useToast } from '@/components/Toast';
import LoadingOverlay from '@/components/LoadingOverlay';

const TECH_OPTIONS: { name: TechStack; icon: string }[] = [
  { name: 'React', icon: '⚛️' },
  { name: 'Next.js', icon: '▲' },
  { name: 'React Native', icon: '📱' },
  { name: 'Flutter', icon: '💙' },
  { name: 'Vite', icon: '⚡' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'Vue.js', icon: '💚' },
  { name: 'Svelte', icon: '🧡' },
  { name: 'Other', icon: '💻' },
];

const ROLE_PRESETS = [
  'Frontend Developer',
  'Backend Developer',
  'UI/UX Developer',
  'Full Stack Developer',
  'Mobile Engineer',
  'QA / Testing Engineer',
];

const PRESET_IDEAS = [
  {
    id: 'logistics',
    name: 'Logistics Dispatch',
    icon: Truck,
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    title: 'RoutePulse - Smart Logistics',
    desc: 'Delivery drivers and dispatchers lack a synchronized dashboard to track parcel delivery statuses, route congestion warnings, and customer proof-of-delivery signatures in real-time. RoutePulse provides instant GPS route recalculations and automated SMS ETA updates.',
    tech: 'React' as TechStack,
    members: [
      { id: '1', name: 'Salabadesh', role: 'Frontend Developer' },
      { id: '2', name: 'Arun', role: 'Full Stack Developer' },
      { id: '3', name: 'Karthik', role: 'UI/UX Developer' },
      { id: '4', name: 'Vijay', role: 'Backend Developer' },
    ],
  },
  {
    id: 'healthcare',
    name: 'Telehealth Vitals',
    icon: HeartPulse,
    color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400',
    title: 'CarePulse - Patient Telehealth',
    desc: 'Patients recovering at home struggle with manually tracking blood pressure, medication adherence, and doctor video appointments. CarePulse synchronizes Bluetooth medical peripherals and alerts doctors to vital anomalies.',
    tech: 'React Native' as TechStack,
    members: [
      { id: '1', name: 'Dr. Sarah', role: 'Product Lead' },
      { id: '2', name: 'Alex', role: 'Mobile Engineer' },
      { id: '3', name: 'Devon', role: 'Backend Engineer' },
    ],
  },
  {
    id: 'ecommerce',
    name: 'Craft Marketplace',
    icon: ShoppingBag,
    color: 'from-cyan-500/20 to-indigo-500/10 border-cyan-500/30 text-cyan-400',
    title: 'ArtisanBazaar - Maker Shop',
    desc: 'Independent craft makers need an omnichannel storefront with automated inventory synchronization across pop-up retail stalls and web orders with Stripe checkout.',
    tech: 'Next.js' as TechStack,
    members: [
      { id: '1', name: 'Maya', role: 'UI/UX Developer' },
      { id: '2', name: 'Salabadesh', role: 'Frontend Developer' },
      { id: '3', name: 'Leo', role: 'Backend Developer' },
    ],
  },
];

const MEMBER_COLORS = [
  'from-amber-500 to-orange-600',
  'from-indigo-500 to-purple-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-violet-500 to-fuchsia-600',
];

export default function CreateProjectPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [projectName, setProjectName] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [technology, setTechnology] = useState<TechStack>('React');

  // Dynamic Team Members
  const [teamMembers, setTeamMembers] = useState<TeamMemberInput[]>([
    { id: '1', name: 'Salabadesh', role: 'Frontend Developer' },
    { id: '2', name: 'Arun', role: 'Full Stack Developer' },
    { id: '3', name: 'Karthik', role: 'UI/UX Developer' },
    { id: '4', name: 'Vijay', role: 'Backend Developer' },
  ]);

  // Optional Planned Screens
  const [hasPlannedScreens, setHasPlannedScreens] = useState<boolean>(false);
  const [plannedScreens, setPlannedScreens] = useState<PlannedScreenInput[]>([
    { id: 's1', name: 'Home' },
    { id: 's2', name: 'Dashboard' },
    { id: 's3', name: 'Profile' },
    { id: 's4', name: 'Settings' },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load preset sample
  const handleLoadPreset = (preset: typeof PRESET_IDEAS[0]) => {
    setProjectName(preset.title);
    setProblemStatement(preset.desc);
    setTechnology(preset.tech);
    setTeamMembers(preset.members);
    setHasPlannedScreens(false);
    showToast(`Loaded "${preset.name}" preset!`, 'info');
  };

  // Team member management
  const handleAddMember = () => {
    const nextNum = teamMembers.length + 1;
    setTeamMembers((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        name: `Team Member ${nextNum}`,
        role: 'Full Stack Developer',
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

  const handleUpdateMember = (id: string, field: 'name' | 'role', val: string) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: val } : m))
    );
  };

  // Screen management
  const handleAddScreen = () => {
    setPlannedScreens((prev) => [
      ...prev,
      { id: Math.random().toString(36).substring(2, 9), name: '' },
    ]);
  };

  const handleRemoveScreen = (id: string) => {
    setPlannedScreens((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateScreen = (id: string, name: string) => {
    setPlannedScreens((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name } : s))
    );
  };

  // Submission handler
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!projectName.trim()) {
      setErrorMessage('Please provide a Project Name.');
      showToast('Project Name is required.', 'error');
      return;
    }

    if (!problemStatement.trim() || problemStatement.trim().length < 10) {
      setErrorMessage('Please provide a descriptive Problem Statement (minimum 10 characters).');
      showToast('Problem Statement is too short.', 'error');
      return;
    }

    if (teamMembers.length === 0) {
      setErrorMessage('At least one team member is required.');
      showToast('Please add at least one team member.', 'error');
      return;
    }

    // Check duplicate member names
    const namesSet = new Set<string>();
    for (const m of teamMembers) {
      const trimmed = m.name.trim();
      if (!trimmed) {
        setErrorMessage('All team members must have a non-empty name.');
        showToast('Empty team member name detected.', 'error');
        return;
      }
      if (namesSet.has(trimmed.toLowerCase())) {
        setErrorMessage(`Duplicate team member detected: "${trimmed}". Each member name must be unique.`);
        showToast(`Duplicate member: "${trimmed}"`, 'error');
        return;
      }
      namesSet.add(trimmed.toLowerCase());
    }

    if (hasPlannedScreens) {
      const emptyScreens = plannedScreens.filter((s) => !s.name.trim());
      if (emptyScreens.length > 0) {
        setErrorMessage('Please fill in or remove blank planned screens.');
        showToast('Blank screen entries found.', 'error');
        return;
      }
    }

    const payload: ProjectInput = {
      projectName: projectName.trim(),
      problemStatement: problemStatement.trim(),
      technology,
      teamMembers: teamMembers.map((m) => ({
        id: m.id,
        name: m.name.trim(),
        role: m.role.trim() || 'Software Engineer',
      })),
      hasPlannedScreens,
      plannedScreens: hasPlannedScreens
        ? plannedScreens.map((s) => ({ id: s.id, name: s.name.trim() }))
        : [],
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
        body: JSON.stringify({
          input: payload,
          apiKey: customKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze project with Gemini.');
      }

      if (!data.blueprint) {
        throw new Error('Received invalid empty blueprint from intelligence service.');
      }

      const saved = saveProject(payload, data.blueprint, data.source);
      showToast('Project blueprint generated successfully!', 'success');

      router.push(`/blueprint/${saved.id}`);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
      showToast(err.message || 'Analysis failed', 'error');
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'DEV';
  };

  return (
    <div className="min-h-screen bg-[#07090E] py-10 px-4 sm:px-6 lg:px-8">
      {isLoading && <LoadingOverlay projectName={projectName} />}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Title & Preset Cards */}
        <div className="pb-6 border-b border-zinc-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono font-medium mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Project Planner Studio</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Create Project Plan
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Enter your concept, pick your stack, and add your team. Gemini structures screens and assigns exact files.
              </p>
            </div>
          </div>

          {/* Quick Preset Selector Cards */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-2.5">
              ⚡ Quick Fill Presets (1-Click Test):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRESET_IDEAS.map((preset) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleLoadPreset(preset)}
                    className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 transition-all text-left flex items-start space-x-3 group"
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${preset.color} border flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-zinc-200 block truncate group-hover:text-white transition-colors">
                        {preset.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">
                        {preset.tech} • {preset.members.length} Devs
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-3 animate-fade-in shadow-lg">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Unable to generate blueprint</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Project Form */}
        <form onSubmit={handleAnalyze} className="space-y-8">
          {/* Section 1: Project Details */}
          <div className="bg-[#0B0F19] border border-zinc-800/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-mono font-bold flex items-center justify-center border border-amber-500/30">
                1
              </span>
              Project Identity & Problem Statement
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Project Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., TeamForge AI, FleetTelemetry, HealthPulse"
                  className="w-full px-4 py-3 bg-[#080B12] border border-zinc-800 rounded-xl text-sm font-medium text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Problem Statement / Project Idea <span className="text-amber-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="Explain what the app does, who it is for, and what problem it solves in plain English..."
                  className="w-full px-4 py-3 bg-[#080B12] border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all leading-relaxed shadow-inner"
                />
                <p className="mt-1.5 text-[11px] text-zinc-400">
                  Gemini reads this to identify core features, user flow, screens, and shared modules.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Technology / Framework <span className="text-amber-400">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {TECH_OPTIONS.map((tech) => (
                    <button
                      key={tech.name}
                      type="button"
                      onClick={() => setTechnology(tech.name)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-medium border flex items-center justify-center space-x-1.5 transition-all ${
                        technology === tech.name
                          ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-500/20 border-indigo-500 text-white font-bold shadow-md shadow-indigo-500/10'
                          : 'bg-[#080B12] border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      <span>{tech.icon}</span>
                      <span>{tech.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Team Members */}
          <div className="bg-[#0B0F19] border border-zinc-800/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/15 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center border border-indigo-500/30">
                  2
                </span>
                Development Team ({teamMembers.length} Members)
              </h2>
              <button
                type="button"
                onClick={handleAddMember}
                className="self-start sm:self-auto inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 transition-colors shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
                <span>Add Team Member</span>
              </button>
            </div>

            <p className="text-xs text-zinc-400 -mt-2">
              Gemini will divide the work fairly among these team members and give each person exact files to work on.
            </p>

            <div className="space-y-3">
              {teamMembers.map((member, index) => {
                const colorGradient = MEMBER_COLORS[index % MEMBER_COLORS.length];
                const initials = getInitials(member.name);

                return (
                  <div
                    key={member.id}
                    className="bg-[#080B12] border border-zinc-800/90 rounded-xl p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 transition-all hover:border-zinc-750"
                  >
                    {/* Avatar Initials Badge */}
                    <div className="flex items-center space-x-2.5 sm:w-28 flex-shrink-0">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorGradient} text-white font-mono font-bold text-xs flex items-center justify-center shadow-md`}>
                        {initials}
                      </div>
                      <span className="text-xs font-mono text-zinc-400">Dev {index + 1}</span>
                    </div>

                    {/* Developer Name */}
                    <div className="flex-1">
                      <input
                        type="text"
                        required
                        value={member.name}
                        onChange={(e) => handleUpdateMember(member.id, 'name', e.target.value)}
                        placeholder="Developer Name (e.g. Salabadesh, Arun)"
                        className="w-full px-3.5 py-2 bg-zinc-900/90 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>

                    {/* Developer Role */}
                    <div className="flex-1">
                      <input
                        type="text"
                        list="role-suggestions"
                        value={member.role}
                        onChange={(e) => handleUpdateMember(member.id, 'role', e.target.value)}
                        placeholder="Role (e.g. Frontend Developer)"
                        className="w-full px-3.5 py-2 bg-zinc-900/90 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                      <datalist id="role-suggestions">
                        {ROLE_PRESETS.map((preset) => (
                          <option key={preset} value={preset} />
                        ))}
                      </datalist>
                    </div>

                    {/* Remove Member Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={teamMembers.length <= 1}
                      className="p-2 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-900 transition-colors disabled:opacity-20"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Optional Screen Planning */}
          <div className="bg-[#0B0F19] border border-zinc-800/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/15 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center border border-cyan-500/30">
                3
              </span>
              Do you already have your screens planned?
            </h2>

            {/* YES / NO Toggle Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setHasPlannedScreens(false)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  !hasPlannedScreens
                    ? 'bg-gradient-to-r from-indigo-950/60 to-zinc-900 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                    : 'bg-[#080B12] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    NO — Let Gemini Decide (Recommended)
                  </span>
                  {!hasPlannedScreens && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  Gemini will analyze your problem statement and automatically create the required screens.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setHasPlannedScreens(true)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  hasPlannedScreens
                    ? 'bg-gradient-to-r from-indigo-950/60 to-zinc-900 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                    : 'bg-[#080B12] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Monitor className="w-4 h-4 text-amber-400" />
                    YES — I Have My Screens Planned
                  </span>
                  {hasPlannedScreens && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  Enter your screens. Gemini will assign them and detect if any essential screens are missing.
                </p>
              </button>
            </div>

            {hasPlannedScreens && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-400">
                    Add the screens you have in mind. Gemini will map files and assign team owners.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddScreen}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Add Screen</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {plannedScreens.map((screen, idx) => (
                    <div
                      key={screen.id}
                      className="bg-[#080B12] border border-zinc-800 rounded-xl p-3 flex items-center space-x-2"
                    >
                      <span className="text-zinc-500 font-mono text-xs w-6">{idx + 1}.</span>
                      <input
                        type="text"
                        required
                        value={screen.name}
                        onChange={(e) => handleUpdateScreen(screen.id, e.target.value)}
                        placeholder="e.g. Home, Login, Dashboard, Profile"
                        className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveScreen(screen.id)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg transition-colors"
                        title="Remove screen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-white font-extrabold text-base shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
              <span>Analyze Project with Gemini 2.5 Flash</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-[11px] text-zinc-400 mt-3 font-mono">
              Strict JSON validation • Exact file mapping • Zero duplicate ownership
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
