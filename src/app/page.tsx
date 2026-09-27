'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Users,
  Layers,
  GitBranch,
  Download,
  Terminal,
  FolderTree,
  FileCode2,
  ChevronRight,
  Zap,
  Check,
  Brain,
  Code2,
  Shield,
  Clock,
} from 'lucide-react';
import Logo from '@/components/Logo';

interface DemoPreview {
  id: string;
  name: string;
  tag: string;
  tech: string;
  problem: string;
  screens: { name: string; owner: string; file: string; priority: string; role: string }[];
  members: { name: string; role: string; share: number; color: string; bgColor: string }[];
  branches: string[];
}

const DEMOS: DemoPreview[] = [
  {
    id: 'habit',
    name: 'Smart Habit Tracker',
    tag: 'Student Productivity',
    tech: 'React Native',
    problem: 'Many students struggle to maintain consistent daily habits because they forget tasks, lack motivation, and cannot easily track their progress.',
    screens: [
      { name: 'Home Dashboard', owner: 'Arun', file: 'src/screens/HomeScreen.tsx', priority: 'Must Have', role: 'Frontend' },
      { name: 'Add Habit', owner: 'Arun', file: 'src/screens/AddHabitScreen.tsx', priority: 'Must Have', role: 'Frontend' },
      { name: 'Progress Analytics', owner: 'Kumar', file: 'src/screens/ProgressScreen.tsx', priority: 'Must Have', role: 'Backend' },
      { name: 'AI Suggestions', owner: 'Rahul', file: 'src/services/aiSuggestions.ts', priority: 'Should Have', role: 'AI/ML' },
    ],
    members: [
      { name: 'Arun', role: 'Frontend Dev', share: 35, color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-200' },
      { name: 'Kumar', role: 'Backend Dev', share: 30, color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' },
      { name: 'Priya', role: 'UI/UX Designer', share: 20, color: 'text-violet-700', bgColor: 'bg-violet-50 border-violet-200' },
      { name: 'Rahul', role: 'AI/ML Dev', share: 15, color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
    ],
    branches: ['feature/arun-frontend-screens', 'feature/kumar-backend-api', 'feature/priya-ui-design', 'feature/rahul-ai-engine'],
  },
  {
    id: 'logistics',
    name: 'Fleet Telematics',
    tag: 'Logistics & IoT',
    tech: 'React',
    problem: 'Truck dispatchers suffer from blind spots in vehicle maintenance, live GPS route tracking, and driver fatigue alerts.',
    screens: [
      { name: 'Fleet Overview Map', owner: 'Salabadesh', file: 'src/screens/FleetMapScreen.tsx', priority: 'Must Have', role: 'Frontend' },
      { name: 'Vehicle Telemetry', owner: 'Arun', file: 'src/screens/TelemetryScreen.tsx', priority: 'Must Have', role: 'Full Stack' },
      { name: 'Alerts Hub', owner: 'Vijay', file: 'src/screens/AlertsScreen.tsx', priority: 'Must Have', role: 'Backend' },
    ],
    members: [
      { name: 'Salabadesh', role: 'Frontend Lead', share: 33, color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
      { name: 'Arun', role: 'Full Stack', share: 33, color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-200' },
      { name: 'Vijay', role: 'Backend/API', share: 34, color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' },
    ],
    branches: ['feature/salabadesh-fleet-map', 'feature/arun-telemetry', 'feature/vijay-alerts-hub'],
  },
  {
    id: 'healthcare',
    name: 'Patient Telehealth',
    tag: 'Healthcare Mobile',
    tech: 'React Native',
    problem: 'Patients recovering at home struggle with tracking blood pressure, medication adherence, and scheduling doctor video appointments.',
    screens: [
      { name: 'Vitals Dashboard', owner: 'Sarah', file: 'src/screens/VitalsScreen.tsx', priority: 'Must Have', role: 'Frontend' },
      { name: 'Prescriptions', owner: 'Alex', file: 'src/screens/PrescriptionsScreen.tsx', priority: 'Must Have', role: 'Full Stack' },
      { name: 'Video Consultation', owner: 'Devon', file: 'src/screens/VideoCallScreen.tsx', priority: 'Should Have', role: 'Backend' },
    ],
    members: [
      { name: 'Sarah', role: 'Clinical Lead', share: 40, color: 'text-rose-700', bgColor: 'bg-rose-50 border-rose-200' },
      { name: 'Alex', role: 'Mobile Dev', share: 35, color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-200' },
      { name: 'Devon', role: 'Backend/Video', share: 25, color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' },
    ],
    branches: ['feature/sarah-vitals-dash', 'feature/alex-prescriptions', 'feature/devon-webrtc'],
  },
];

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Solution Generation',
    desc: 'Describe your problem and let Gemini generate a complete solution with objectives, features, and tech approach.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
  {
    icon: FileCode2,
    title: 'File Ownership System',
    desc: 'Every developer knows exactly which files they own, can read, and must not modify — eliminating merge conflicts.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
  },
  {
    icon: Users,
    title: 'Smart Work Distribution',
    desc: 'AI assigns work based on role, skill, and complexity — not blindly dividing screens equally.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    icon: Terminal,
    title: 'AI Coding IDE Prompts',
    desc: 'Generate ready-to-paste prompts for Cursor, Claude Code, Antigravity, and other AI coding tools.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    icon: Download,
    title: 'Downloadable Project ZIP',
    desc: 'Download the complete folder structure with placeholder files and documentation ready to start coding.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    icon: GitBranch,
    title: 'GitHub Collaboration Plan',
    desc: 'Scoped branch naming, pull request strategy, and a 7-step conflict-free workflow for your team.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
];

const STEPS = [
  { num: '01', title: 'Enter Project Details', desc: 'Project name, hackathon event, problem statement, and solution (or let AI generate it).', color: 'bg-indigo-600' },
  { num: '02', title: 'Add Team Members', desc: 'Add developers with their roles, experience level, and skills.', color: 'bg-violet-600' },
  { num: '03', title: 'AI Analysis Engine', desc: 'Gemini analyzes your project and generates complete architecture, screens, and modules.', color: 'bg-blue-600' },
  { num: '04', title: 'Export & Start Coding', desc: 'Download blueprint, copy AI prompts, and each developer starts building immediately.', color: 'bg-emerald-600' },
];

export default function LandingPage() {
  const [activeDemo, setActiveDemo] = useState<DemoPreview>(DEMOS[0]);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-indigo-200 text-sm font-medium text-indigo-700 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>Powered by Google Gemini 2.5 Flash</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">Built for Hackathons</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.08] mb-6">
            Turn Your Problem Into a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
              Team-Ready Plan.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Project Splitter AI transforms your hackathon problem statement into a complete development blueprint — with screen assignments, file ownership, and AI prompts for each developer.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16">
            <Link
              href="/create"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-5 h-5" />
              <span>Create Project Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-base transition-all shadow-sm"
            >
              <span>View Saved Plans</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16 text-sm text-slate-500">
            {[
              { icon: Zap, label: 'Ready in 30 seconds' },
              { icon: Shield, label: 'No signup required' },
              { icon: Clock, label: 'Save hackathon hours' },
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-1.5">
                <item.icon className="w-4 h-4 text-indigo-500" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Interactive Demo Preview */}
          <div className="max-w-5xl mx-auto text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 px-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Live Preview
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">— Click to switch demo:</span>
              </div>
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {DEMOS.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => setActiveDemo(demo)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeDemo.id === demo.id
                        ? 'bg-white text-indigo-700 border border-indigo-200 shadow-sm font-bold'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {demo.tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Demo Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-slate-500 ml-2">
                    {activeDemo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.blueprint.json
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {activeDemo.tech}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                    AI Generated ✓
                  </span>
                </div>
              </div>

              <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Problem + Screens */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Problem Statement */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-xs uppercase font-mono tracking-wider text-slate-500 block mb-1.5">
                      Problem Statement
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      &quot;{activeDemo.problem}&quot;
                    </p>
                  </div>

                  {/* Screens */}
                  <div>
                    <span className="text-xs uppercase font-mono tracking-wider text-indigo-600 block mb-2">
                      Generated Screens & File Assignments
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeDemo.screens.map((screen, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-semibold text-slate-800">{screen.name}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                              screen.priority === 'Must Have'
                                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                : 'bg-amber-50 text-amber-600 border border-amber-200'
                            }`}>
                              {screen.priority}
                            </span>
                          </div>
                          <div className="text-xs font-mono text-indigo-600 truncate mb-2">
                            {screen.file}
                          </div>
                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                            <span className="text-xs text-slate-400">Owner:</span>
                            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                              {screen.owner}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Team + Branches */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Team workload */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs uppercase font-mono tracking-wider text-slate-500 block mb-3">
                      Team Workload
                    </span>
                    <div className="space-y-3">
                      {activeDemo.members.map((member, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-0.5 rounded border font-medium ${member.bgColor} ${member.color}`}>
                                {member.name}
                              </span>
                              <span className="text-xs text-slate-500">{member.role}</span>
                            </div>
                            <span className="font-bold text-indigo-600 text-xs font-mono">{member.share}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                              style={{ width: `${member.share}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Git branches */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs uppercase font-mono tracking-wider text-emerald-600 block mb-2">
                      Git Feature Branches
                    </span>
                    <div className="space-y-1.5 font-mono text-xs">
                      {activeDemo.branches.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center space-x-2 text-slate-600 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                          <GitBranch className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          <span className="truncate">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">
              The Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              From Problem to Plan in 4 Steps
            </h2>
            <p className="text-slate-500 mt-3">
              No more guessing who works on what. Clear ownership from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {STEPS.map((step, idx) => (
              <div key={idx} className="relative bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all card-hover">
                {idx < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-3 w-6 h-0.5 bg-slate-300 z-10" />
                )}
                <div className={`w-10 h-10 rounded-xl ${step.color} text-white text-sm font-mono font-bold flex items-center justify-center mb-4 shadow-sm`}>
                  {step.num}
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-600">
              Everything You Need
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              Built for Hackathon Success
            </h2>
            <p className="text-slate-500 mt-3">
              Every feature designed to minimize time-to-coding for your entire team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className={`bg-white border ${feature.border} p-6 rounded-2xl hover:shadow-md transition-all card-hover group`}>
                <div className={`w-11 h-11 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Output Pipeline */}
      <section className="py-20 border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">
              Complete Output
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              What You Get
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Project Blueprint Markdown', desc: '25-section complete documentation', icon: '📄' },
              { label: 'Screen Architecture', desc: 'All screens with UI components & APIs', icon: '🖥️' },
              { label: 'File Ownership Map', desc: 'Who owns, reads, and must not touch', icon: '📁' },
              { label: 'AI Coding Prompts', desc: 'Ready to paste into Cursor/Claude Code', icon: '🤖' },
              { label: 'Downloadable ZIP', desc: 'Complete folder structure + placeholders', icon: '📦' },
              { label: 'JSON Export', desc: 'Structured data for external tools', icon: '⚙️' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex items-start space-x-3 hover:border-indigo-300 hover:shadow-sm transition-all">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <Check className="w-4 h-4 text-emerald-500 ml-auto flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-10 sm:p-14 shadow-2xl shadow-indigo-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-400/20 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4 relative z-10">
              Ready to split your project?
            </h2>
            <p className="text-indigo-100 max-w-xl mx-auto mb-8 relative z-10">
              Go from problem statement to team-ready development plan in under 60 seconds.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-xl bg-white text-indigo-700 font-bold text-base shadow-lg transition-all transform hover:-translate-y-0.5 hover:shadow-xl relative z-10"
            >
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Start for Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
