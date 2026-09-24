import React from 'react';
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
  Compass, 
  ChevronRight,
  Code2
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden border-b border-zinc-800/80">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 mb-8 animate-fade-in shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-zinc-400">Powered by</span>
            <span className="text-indigo-400 font-semibold">Google Gemini API</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">Architectural Task Planner</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-100 max-w-4xl mx-auto leading-[1.1] mb-6">
            Turn Ideas Into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-sky-300">
              Team-Ready Projects.
            </span>
          </h1>

          {/* Subtitle / Explanation */}
          <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Describe your problem. Let AI structure your project, identify screens, and divide the work across your team.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/create"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Create Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium text-sm transition-all"
            >
              <span>Explore Sample Blueprints</span>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </Link>
          </div>

          {/* Interactive Blueprint Mockup Terminal */}
          <div className="max-w-4xl mx-auto bg-zinc-900/90 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden text-left">
            <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-zinc-400 ml-2">teamforge-blueprint-preview.json</span>
              </div>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Gemini 1.5 Architecture Model
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-950/40">
              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Problem Statement</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 font-mono">
                  &quot;Logistics dispatchers suffer from blind spots in vehicle maintenance, GPS tracking, and fatigue alerts...&quot;
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">Assigned Screen</span>
                    <span className="text-xs font-bold text-zinc-200">Fleet Overview Map</span>
                    <span className="text-[11px] text-indigo-400 block mt-0.5">Owner: Salabadesh</span>
                  </div>
                  <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">Assigned Screen</span>
                    <span className="text-xs font-bold text-zinc-200">Vehicle Telemetry</span>
                    <span className="text-[11px] text-indigo-400 block mt-0.5">Owner: Arun</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/90 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-2">Workload Allocation</span>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-300">Salabadesh</span>
                        <span className="font-mono text-indigo-400">25%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full w-1/4" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-300">Arun</span>
                        <span className="font-mono text-indigo-400">25%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full w-1/4" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-300">Karthik</span>
                        <span className="font-mono text-indigo-400">25%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full w-1/4" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-300">Vijay</span>
                        <span className="font-mono text-indigo-400">25%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full w-1/4" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 0 Overlaps
                  </span>
                  <span className="text-zinc-500 font-mono">4 Branches</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-b border-zinc-800/80 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
              Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-2">
              From Idea to Team Sprint in 4 Steps
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Eliminate architectural ambiguity and unblock every engineer on day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl relative">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-bold flex items-center justify-center mb-4">
                01
              </span>
              <h3 className="font-bold text-sm text-zinc-100 mb-1.5">Enter Problem Statement</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Describe your software idea, user requirements, and select your preferred technology stack.
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl relative">
              <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-bold flex items-center justify-center mb-4">
                02
              </span>
              <h3 className="font-bold text-sm text-zinc-100 mb-1.5">Define Team & Screens</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Add your team members and their roles. Optionally provide screen names or let Gemini auto-deduce them.
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl relative">
              <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold flex items-center justify-center mb-4">
                03
              </span>
              <h3 className="font-bold text-sm text-zinc-100 mb-1.5">Analyze with Gemini</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Gemini identifies features, assigns screens, balances workload, and catches missing screens.
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl relative">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold flex items-center justify-center mb-4">
                04
              </span>
              <h3 className="font-bold text-sm text-zinc-100 mb-1.5">Download Starter Structure</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Export markdown blueprints, copy GitHub branch plans, and download framework-ready ZIP skeletons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-20 border-b border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
              Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-2">
              Engineered for Real Development Teams
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              A serious developer productivity tool that outputs actionable blueprints instead of conversational fluff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-100 mb-2">Gemini AI Intelligence Layer</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Direct integration with Google Gemini API producing strict, validated JSON schemas with zero free-form hallucination.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-100 mb-2">Equitable Workload Balancer</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Strict 1-to-1 screen assignment ensuring zero duplicate ownership while balancing screen complexity and developer roles.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-100 mb-2">AI Missing Screen Detection</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                When you provide planned screens, Gemini identifies omitted architectural screens and categorizes them in an AI Suggested section.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
                <FolderTree className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-100 mb-2">Downloadable Project ZIP</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Generates empty starter screen placeholders with developer metadata and TODO lists. Zero generated business logic.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center mb-4">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-100 mb-2">GitHub Collaboration Strategy</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Scoped branch naming conventions plus an interactive 7-step Git workflow (Pull, Branch, Develop, Commit, Push, PR, Merge).
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-100 mb-2">Secure Secret Management</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                API keys are kept strictly server-side in environment variables or user browser storage. Never leaked to code repositories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-indigo-950/60 to-zinc-900 border border-indigo-500/30 rounded-3xl p-10 sm:p-14 shadow-2xl relative overflow-hidden">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight mb-4">
              Ready to structure your next engineering sprint?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto mb-8">
              Transform your software concept into a team-ready project blueprint with screen assignments, folder hierarchy, and git plans in seconds.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <span>Create Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-zinc-300">TeamForge AI</span>
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
