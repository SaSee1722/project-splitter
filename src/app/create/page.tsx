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
  Wand2 
} from 'lucide-react';
import { TechStack, TeamMemberInput, PlannedScreenInput, ProjectInput } from '@/types/project';
import { saveProject, getCustomApiKey } from '@/services/projectStorage';
import { useToast } from '@/components/Toast';
import LoadingOverlay from '@/components/LoadingOverlay';

const TECH_OPTIONS: TechStack[] = [
  'React',
  'Next.js',
  'React Native',
  'Flutter',
  'Vite',
  'Node.js',
  'Vue.js',
  'Svelte',
  'Other',
];

const ROLE_PRESETS = [
  'Frontend Developer',
  'Backend Developer',
  'UI/UX Developer',
  'Full Stack Developer',
  'Mobile Engineer',
  'QA / Testing Engineer',
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

  // Quick preset template loader for rapid testing
  const handleLoadSample = (type: 'logistics' | 'healthcare' | 'ecommerce') => {
    if (type === 'logistics') {
      setProjectName('RoutePulse - Smart Logistics Dispatch');
      setProblemStatement(
        'Delivery drivers and dispatchers lack a synchronized dashboard to track parcel delivery statuses, route congestion warnings, and customer proof-of-delivery signatures in real-time. RoutePulse provides instant GPS route recalculations and automated SMS ETA updates.'
      );
      setTechnology('React');
      setTeamMembers([
        { id: '1', name: 'Salabadesh', role: 'Frontend Developer' },
        { id: '2', name: 'Arun', role: 'Full Stack Developer' },
        { id: '3', name: 'Karthik', role: 'UI/UX Developer' },
        { id: '4', name: 'Vijay', role: 'Backend Developer' },
      ]);
      setHasPlannedScreens(false);
    } else if (type === 'healthcare') {
      setProjectName('CarePulse - Patient Vitals Telehealth');
      setProblemStatement(
        'Patients recovering at home struggle with manually tracking blood pressure, medication adherence, and doctor video appointments. CarePulse synchronizes Bluetooth medical peripherals and alerts doctors to vital anomalies.'
      );
      setTechnology('React Native');
      setTeamMembers([
        { id: '1', name: 'Dr. Sarah', role: 'Product & Clinical Lead' },
        { id: '2', name: 'Alex', role: 'Mobile Engineer' },
        { id: '3', name: 'Devon', role: 'Backend & Security' },
      ]);
      setHasPlannedScreens(true);
      setPlannedScreens([
        { id: 's1', name: 'Patient Vitals Dashboard' },
        { id: 's2', name: 'Medication Calendar' },
        { id: 's3', name: 'Doctor Video Consultation' },
      ]);
    } else {
      setProjectName('ArtisanBazaar - Peer Craft Marketplace');
      setProblemStatement(
        'Independent craft makers need an omnichannel storefront with automated inventory synchronization across pop-up retail stalls and web orders with Stripe checkout.'
      );
      setTechnology('Next.js');
      setTeamMembers([
        { id: '1', name: 'Salabadesh', role: 'Frontend Developer' },
        { id: '2', name: 'Maya', role: 'UI/UX Developer' },
        { id: '3', name: 'Leo', role: 'Backend Developer' },
      ]);
      setHasPlannedScreens(false);
    }
    showToast('Example project loaded into form.', 'info');
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

    // 1. Validation
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

    // Check for empty or duplicate names
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

      // Save project into local storage
      const saved = saveProject(payload, data.blueprint, data.source);
      showToast('Project blueprint generated successfully!', 'success');

      // Navigate to blueprint dashboard
      router.push(`/blueprint/${saved.id}`);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
      showToast(err.message || 'Analysis failed', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8">
      {isLoading && <LoadingOverlay projectName={projectName} />}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
              <span>Create Project Plan</span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                Gemini Powered
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Provide your problem statement, team composition, and tech stack to generate an architectural blueprint.
            </p>
          </div>

          {/* Quick preset loaders */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-500 hidden sm:inline">Try an example:</span>
            <button
              type="button"
              onClick={() => handleLoadSample('logistics')}
              className="px-2.5 py-1 text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg transition-colors"
            >
              Logistics
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('healthcare')}
              className="px-2.5 py-1 text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg transition-colors"
            >
              Telehealth
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('ecommerce')}
              className="px-2.5 py-1 text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg transition-colors"
            >
              E-Commerce
            </button>
          </div>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-3 animate-fade-in">
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
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-mono flex items-center justify-center border border-indigo-500/20">
                1
              </span>
              Project & Problem Statement
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Project Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., TeamForge AI, FleetTelemetry, HealthPulse"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Problem Statement / Project Idea <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="Describe what the application should do, the user pain points, required capabilities, and business domain in detail..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all leading-relaxed"
                />
                <p className="mt-1 text-[11px] text-zinc-500">
                  Gemini analyzes this description to determine core features, user personas, screen architecture, and required shared modules.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">
                  Technology / Framework <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {TECH_OPTIONS.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => setTechnology(tech)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        technology === tech
                          ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-sm'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Team Members */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-mono flex items-center justify-center border border-cyan-500/20">
                  2
                </span>
                Team Members ({teamMembers.length})
              </h2>
              <button
                type="button"
                onClick={handleAddMember}
                className="self-start sm:self-auto inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-400" />
                <span>Add Team Member</span>
              </button>
            </div>

            <p className="text-xs text-zinc-400 -mt-2">
              Gemini will divide the screen ownership and technical responsibilities equitably among these developers.
            </p>

            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="bg-zinc-950/70 border border-zinc-800/90 rounded-xl p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 transition-all"
                >
                  <div className="flex items-center space-x-2 text-zinc-400 text-xs font-mono font-medium sm:w-28 flex-shrink-0">
                    <span className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px]">
                      {index + 1}
                    </span>
                    <span>Member {index + 1}</span>
                  </div>

                  {/* Name field */}
                  <div className="flex-1">
                    <input
                      type="text"
                      required
                      value={member.name}
                      onChange={(e) => handleUpdateMember(member.id, 'name', e.target.value)}
                      placeholder="Developer Name (e.g. Salabadesh, Arun)"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Role field with datalist suggestions */}
                  <div className="flex-1">
                    <input
                      type="text"
                      list="role-suggestions"
                      value={member.role}
                      onChange={(e) => handleUpdateMember(member.id, 'role', e.target.value)}
                      placeholder="Role (e.g. Frontend Developer)"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                    />
                    <datalist id="role-suggestions">
                      {ROLE_PRESETS.map((preset) => (
                        <option key={preset} value={preset} />
                      ))}
                    </datalist>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={teamMembers.length <= 1}
                    className="p-2 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-900 transition-colors disabled:opacity-30 disabled:hover:text-zinc-500"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Optional Screen Planning */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-400 text-xs font-mono flex items-center justify-center border border-amber-500/20">
                3
              </span>
              Do you already have your screens planned?
            </h2>

            {/* YES / NO Toggle */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setHasPlannedScreens(false)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  !hasPlannedScreens
                    ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-sm'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                NO — Let Gemini Decide
              </button>
              <button
                type="button"
                onClick={() => setHasPlannedScreens(true)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  hasPlannedScreens
                    ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-sm'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                YES — I Have Screens Planned
              </button>
            </div>

            {hasPlannedScreens ? (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-400">
                    Enter your planned screens. Gemini will assign each screen and suggest any missing essential screens.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddScreen}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Add Screen</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {plannedScreens.map((screen, idx) => (
                    <div
                      key={screen.id}
                      className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 flex items-center space-x-2"
                    >
                      <span className="text-zinc-500 font-mono text-xs w-6">{idx + 1}.</span>
                      <input
                        type="text"
                        required
                        value={screen.name}
                        onChange={(e) => handleUpdateScreen(screen.id, e.target.value)}
                        placeholder="e.g. Home, Login, Dashboard, Profile"
                        className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
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
            ) : (
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 text-xs text-zinc-400 flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <p>
                  <strong className="text-zinc-200">Gemini AI Automatic Screen Generation:</strong> Gemini will analyze your problem statement, determine the complete required screen architecture, and assign responsibilities across your team.
                </p>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 text-cyan-200 animate-pulse" />
              <span>Analyze Project with Gemini</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-[11px] text-zinc-500 mt-2.5">
              Secure analysis adhering to strict JSON output validation & workload balance rules.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
