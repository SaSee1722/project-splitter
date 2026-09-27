'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertCircle, PlusCircle, Lightbulb, Home } from 'lucide-react';
import { getProjectById } from '@/services/projectStorage';
import { SavedProject } from '@/types/project';
import OverviewHeader from '@/components/blueprint/OverviewHeader';
import AiSummarySection from '@/components/blueprint/AiSummarySection';
import CoreFeaturesSection from '@/components/blueprint/CoreFeaturesSection';
import ScreensSection from '@/components/blueprint/ScreensSection';
import TeamDistributionSection from '@/components/blueprint/TeamDistributionSection';
import UserFlowSection from '@/components/blueprint/UserFlowSection';
import SharedModulesSection from '@/components/blueprint/SharedModulesSection';
import ProjectStructureSection from '@/components/blueprint/ProjectStructureSection';
import GithubPlanSection from '@/components/blueprint/GithubPlanSection';

export default function BlueprintPage() {
  const params = useParams();
  const id = params?.id as string;

  const [project, setProject] = useState<SavedProject | null>(() => {
    if (typeof id === 'string') {
      return getProjectById(id);
    }
    return null;
  });
  const [loading, setLoading] = useState(() => !project);

  useEffect(() => {
    if (id) {
      const found = getProjectById(id);
      setProject(found);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="flex items-center space-x-3 bg-white border border-slate-200 px-6 py-4 rounded-2xl shadow-sm">
          <Sparkles className="w-5 h-5 text-indigo-500 animate-spin" />
          <span className="text-slate-700 font-medium">Loading project blueprint...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center mb-4 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h2>
        <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          The requested project blueprint could not be found. It may have been removed or the link is incorrect.
        </p>
        <div className="flex items-center space-x-3">
          <Link
            href="/create"
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Project</span>
          </Link>
          <Link
            href="/projects"
            className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-sm font-semibold transition-colors"
          >
            View Saved Projects
          </Link>
        </div>
      </div>
    );
  }

  const { input, blueprint, source } = project;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-6 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/projects"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-500" />
            <span>Back to Projects</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm"
            >
              <Home className="w-4 h-4" />
            </Link>
            <Link
              href="/create"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Plan</span>
            </Link>
          </div>
        </div>

        {/* 1. Project Overview & Header */}
        <OverviewHeader input={input} blueprint={blueprint} source={source} />

        {/* 2. AI Project Summary */}
        <AiSummarySection blueprint={blueprint} />

        {/* 3. Core Features */}
        <CoreFeaturesSection features={blueprint.coreFeatures} />

        {/* 4. Screens (combined with AI suggested) */}
        <ScreensSection
          screens={blueprint.screens}
          aiSuggestedScreens={blueprint.aiSuggestedScreens}
        />

        {/* 5. Team Distribution */}
        <TeamDistributionSection assignments={blueprint.teamAssignments} />

        {/* 6. User Flow */}
        <UserFlowSection userFlow={blueprint.userFlow} />

        {/* 7. Shared Modules */}
        <SharedModulesSection modules={blueprint.sharedModules} />

        {/* 8. Project File Structure */}
        <ProjectStructureSection structure={blueprint.projectStructure} projectName={input.projectName} />

        {/* 9. GitHub Collaboration Plan */}
        <GithubPlanSection githubPlan={blueprint.githubPlan} />

        {/* 10. Implementation Notes */}
        {blueprint.implementationNotes && blueprint.implementationNotes.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Implementation Tips</h3>
                <p className="text-sm text-slate-500">AI recommendations for smooth team execution</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {blueprint.implementationNotes.map((note, idx) => (
                <div
                  key={idx}
                  className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3"
                >
                  <span className="w-6 h-6 rounded-lg bg-amber-200 text-amber-800 text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-amber-900 leading-relaxed">{note}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
