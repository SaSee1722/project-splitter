'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertCircle, PlusCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { getProjectById } from '@/services/projectStorage';
import { SavedProject } from '@/types/project';
import OverviewHeader from '@/components/blueprint/OverviewHeader';
import AiSummarySection from '@/components/blueprint/AiSummarySection';
import CoreFeaturesSection from '@/components/blueprint/CoreFeaturesSection';
import ScreenArchitectureSection from '@/components/blueprint/ScreenArchitectureSection';
import AiSuggestedScreensSection from '@/components/blueprint/AiSuggestedScreensSection';
import TeamDistributionSection from '@/components/blueprint/TeamDistributionSection';
import UserFlowSection from '@/components/blueprint/UserFlowSection';
import SharedModulesSection from '@/components/blueprint/SharedModulesSection';
import ProjectStructureSection from '@/components/blueprint/ProjectStructureSection';
import GithubPlanSection from '@/components/blueprint/GithubPlanSection';

export default function BlueprintPage() {
  const params = useParams();
  const router = useRouter();
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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-sm">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-spin" />
          <span>Loading project blueprint...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100 mb-2">Project Blueprint Not Found</h2>
        <p className="text-xs text-zinc-400 max-w-sm mb-6">
          The requested project blueprint could not be found in local memory or was removed.
        </p>
        <div className="flex items-center space-x-3">
          <Link
            href="/create"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Project</span>
          </Link>
          <Link
            href="/projects"
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors"
          >
            Saved Projects
          </Link>
        </div>
      </div>
    );
  }

  const { input, blueprint, source } = project;

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/projects"
            className="inline-flex items-center space-x-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Saved Projects</span>
          </Link>

          <Link
            href="/create"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>New Project Plan</span>
          </Link>
        </div>

        {/* 1. Project Overview & Header Actions */}
        <OverviewHeader input={input} blueprint={blueprint} source={source} />

        {/* 2. AI Project Summary & Personas */}
        <AiSummarySection blueprint={blueprint} />

        {/* 3. Core Features */}
        <CoreFeaturesSection features={blueprint.coreFeatures} />

        {/* 4. Screen Architecture */}
        <ScreenArchitectureSection screens={blueprint.screens} />

        {/* 5. AI Suggested Missing Screens (Conditionally rendered) */}
        {blueprint.aiSuggestedScreens && blueprint.aiSuggestedScreens.length > 0 && (
          <AiSuggestedScreensSection screens={blueprint.aiSuggestedScreens} />
        )}

        {/* 6. Team Distribution */}
        <TeamDistributionSection assignments={blueprint.teamAssignments} />

        {/* 7. User Flow */}
        <UserFlowSection userFlow={blueprint.userFlow} />

        {/* 8. Shared Modules */}
        <SharedModulesSection modules={blueprint.sharedModules} />

        {/* 9. Project Structure */}
        <ProjectStructureSection structure={blueprint.projectStructure} projectName={input.projectName} />

        {/* 10. GitHub Collaboration Plan */}
        <GithubPlanSection githubPlan={blueprint.githubPlan} />

        {/* 11. Implementation Notes */}
        {blueprint.implementationNotes && blueprint.implementationNotes.length > 0 && (
          <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-100">Architectural & Implementation Tips</h3>
                <p className="text-xs text-zinc-400">Recommendations for smooth team execution</p>
              </div>
            </div>
            <ul className="space-y-2">
              {blueprint.implementationNotes.map((note, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
