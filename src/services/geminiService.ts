import { ProjectInput, ProjectBlueprint, ScreenItem, TeamAssignmentItem, SharedModuleItem } from '@/types/project';

const SYSTEM_PROMPT = `You are an elite Senior Software Architect, Technical Project Manager, and Agile Workload Planner.
Your job is to analyze software project ideas, define their architecture, and divide work equitably across a development team.

You MUST respond with pure JSON only. Do not wrap in markdown or backticks. Follow this exact schema:
{
  "projectOverview": "Comprehensive 2-3 paragraph architectural summary of the application, problem it solves, and system design.",
  "targetUsers": ["User persona 1", "User persona 2", "User persona 3"],
  "coreFeatures": [
    {
      "title": "Feature Name",
      "description": "Clear technical and functional description",
      "complexity": "Low" | "Medium" | "High"
    }
  ],
  "screens": [
    {
      "name": "ScreenName",
      "purpose": "Precise user & technical objective of this screen",
      "priority": "Must Have" | "Should Have" | "Nice to Have",
      "assignedMember": "Exact name of assigned team member",
      "responsibilities": ["Task 1", "Task 2", "Task 3"]
    }
  ],
  "aiSuggestedScreens": [
    {
      "name": "SuggestedScreenName",
      "purpose": "Why this essential missing screen is required",
      "priority": "Must Have" | "Should Have" | "Nice to Have",
      "assignedMember": "Exact name of assigned team member",
      "responsibilities": ["Task 1", "Task 2"]
    }
  ],
  "userFlow": [
    {
      "step": 1,
      "from": "Start Screen",
      "to": "Next Screen",
      "action": "User action triggering transition",
      "description": "Context of this flow step"
    }
  ],
  "teamAssignments": [
    {
      "member": "Member Name",
      "role": "Role (e.g. Frontend Developer)",
      "assignedScreens": ["Screen 1", "Screen 2"],
      "responsibilities": ["Primary ownership areas", "Integration duties"],
      "workloadPercentage": 25
    }
  ],
  "sharedModules": [
    {
      "name": "Module Name (e.g. Auth Context, API Client, UI Design System)",
      "category": "Architecture / Networking / State / Utilities",
      "description": "Cross-cutting shared responsibility"
    }
  ],
  "projectStructure": [
    {
      "path": "src/screens/HomeScreen.tsx",
      "type": "file" | "dir",
      "description": "Purpose in the repository"
    }
  ],
  "githubPlan": {
    "baseBranch": "main",
    "branches": [
      {
        "name": "feature/developer-screen-name",
        "member": "Developer Name",
        "purpose": "Scoped work for this branch"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "phase": "Pull",
        "title": "Synchronize Base Branch",
        "command": "git checkout main && git pull origin main",
        "description": "Ensure your local repository has the latest verified code before branching."
      },
      {
        "step": 2,
        "phase": "Branch",
        "title": "Create Feature Branch",
        "command": "git checkout -b feature/<your-name>-<screen-or-module>",
        "description": "Isolate your assignments in a dedicated branch adhering to the team convention."
      },
      {
        "step": 3,
        "phase": "Develop",
        "title": "Build & Unit Test",
        "command": "npm run dev",
        "description": "Implement your screen placeholders, hooks, and local tests following team standards."
      },
      {
        "step": 4,
        "phase": "Commit",
        "title": "Atomic Conventional Commits",
        "command": "git add . && git commit -m \"feat(<scope>): implement screen skeleton\"",
        "description": "Commit incremental functional steps with descriptive conventional messages."
      },
      {
        "step": 5,
        "phase": "Push",
        "title": "Push to Remote",
        "command": "git push -u origin feature/<your-name>-<screen-or-module>",
        "description": "Publish your branch to GitHub for CI pipeline checks."
      },
      {
        "step": 6,
        "phase": "Pull Request",
        "title": "Open Pull Request",
        "command": "gh pr create --base main --head feature/<branch-name> --title \"[Feat] Screen Skeleton\"",
        "description": "Submit a PR with screenshots and checklist of completed screen responsibilities."
      },
      {
        "step": 7,
        "phase": "Merge",
        "title": "Code Review & Squash Merge",
        "command": "git checkout main && git pull origin main",
        "description": "After peer review approval and green CI checks, squash and merge into main."
      }
    ]
  },
  "implementationNotes": [
    "Practical architectural advice for the team",
    "Recommended state management or API contract tips"
  ]
}

CRITICAL RULES:
1. SCREEN GENERATION:
   - If the user has provided screens: Use ONLY the provided screens as the main 'screens' array! Do NOT rename them arbitrarily.
   - If essential screens are missing (e.g. Auth/Login, Error Handler, Settings, Admin, Notifications), list them ONLY in 'aiSuggestedScreens' with a clear purpose and assignment. Do NOT silently inject them into 'screens'.
   - If the user has NOT provided screens: Generate a comprehensive, realistic set of required screens (typically 5 to 9 screens) based on the problem statement. Leave 'aiSuggestedScreens' as an empty array [].
2. TEAM DISTRIBUTION:
   - Every single screen MUST have exactly ONE primary owner in 'assignedMember'.
   - NEVER assign the same screen to multiple people.
   - Equitably balance workload among all team members. Calculate an estimated 'workloadPercentage' for each member so total equals 100%.
   - Consider the developer's declared role (Frontend, Backend, Full Stack, UI/UX). If someone is Backend, assign them data-heavy/admin screens or API-centric screens; UI/UX gets landing/design-heavy screens.
3. PROJECT STRUCTURE:
   - Tailor the file tree specifically to the chosen technology (e.g., React/Vite: src/components, src/screens; Next.js: src/app/...; Flutter: lib/...; React Native: app/ or src/screens).
   - Only specify empty screen placeholders and clean folder structure.
4. VALID JSON:
   - Return valid JSON matching the schema. No explanations outside the JSON object.`;

