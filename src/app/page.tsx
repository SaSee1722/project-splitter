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
  CheckCircle2, 
  Terminal, 
  FolderTree, 
  ShieldCheck, 
  Cpu, 
  FileCode2, 
  ChevronRight,
  Code2,
  Boxes,
  Zap,
  Check
} from 'lucide-react';
import Logo from '@/components/Logo';

interface DemoPreview {
  id: string;
  name: string;
  tag: string;
  tech: string;
  problem: string;
  screens: { name: string; owner: string; file: string; priority: string }[];
  members: { name: string; role: string; share: number; color: string }[];
  branches: string[];
}

const DEMOS: DemoPreview[] = [
  {
    id: 'logistics',
    name: 'OmniTrack - Fleet Telematics',
    tag: 'Logistics & IoT',
    tech: 'React',
    problem: 'Truck dispatchers suffer from blind spots in vehicle maintenance, live GPS route tracking, and driver fatigue alerts.',
    screens: [
      { name: 'Fleet Overview Map', owner: 'Salabadesh', file: 'src/screens/FleetOverviewMapScreen.tsx', priority: 'Must Have' },
      { name: 'Vehicle Telemetry Detail', owner: 'Arun', file: 'src/screens/VehicleTelemetryDetailScreen.tsx', priority: 'Must Have' },
      { name: 'Maintenance Schedule', owner: 'Karthik', file: 'src/screens/MaintenanceScheduleScreen.tsx', priority: 'Should Have' },
      { name: 'Alerts & Incidents Hub', owner: 'Vijay', file: 'src/screens/AlertsIncidentsHubScreen.tsx', priority: 'Must Have' },
    ],
    members: [
      { name: 'Salabadesh', role: 'Frontend Lead', share: 25, color: 'from-amber-400 to-orange-500' },
      { name: 'Arun', role: 'Full Stack', share: 25, color: 'from-indigo-400 to-violet-500' },
      { name: 'Karthik', role: 'UI/UX Dev', share: 25, color: 'from-cyan-400 to-sky-500' },
      { name: 'Vijay', role: 'Backend/API', share: 25, color: 'from-emerald-400 to-teal-500' },
    ],
    branches: ['feature/salabadesh-fleet-map', 'feature/arun-telemetry-detail', 'feature/karthik-maintenance-calendar', 'feature/vijay-alerts-hub'],
  },
  {
    id: 'telehealth',
    name: 'CarePulse - Remote Vitals',
    tag: 'Healthcare Mobile',
    tech: 'React Native',
    problem: 'Homebound patients struggle to track blood pressure, remember prescriptions, and conduct video calls with their cardiologists.',
    screens: [
      { name: 'Patient Vitals Dashboard', owner: 'Sarah', file: 'src/screens/PatientVitalsScreen.tsx', priority: 'Must Have' },
      { name: 'Prescription Calendar', owner: 'Alex', file: 'src/screens/PrescriptionCalendarScreen.tsx', priority: 'Must Have' },
      { name: 'Doctor Video Call Room', owner: 'Devon', file: 'src/screens/VideoConsultationScreen.tsx', priority: 'Should Have' },
    ],
    members: [
      { name: 'Sarah', role: 'Product & Clinical', share: 34, color: 'from-rose-400 to-pink-500' },
      { name: 'Alex', role: 'Mobile Engineer', share: 33, color: 'from-indigo-400 to-cyan-500' },
      { name: 'Devon', role: 'Backend & Video', share: 33, color: 'from-emerald-400 to-teal-500' },
    ],
    branches: ['feature/sarah-vitals-dash', 'feature/alex-prescriptions', 'feature/devon-webrtc-call'],
  },
  {
    id: 'ecommerce',
    name: 'ArtisanBazaar - Maker Shop',
    tag: 'E-Commerce Platform',
    tech: 'Next.js',
    problem: 'Independent craft makers need an omnichannel web store with automated inventory synchronization across pop-up retail stalls and Stripe web checkout.',
    screens: [
      { name: 'Storefront Catalog', owner: 'Maya', file: 'src/app/catalog/page.tsx', priority: 'Must Have' },
      { name: 'Stripe Express Checkout', owner: 'Salabadesh', file: 'src/app/checkout/page.tsx', priority: 'Must Have' },
      { name: 'Inventory Sync Admin', owner: 'Leo', file: 'src/app/admin/inventory/page.tsx', priority: 'Should Have' },
    ],
    members: [
      { name: 'Maya', role: 'Design Lead', share: 33, color: 'from-fuchsia-400 to-purple-500' },
      { name: 'Salabadesh', role: 'Full Stack', share: 34, color: 'from-amber-400 to-orange-500' },
      { name: 'Leo', role: 'Backend Engineer', share: 33, color: 'from-emerald-400 to-cyan-500' },
    ],
    branches: ['feature/maya-catalog-ui', 'feature/salabadesh-stripe-checkout', 'feature/leo-inventory-api'],
  },
];

