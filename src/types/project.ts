export type TechStack = 
  | 'React'
  | 'Next.js'
  | 'React Native'
  | 'Flutter'
  | 'Vite'
  | 'Node.js'
  | 'Vue.js'
  | 'Svelte'
  | 'Other';

export interface TeamMemberInput {
  id: string;
  name: string;
  role: string;
}

export interface PlannedScreenInput {
  id: string;
  name: string;
}

export interface ProjectInput {
  projectName: string;
  problemStatement: string;
  technology: TechStack;
  teamMembers: TeamMemberInput[];
  hasPlannedScreens: boolean;
  plannedScreens: PlannedScreenInput[];
}

export interface ScreenItem {
  name: string;
  purpose: string;
  priority: 'Must Have' | 'Should Have' | 'Nice to Have' | string;
  assignedMember: string;
  responsibilities: string[];
  isAiSuggested?: boolean;
}

export interface TeamAssignmentItem {
  member: string;
  role: string;
  assignedScreens: string[];
  responsibilities: string[];
  workloadPercentage?: number;
}

export interface CoreFeatureItem {
  title: string;
  description: string;
  complexity: 'Low' | 'Medium' | 'High';
}

export interface UserFlowStep {
  step: number;
  from: string;
  to: string;
  action: string;
  description?: string;
}

export interface SharedModuleItem {
  name: string;
  category: string;
  description: string;
}

export interface ProjectStructureNode {
  path: string;
  type: 'dir' | 'file';
  description?: string;
}

export interface GitBranchItem {
  name: string;
  member: string;
  purpose: string;
}

export interface GitWorkflowStep {
  step: number;
  phase: 'Pull' | 'Branch' | 'Develop' | 'Commit' | 'Push' | 'Pull Request' | 'Merge' | string;
  title: string;
  command: string;
  description: string;
}

export interface GitHubPlan {
  baseBranch: string;
  branches: GitBranchItem[];
  workflowSteps: GitWorkflowStep[];
}

export interface ProjectBlueprint {
  projectOverview: string;
  targetUsers: string[];
  coreFeatures: CoreFeatureItem[];
  screens: ScreenItem[];
  aiSuggestedScreens?: ScreenItem[];
  userFlow: UserFlowStep[];
  teamAssignments: TeamAssignmentItem[];
  sharedModules: SharedModuleItem[];
  projectStructure: ProjectStructureNode[];
  githubPlan: GitHubPlan;
  implementationNotes: string[];
}

export interface SavedProject {
  id: string;
  createdAt: string;
  updatedAt: string;
  input: ProjectInput;
  blueprint: ProjectBlueprint;
  source: 'gemini' | 'architect-engine';
}