export async function analyzeProjectWithGemini(
  input: ProjectInput,
  customApiKey?: string
): Promise<{ blueprint: ProjectBlueprint; source: 'gemini' | 'architect-engine' }> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    // If no API key is provided, run our fallback local architect engine
    return {
      blueprint: generateLocalArchitectBlueprint(input),
      source: 'architect-engine',
    };
  }

  const userPrompt = buildUserPrompt(input);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${SYSTEM_PROMPT}\n\nUSER PROJECT REQUEST:\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
            maxOutputTokens: 6000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', response.status, errorText);
      if (response.status === 400 && errorText.includes('API_KEY_INVALID')) {
        throw new Error('Invalid Gemini API Key. Please verify your API key in Settings.');
      }
      if (response.status === 429) {
        throw new Error('Gemini API rate limit exceeded. Please try again in a few moments.');
      }
      throw new Error(`Gemini API Error (${response.status}): ${errorText.slice(0, 150)}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Empty response received from Gemini.');
    }

    const parsedBlueprint = parseAndValidateBlueprint(rawText, input);
    return {
      blueprint: parsedBlueprint,
      source: 'gemini',
    };
  } catch (err: any) {
    console.error('Gemini call failed, falling back to local architect engine:', err.message);
    // If the error was explicitly invalid key or quota, we rethrow so the user gets notified,
    // otherwise fallback to architect engine.
    if (err.message.includes('API Key') || err.message.includes('rate limit')) {
      throw err;
    }
    return {
      blueprint: generateLocalArchitectBlueprint(input),
      source: 'architect-engine',
    };
  }
}

function buildUserPrompt(input: ProjectInput): string {
  const membersFormatted = input.teamMembers
    .map((m, i) => `${i + 1}. ${m.name} (${m.role || 'Full Stack Developer'})`)
    .join('\n');

  const screensFormatted = input.hasPlannedScreens && input.plannedScreens.length > 0
    ? `User Has Planned The Following Screens:\n` + input.plannedScreens.map((s, i) => `  - Screen ${i + 1}: ${s.name}`).join('\n')
    : `User Has NOT Planned Screens. Please analyze the problem statement and deduce the complete screen architecture.`;

  return `
PROJECT NAME: ${input.projectName}
TECHNOLOGY: ${input.technology}
TEAM MEMBERS (${input.teamMembers.length} members):
${membersFormatted}

SCREEN PLANNING STATUS:
${screensFormatted}

PROBLEM STATEMENT / PROJECT IDEA:
${input.problemStatement}

TASK:
1. Thoroughly analyze the problem statement and determine core features and target users.
2. If screens were provided, use those exact screens as the primary screen architecture. If essential screens are missing, put them into 'aiSuggestedScreens'.
3. If screens were NOT provided, generate 5-8 appropriate screens for this problem statement.
4. Distribute all screens across the ${input.teamMembers.length} team members equitably (one primary owner per screen, balancing complexity and roles).
5. Generate the complete user flow, shared cross-cutting modules, technology-tailored project directory structure, and GitHub collaboration plan.
`;
}

function parseAndValidateBlueprint(rawText: string, input: ProjectInput): ProjectBlueprint {
  let cleaned = rawText.trim();
  // Strip markdown code fences if Gemini returned them
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const parsed = JSON.parse(cleaned);

  // Validate and ensure required fields are present
  return {
    projectOverview: parsed.projectOverview || `Architectural blueprint for ${input.projectName}.`,
    targetUsers: Array.isArray(parsed.targetUsers) ? parsed.targetUsers : ['End Users', 'Administrators'],
    coreFeatures: Array.isArray(parsed.coreFeatures) ? parsed.coreFeatures : [],
    screens: Array.isArray(parsed.screens) ? parsed.screens : [],
    aiSuggestedScreens: Array.isArray(parsed.aiSuggestedScreens) ? parsed.aiSuggestedScreens : [],
    userFlow: Array.isArray(parsed.userFlow) ? parsed.userFlow : [],
    teamAssignments: Array.isArray(parsed.teamAssignments) ? parsed.teamAssignments : [],
    sharedModules: Array.isArray(parsed.sharedModules) ? parsed.sharedModules : [],
    projectStructure: Array.isArray(parsed.projectStructure) ? parsed.projectStructure : [],
    githubPlan: parsed.githubPlan || {
      baseBranch: 'main',
      branches: [],
      workflowSteps: [],
    },
    implementationNotes: Array.isArray(parsed.implementationNotes) ? parsed.implementationNotes : [],
  };
}

/**
 * High-quality deterministic local architect engine
 * Used when no Gemini API key is configured or as instant offline fall-back.
 */
export function generateLocalArchitectBlueprint(input: ProjectInput): ProjectBlueprint {
  const members = input.teamMembers;
  const numMembers = Math.max(1, members.length);

  // 1. Determine screens
  let baseScreens: { name: string; purpose: string; priority: string; responsibilities: string[] }[] = [];
  let suggestedScreens: ScreenItem[] = [];

  if (input.hasPlannedScreens && input.plannedScreens.length > 0) {
    baseScreens = input.plannedScreens.map((s, idx) => ({
      name: s.name.trim(),
      purpose: `Primary interface for ${s.name.toLowerCase()} workflows in ${input.projectName}.`,
      priority: idx < 2 ? 'Must Have' : idx < 4 ? 'Should Have' : 'Nice to Have',
      responsibilities: [
        `Design responsive layout & accessibility for ${s.name}`,
        `Hook up state management & form handlers for ${s.name}`,
        `Connect REST/GraphQL endpoints and error boundaries`,
      ],
    }));

    // Check if common essential screens are missing
    const screenNamesLower = input.plannedScreens.map((s) => s.name.toLowerCase());
    const candidates = [
      { name: 'Login & Authentication', purpose: 'Secure credential verification, JWT token storage, and session guard.', priority: 'Must Have', reqKey: 'login' },
      { name: 'Settings & Preferences', purpose: 'User profile management, notification controls, and theme settings.', priority: 'Should Have', reqKey: 'setting' },
      { name: 'Error & 404 Fallback', purpose: 'Graceful crash recovery, network retry triggers, and friendly fallback UI.', priority: 'Nice to Have', reqKey: 'error' },
      { name: 'Notifications & Activity', purpose: 'Real-time alerts, system audit logs, and status updates.', priority: 'Nice to Have', reqKey: 'notif' },
    ];

    candidates.forEach((cand, i) => {
      if (!screenNamesLower.some((s) => s.includes(cand.reqKey))) {
        const assignedMember = members[i % numMembers]?.name || 'Lead Developer';
        suggestedScreens.push({
          name: cand.name,
          purpose: cand.purpose,
          priority: cand.priority,
          assignedMember,
          isAiSuggested: true,
          responsibilities: [
            `Implement ${cand.name} UI states`,
            `Integrate with security & caching layers`,
          ],
        });
      }
    });
  } else {
    // Deduce 6 smart screens from problem statement & technology
    baseScreens = [
      {
        name: 'Authentication & Onboarding',
        purpose: 'User sign-up, login, social OAuth, and initial profile onboarding flow.',
        priority: 'Must Have',
        responsibilities: ['Build form validation & password recovery', 'Persist auth tokens securely', 'Handle MFA & session expiration'],
      },
      {
        name: 'Main Dashboard & Workspace',
        purpose: 'Central command center aggregating active projects, KPI metrics, and immediate actions.',
        priority: 'Must Have',
        responsibilities: ['Render dynamic summary widgets', 'Implement real-time data sync', 'Configure filter & search bars'],
      },
      {
        name: 'Core Resource Manager',
        purpose: 'Creation, editing, and lifecycle management for central business entities.',
        priority: 'Must Have',
        responsibilities: ['Build modal/drawer creation workflows', 'Implement optimistic updates', 'Add bulk action batching'],
      },
      {
        name: 'Analytics & Reporting View',
        purpose: 'Visualization of historical trends, performance charts, and downloadable exports.',
        priority: 'Should Have',
        responsibilities: ['Integrate chart visualization library', 'Implement date-range filters', 'Provide CSV/PDF export generation'],
      },
      {
        name: 'Team Collaboration Hub',
        purpose: 'Member role assignment, permissions matrix, and shared project invitations.',
        priority: 'Should Have',
        responsibilities: ['Build role-based permission toggles', 'Generate invite links and email invites', 'Render member activity timeline'],
      },
      {
        name: 'System Settings & Audit Log',
        purpose: 'Application preferences, API key management, webhooks, and security audit log.',
        priority: 'Nice to Have',
        responsibilities: ['Configure workspace preferences', 'Manage API keys and integration webhooks', 'Display audit log trail'],
      },
    ];
  }

  // 2. Distribute screens equitably
  const screens: ScreenItem[] = baseScreens.map((s, idx) => {
    const member = members[idx % numMembers];
    return {
      name: s.name,
      purpose: s.purpose,
      priority: s.priority,
      assignedMember: member ? member.name : 'Unassigned',
      responsibilities: s.responsibilities,
      isAiSuggested: false,
    };
  });

  // 3. Team assignments breakdown
  const teamAssignments: TeamAssignmentItem[] = members.map((member, idx) => {
    const assigned = screens.filter((s) => s.assignedMember === member.name).map((s) => s.name);
    const assignedSug = suggestedScreens.filter((s) => s.assignedMember === member.name).map((s) => `${s.name} (Suggested)`);
    const allScreens = [...assigned, ...assignedSug];

    const workloadPercentage = Math.round(100 / numMembers);

    return {
      member: member.name,
      role: member.role || 'Full Stack Engineer',
      assignedScreens: allScreens.length > 0 ? allScreens : ['Shared Architectural Modules'],
      responsibilities: [
        `Lead design and implementation for ${assigned.join(', ') || 'foundation modules'}`,
        `Author unit tests and component stories for assigned screens`,
        `Participate in daily standup and peer code reviews`,
      ],
      workloadPercentage: idx === 0 ? 100 - workloadPercentage * (numMembers - 1) : workloadPercentage,
    };
  });

  // 4. User Flow
  const screenList = screens.map((s) => s.name);
  const userFlow = [];
  for (let i = 0; i < screenList.length - 1; i++) {
    userFlow.push({
      step: i + 1,
      from: screenList[i],
      to: screenList[i + 1],
      action: i === 0 ? 'Authenticate & Enter' : i === 1 ? 'Navigate to Action' : 'Proceed Workflow',
      description: `User transitions from ${screenList[i]} to ${screenList[i + 1]} upon completing previous phase.`,
    });
  }

  // 5. Shared Modules
  const sharedModules: SharedModuleItem[] = [
    { name: 'Authentication & Session Guard', category: 'Security', description: 'Centralized token storage, refresh interceptors, and route protection guards.' },
    { name: 'API Client & Network Layer', category: 'Networking', description: 'Configured Axios/Fetch client with retry logic, rate limit handling, and typed error responses.' },
    { name: 'UI Design System & Theme Provider', category: 'UI Components', description: 'Reusable buttons, inputs, modals, toast alerts, and design tokens conforming to brand guidelines.' },
    { name: 'Global State Management Store', category: 'State', description: 'Normalized client-side store for user session, active project context, and cache synchronization.' },
    { name: 'Environment & Constants Configuration', category: 'Config', description: 'Centralized schema validation for environment variables and API route definitions.' },
    { name: 'TypeScript Shared Data Contracts', category: 'Types', description: 'Single source of truth for DTOs, API responses, and database model interfaces.' },
  ];

  // 6. Technology-tailored project structure
  const projectStructure = generateStructureNodes(input.technology, screens);

  // 7. GitHub Plan
  const branches = members.flatMap((m) => {
    const memberScreens = screens.filter((s) => s.assignedMember === m.name);
    const slugName = m.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return memberScreens.map((s) => {
      const slugScreen = s.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      return {
        name: `feature/${slugName}-${slugScreen}`,
        member: m.name,
        purpose: `Implementation skeleton and workflows for ${s.name}`,
      };
    });
  });

  const githubPlan = {
    baseBranch: 'main',
    branches: branches.length > 0 ? branches : members.map((m) => ({
      name: `feature/${m.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-core`,
      member: m.name,
      purpose: 'Core module implementation',
    })),
    workflowSteps: [
      {
        step: 1,
        phase: 'Pull',
        title: 'Synchronize Base Branch',
        command: 'git checkout main && git pull origin main',
        description: 'Keep your local main branch synchronized with the remote source of truth before creating a work branch.',
      },
      {
        step: 2,
        phase: 'Branch',
        title: 'Create Feature Branch',
        command: 'git checkout -b feature/<your-name>-<screen-name>',
        description: 'Create a cleanly named feature branch scoped strictly to your assigned screen or architectural responsibility.',
      },
      {
        step: 3,
        phase: 'Develop',
        title: 'Build Empty Screen Template',
        command: 'npm run dev',
        description: 'Implement your assigned screen placeholder files, wire up routes, and verify error boundaries locally.',
      },
      {
        step: 4,
        phase: 'Commit',
        title: 'Commit Granular Changes',
        command: 'git add . && git commit -m "feat(screen): scaffold initial view and layout"',
        description: 'Commit frequently with conventional commit messages describing the what and why.',
      },
      {
        step: 5,
        phase: 'Push',
        title: 'Publish Branch to GitHub',
        command: 'git push -u origin feature/<your-name>-<screen-name>',
        description: 'Push your commits to GitHub to trigger automated CI test runs and preview builds.',
      },
      {
        step: 6,
        phase: 'Pull Request',
        title: 'Submit Pull Request for Peer Review',
        command: 'gh pr create --base main --title "[Feature] Implement <screen-name> skeleton"',
        description: 'Draft a pull request detailing completed deliverables and requesting review from teammates.',
      },
      {
        step: 7,
        phase: 'Merge',
        title: 'Squash & Merge to Main',
        command: 'git checkout main && git pull origin main',
        description: 'Once approvals and continuous integration tests pass, squash and merge into main.',
      },
    ],
  };

  return {
    projectOverview: `TeamForge AI Architectural Blueprint for "${input.projectName}". This project addresses the core challenge: "${input.problemStatement}". Designed for rapid execution using ${input.technology}, dividing development cleanly across ${numMembers} engineers with zero overlapping screen ownership.`,
    targetUsers: [
      'Primary End Users seeking streamlined domain workflows',
      'Team Leads & Operations Managers requiring visibility and reporting',
      'System Administrators managing security and user provisioning',
    ],
    coreFeatures: [
      {
        title: 'Intelligent Workflow Automation',
        description: 'Eliminates repetitive manual operations through structured state machines and automated event processing.',
        complexity: 'Medium',
      },
      {
        title: 'Unified Collaborative Workspace',
        description: 'Provides real-time visibility into shared assets, project statuses, and team activity streams.',
        complexity: 'High',
      },
      {
        title: 'Secure Role-Based Access Control',
        description: 'Enforces principle of least privilege across navigation routes, actions, and API payloads.',
        complexity: 'Medium',
      },
      {
        title: 'Metrics & Performance Dashboard',
        description: 'Aggregates mission-critical indicators into high-density visualizations for actionable insights.',
        complexity: 'Medium',
      },
    ],
    screens,
    aiSuggestedScreens: suggestedScreens,
    userFlow,
    teamAssignments,
    sharedModules,
    projectStructure,
    githubPlan,
    implementationNotes: [
      `Enforce TypeScript strict mode across all modules to eliminate runtime null pointer exceptions.`,
      `Establish a shared API contract in src/types before individual developers begin mock integration.`,
      `Conduct weekly code reviews focusing on shared module reuse and consistent UX patterns.`,
    ],
  };
}

function generateStructureNodes(tech: string, screens: ScreenItem[]) {
  const isFlutter = tech.toLowerCase().includes('flutter');
  const isNext = tech.toLowerCase().includes('next');
  const isReactNative = tech.toLowerCase().includes('react native');
  const isNode = tech.toLowerCase().includes('node');

  if (isFlutter) {
    return [
      { path: 'lib/', type: 'dir' as const, description: 'Dart root directory' },
      { path: 'lib/screens/', type: 'dir' as const, description: 'Screen widgets directory' },
      ...screens.map((s) => ({
        path: `lib/screens/${s.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_screen.dart`,
        type: 'file' as const,
        description: `Assigned: ${s.assignedMember}`,
      })),
      { path: 'lib/widgets/', type: 'dir' as const, description: 'Shared reusable widgets' },
      { path: 'lib/models/', type: 'dir' as const, description: 'Data models & DTOs' },
      { path: 'lib/services/', type: 'dir' as const, description: 'API & local storage services' },
      { path: 'lib/main.dart', type: 'file' as const, description: 'App entry point' },
      { path: 'pubspec.yaml', type: 'file' as const, description: 'Flutter dependencies' },
    ];
  }

  if (isNext) {
    return [
      { path: 'src/', type: 'dir' as const, description: 'Application source' },
      { path: 'src/app/', type: 'dir' as const, description: 'Next.js App Router root' },
      { path: 'src/app/layout.tsx', type: 'file' as const, description: 'Root layout with theme provider' },
      { path: 'src/app/page.tsx', type: 'file' as const, description: 'Landing / Home page' },
      ...screens.map((s) => {
        const slug = s.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        return {
          path: `src/app/${slug}/page.tsx`,
          type: 'file' as const,
          description: `Assigned to: ${s.assignedMember} (${s.name})`,
        };
      }),
      { path: 'src/components/', type: 'dir' as const, description: 'Shared reusable UI components' },
      { path: 'src/lib/', type: 'dir' as const, description: 'Utility functions & API clients' },
      { path: 'src/types/', type: 'dir' as const, description: 'TypeScript interfaces' },
      { path: 'package.json', type: 'file' as const, description: 'Node project manifest' },
      { path: 'README.md', type: 'file' as const, description: 'Project documentation & team setup' },
    ];
  }

  if (isReactNative) {
    return [
      { path: 'src/', type: 'dir' as const, description: 'Application root source' },
      { path: 'src/screens/', type: 'dir' as const, description: 'Mobile screen views' },
      ...screens.map((s) => ({
        path: `src/screens/${s.name.replace(/[^a-zA-Z0-9]/g, '')}Screen.tsx`,
        type: 'file' as const,
        description: `Assigned to: ${s.assignedMember}`,
      })),
      { path: 'src/navigation/', type: 'dir' as const, description: 'React Navigation stacks & tabs' },
      { path: 'src/components/', type: 'dir' as const, description: 'Shared mobile UI primitives' },
      { path: 'src/services/', type: 'dir' as const, description: 'AsyncStorage & API client' },
      { path: 'src/constants/', type: 'dir' as const, description: 'Theme colors & dimensions' },
      { path: 'App.tsx', type: 'file' as const, description: 'Application bootstrap' },
      { path: 'package.json', type: 'file' as const, description: 'Project manifest' },
    ];
  }

  if (isNode) {
    return [
      { path: 'src/', type: 'dir' as const, description: 'Backend service source' },
      { path: 'src/routes/', type: 'dir' as const, description: 'Express / Fastify route controllers' },
      ...screens.map((s) => ({
        path: `src/routes/${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.router.ts`,
        type: 'file' as const,
        description: `Endpoint handler for ${s.name} (Assigned: ${s.assignedMember})`,
      })),
      { path: 'src/controllers/', type: 'dir' as const, description: 'Business logic handlers' },
      { path: 'src/services/', type: 'dir' as const, description: 'Database and third party clients' },
      { path: 'src/middlewares/', type: 'dir' as const, description: 'Auth & validation middleware' },
      { path: 'src/index.ts', type: 'file' as const, description: 'Server entry point' },
      { path: 'package.json', type: 'file' as const, description: 'Node project manifest' },
    ];
  }

  // Default React / Vite
  return [
    { path: 'src/', type: 'dir' as const, description: 'Frontend source root' },
    { path: 'src/screens/', type: 'dir' as const, description: 'Screen components' },
    ...screens.map((s) => ({
      path: `src/screens/${s.name.replace(/[^a-zA-Z0-9]/g, '')}Screen.tsx`,
      type: 'file' as const,
      description: `Screen: ${s.name} (Assigned: ${s.assignedMember})`,
    })),
    { path: 'src/components/', type: 'dir' as const, description: 'Shared reusable components' },
    { path: 'src/navigation/', type: 'dir' as const, description: 'Router & route definitions' },
    { path: 'src/services/', type: 'dir' as const, description: 'API client & network requests' },
    { path: 'src/hooks/', type: 'dir' as const, description: 'Custom React hooks' },
    { path: 'src/utils/', type: 'dir' as const, description: 'Helper functions' },
    { path: 'src/constants/', type: 'dir' as const, description: 'Application constants' },
    { path: 'src/types/', type: 'dir' as const, description: 'TypeScript type definitions' },
    { path: 'src/App.tsx', type: 'file' as const, description: 'Main application router' },
    { path: 'src/main.tsx', type: 'file' as const, description: 'DOM root mount' },
    { path: 'package.json', type: 'file' as const, description: 'Project dependencies and scripts' },
    { path: 'README.md', type: 'file' as const, description: 'Architecture & team guide' },
  ];
}
