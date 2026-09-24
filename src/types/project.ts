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
  purpose: string; // Written in simple, clear, normal English
  priority: 'Must Have' | 'Should Have' | 'Nice to Have' | string;
  assignedMember: string;
  assignedFile?: string; // Exact file path from projectStructure
  responsibilities: string[]; // Step-by-step tasks in plain English
  isAiSuggested?: boolean;
}

export interface TeamAssignmentItem {
  member: string;
  role: string;
  assignedScreens: string[];
  assignedFiles: string[]; // Exact file paths from the project structure this developer must build!
  responsibilities: string[]; // Clear, plain English tasks
  workloadPercentage?: number;
}

export interface CoreFeatureItem {
  title: string;
  description: string; // Plain English
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
  sharedFiles?: string[];
}

export interface ProjectStructureNode {
  path: string;
  type: 'dir' | 'file';
  assignedMember?: string; // Developer name or "Shared / All"
  description?: string; // What this file does in simple English
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