export default function LandingPage() {
  const [activeDemo, setActiveDemo] = useState<DemoPreview>(DEMOS[0]);

  return (
    <div className="min-h-screen bg-[#07090E] text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      {/* Ambient background glow points */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-amber-500/10 to-transparent blur-[140px] opacity-70" />
        <div className="absolute top-[600px] -left-40 w-[500px] h-[500px] bg-cyan-600/10 blur-[130px] rounded-full opacity-50" />
        <div className="absolute top-[800px] -right-40 w-[500px] h-[500px] bg-amber-600/10 blur-[130px] rounded-full opacity-40" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 z-10 border-b border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Announcement Badge */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800/90 text-xs font-medium text-zinc-300 mb-8 backdrop-blur-md shadow-lg shadow-black/40">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-zinc-400">TeamForge AI Engine</span>
            <span className="text-zinc-700">|</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-300 to-cyan-300 font-semibold">
              Powered by Google Gemini 2.5 Flash
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.08] mb-6">
            Turn Ideas Into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 via-indigo-400 to-cyan-400">
              Team-Ready Projects.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Describe your problem. Let AI structure your project, identify screens, and divide the work across your team with exact file assignments.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
            <Link
              href="/create"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Create Project Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-200 font-semibold text-sm transition-all"
            >
              <span>Explore Saved Blueprints</span>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </Link>
          </div>

          {/* Real-time Interactive Blueprint Demo Studio */}
          <div className="max-w-5xl mx-auto text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 px-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Live Architecture Preview
                </span>
                <span className="text-[11px] text-zinc-500 hidden sm:inline">— Click to switch project domains:</span>
              </div>

              {/* Demo Switcher Pills */}
              <div className="flex items-center space-x-1.5 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
                {DEMOS.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => setActiveDemo(demo)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      activeDemo.id === demo.id
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                    }`}
                  >
                    {demo.tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Terminal Window */}
            <div className="bg-[#0B0F19] rounded-2xl border border-zinc-800/90 shadow-2xl shadow-black/80 overflow-hidden">
              {/* Window Header */}
              <div className="bg-[#0e1320] px-4 py-3 border-b border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-zinc-400 ml-2 font-medium">
                    {activeDemo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.blueprint
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {activeDemo.tech}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Balanced 100%
                  </span>
                </div>
              </div>

              {/* Window Body */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-b from-transparent to-black/30">
                {/* Left 7 cols: Problem & Screen Architecture */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Problem statement callout */}
                  <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800/80">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1">
                      Problem Statement
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                      &quot;{activeDemo.problem}&quot;
                    </p>
                  </div>

                  {/* Screens with assigned files */}
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 block mb-2">
                      Screen Architecture & Exact Assigned Files
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeDemo.screens.map((screen, idx) => (
                        <div
                          key={idx}
                          className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800/90 hover:border-zinc-700 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-xs font-bold text-zinc-100">{screen.name}</span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                                {screen.priority}
                              </span>
                            </div>
                            <div className="text-[11px] font-mono text-cyan-400/90 truncate mb-1">
                              {screen.file}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-[11px]">
                            <span className="text-zinc-500">Owner:</span>
                            <span className="font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {screen.owner}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 5 cols: Team Workload & GitHub Branches */}
                <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                  {/* Team Members Workload */}
                  <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800/80">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-3">
                      Team Workload Division
                    </span>
                    <div className="space-y-2.5">
                      {activeDemo.members.map((member, mIdx) => (
                        <div key={mIdx}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-semibold text-zinc-200">{member.name}</span>
                            <div className="flex items-center space-x-1.5 font-mono text-[11px]">
                              <span className="text-zinc-400">{member.role}</span>
                              <span className="font-bold text-indigo-400">{member.share}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${member.color}`}
                              style={{ width: `${member.share}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GitHub Branch Plan */}
                  <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800/80">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 block mb-2">
                      GitHub Feature Branches
                    </span>
                    <div className="space-y-1.5 font-mono text-[11px]">
                      {activeDemo.branches.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center space-x-2 text-zinc-300 bg-zinc-900/60 px-2.5 py-1 rounded-lg border border-zinc-800/60 truncate">
                          <GitBranch className="w-3 h-3 text-cyan-400 flex-shrink-0" />
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

      {/* How It Works Section */}
      <section className="py-20 border-b border-zinc-800/60 relative z-10 bg-[#090C14]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
              The Engineering Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              From Raw Idea to Team Sprint in 4 Steps
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              No more guessing who works on what. Clear screen ownership, exact file mapping, and git branches on day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-zinc-900/70 border border-zinc-800/80 p-6 rounded-2xl hover:border-zinc-700 transition-all">
              <span className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold flex items-center justify-center mb-4">
                01
              </span>
              <h3 className="font-bold text-sm text-zinc-100 mb-1.5">Enter Problem Statement</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Describe your software concept in plain English and select your tech stack (React, Next.js, Flutter, etc.).
              </p>
            </div>

            <div className="bg-zinc-900/70 border border-zinc-800/80 p-6 rounded-2xl hover:border-zinc-700 transition-all">
              <span className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-bold flex items-center justify-center mb-4">
                02
              </span>
              <h3 className="font-bold text-sm text-zinc-100 mb-1.5">Add Team & Screens</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                List your developers and their roles. Optionally add screens or let Gemini deduce the full screen architecture.
              </p>
            </div>

            <div className="bg-zinc-900/70 border border-zinc-800/80 p-6 rounded-2xl hover:border-zinc-700 transition-all">
              <span className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-bold flex items-center justify-center mb-4">
                03
              </span>
              <h3 className="font-bold text-sm text-zinc-100 mb-1.5">Gemini AI Analysis</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Gemini balances workload, catches missing screens, and maps exact file paths to every developer.
              </p>
            </div>

            <div className="bg-zinc-900/70 border border-zinc-800/80 p-6 rounded-2xl hover:border-zinc-700 transition-all">
              <span className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold flex items-center justify-center mb-4">
                04
              </span>
              <h3 className="font-bold text-sm text-zinc-100 mb-1.5">Export & Code</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Download starter ZIP with empty screen placeholders, copy GitHub plans, and start coding immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-20 border-b border-zinc-800/60 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
              Built for Modern Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Everything Your Team Needs to Launch
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Actionable software architecture without the fluff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#0B0F19] border border-zinc-800/80 p-6 rounded-2xl hover:border-indigo-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileCode2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-100 mb-2">Exact File Allocation</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every team member sees the exact files they need to work on from the project structure with 1-click copy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#0B0F19] border border-zinc-800/80 p-6 rounded-2xl hover:border-indigo-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-100 mb-2">Equitable Workload Balancer</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Strict 1-to-1 screen ownership ensuring 0 duplicate ownership while balancing screen complexity and developer roles.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#0B0F19] border border-zinc-800/80 p-6 rounded-2xl hover:border-indigo-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-100 mb-2">Missing Screen Detector</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                When you bring your own screens, Gemini identifies omitted screens (Auth, Settings, Errors) and tags them in an AI Suggested section.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#0B0F19] border border-zinc-800/80 p-6 rounded-2xl hover:border-indigo-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-100 mb-2">Downloadable Starter ZIP</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Generates empty starter screen placeholders with developer metadata and TODO checklists. Zero generated code bloat.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#0B0F19] border border-zinc-800/80 p-6 rounded-2xl hover:border-indigo-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-100 mb-2">GitHub Collaboration Strategy</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Scoped branch naming conventions plus an interactive 7-step Git workflow (Pull, Branch, Develop, Commit, Push, PR, Merge).
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#0B0F19] border border-zinc-800/80 p-6 rounded-2xl hover:border-indigo-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-100 mb-2">Plain English & Strict Privacy</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Clean, understandable human instructions. Your API keys are kept strictly server-side and never exposed to git.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-[#0e1424] via-[#090d16] to-[#05070c] border border-indigo-500/30 rounded-3xl p-10 sm:p-14 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Ready to structure your next engineering sprint?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto mb-8">
              Transform your software concept into a team-ready project blueprint with screen assignments, folder hierarchy, and git plans in seconds.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Create Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 text-xs text-zinc-500 bg-[#06080E] relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Logo size="sm" />
            <span>—</span>
            <span>Turn Ideas Into Team-Ready Projects</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/create" className="hover:text-zinc-300 transition-colors">
              Create Project
            </Link>
            <Link href="/projects" className="hover:text-zinc-300 transition-colors">
              Project History
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
