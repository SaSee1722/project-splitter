import { ProjectInput, ProjectBlueprint, ScreenItem, TeamAssignmentItem, SharedModuleItem, ProjectStructureNode } from '@/types/project';

const SYSTEM_PROMPT = `You are a friendly, experienced Software Lead and Agile Project Planner.
Your job is to take an idea or problem statement, turn it into a clean project plan, and tell every team member EXACTLY what files they need to work on.

IMPORTANT LANGUAGE & TONE RULE:
- Write in PLAIN, NORMAL, EVERYDAY ENGLISH that any beginner or student developer can easily understand.
- DO NOT use complicated corporate jargon, academic words, or buzzwords (e.g. avoid phrases like "cross-cutting concern", "enforces principle of least privilege", "telemetry CAN-bus streams", "state machine orchestration").
- Speak directly and simply: "This screen lets users log in", "Salabadesh will build the home screen layout", "Here are the exact files to create and edit".

CRITICAL FILE MAPPING REQUIREMENT:
- Every team member MUST have an "assignedFiles" list in their team assignment!
- In "projectStructure", every single file MUST have "assignedMember" indicating who works on it (or "Shared / All" if it's a foundation file like App.tsx or package.json).
- The team member's "assignedFiles" MUST match the exact file paths in "projectStructure".

You MUST respond with pure JSON only (no markdown, no backticks). Follow this exact schema:
{
  "projectOverview": "Simple 2-3 paragraph explanation in plain normal English. What does this app do? Why is it useful? How does it work for the user?",
  "targetUsers": [
    "Regular people who need...",
    "Team managers who want...",
    "Admins who manage..."
  ],
  "coreFeatures": [
    {
      "title": "Simple Feature Name (e.g. User Login, Daily Task List)",
      "description": "Clear explanation in plain everyday English of what this feature does.",
      "complexity": "Low" | "Medium" | "High"
    }
  ],
  "screens": [
    {
      "name": "ScreenName",
      "purpose": "Simple explanation of what the user sees and does on this screen.",
      "priority": "Must Have" | "Should Have" | "Nice to Have",
      "assignedMember": "Exact name of assigned team member",
      "assignedFile": "Exact file path (e.g. src/screens/HomeScreen.tsx)",
      "responsibilities": [
        "1. Build the screen layout with cards and buttons",
        "2. Add inputs for user data",
        "3. Connect to backend to load information"
      ]
    }
  ],
  "aiSuggestedScreens": [
    {
      "name": "SuggestedScreenName",
      "purpose": "Plain English reason why this screen is needed (e.g. Users need a way to log in and reset passwords).",
      "priority": "Must Have" | "Should Have" | "Nice to Have",
      "assignedMember": "Exact name of assigned team member",
      "assignedFile": "Exact file path (e.g. src/screens/LoginScreen.tsx)",
      "responsibilities": [
        "1. Build the login form with email and password fields",
        "2. Show friendly error message if password is incorrect"
      ]
    }
  ],
  "userFlow": [
    {
      "step": 1,
      "from": "Start Screen",
      "to": "Next Screen",
      "action": "User clicks...",
      "description": "What happens in plain English."
    }
  ],
  "teamAssignments": [
    {
      "member": "Member Name",
      "role": "Role (e.g. Frontend Developer)",
      "assignedScreens": ["Screen 1", "Screen 2"],
      "assignedFiles": [
        "src/screens/HomeScreen.tsx",
        "src/components/HomeHeader.tsx"
      ],
      "responsibilities": [
        "Build and test your assigned screens",
        "Make sure buttons and forms work properly",
        "Review your code with your teammate"
      ],
      "workloadPercentage": 25
    }
  ],
  "sharedModules": [
    {
      "name": "Module Name (e.g. User Authentication, API Helper, Button Kit)",
      "category": "Shared Code",
      "description": "Plain English explanation of what this shared piece does and why team members share it."
    }
  ],
  "projectStructure": [
    {
      "path": "src/screens/HomeScreen.tsx",
      "type": "file",
      "assignedMember": "Exact name of assigned team member",
      "description": "Home screen view where user sees their daily dashboard"
    }
  ],
  "githubPlan": {
    "baseBranch": "main",
    "branches": [
      {
        "name": "feature/developer-screen-name",
        "member": "Developer Name",
        "purpose": "Branch for building their assigned screen"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "phase": "Pull",
        "title": "Get the Latest Code",
        "command": "git checkout main && git pull origin main",
        "description": "Make sure you have the newest code before starting your work."
      },
      {
        "step": 2,
        "phase": "Branch",
        "title": "Make Your Own Branch",
        "command": "git checkout -b feature/<your-name>-<screen-name>",
        "description": "Create a branch just for your task so you do not mess up other people's work."
      },
      {
        "step": 3,
        "phase": "Develop",
        "title": "Work on Your Assigned Files",
        "command": "npm run dev",
        "description": "Open your assigned files and build the screen layout and buttons."
      },
      {
        "step": 4,
        "phase": "Commit",
        "title": "Save Your Progress",
        "command": "git add . && git commit -m \"feat: create screen skeleton and layout\"",
        "description": "Save your code with a clear message explaining what you did."
      },
      {
        "step": 5,
        "phase": "Push",
        "title": "Send Code to GitHub",
        "command": "git push -u origin feature/<your-name>-<screen-name>",
        "description": "Upload your branch to GitHub so your teammates can see it."
      },
      {
        "step": 6,
        "phase": "Pull Request",
        "title": "Ask for Code Review",
        "command": "gh pr create --base main --title \"[Feature] Screen skeleton\"",
        "description": "Create a Pull Request and ask a teammate to look over your code."
      },
      {
        "step": 7,
        "phase": "Merge",
        "title": "Merge into Main",
        "command": "git checkout main && git pull origin main",
        "description": "Once approved, merge your work so the whole team has it."
      }
    ]
  },
  "implementationNotes": [
    "Simple, practical tip for building this project smoothly",
    "How the team should test before merging"
  ]
}

CRITICAL RULES:
1. SCREEN GENERATION:
   - If the user gave planned screens: Use THOSE EXACT screens in 'screens'. Do NOT delete or change them. If an essential screen is missing (like Login or Settings), put it in 'aiSuggestedScreens'.
   - If the user did NOT give screens: Make 5 to 7 clean, necessary screens for this project idea. Leave 'aiSuggestedScreens' as [].
2. TEAM ASSIGNMENTS & FILES:
   - Every single screen MUST have exactly ONE owner. Do NOT assign the same screen to two people.
   - For every member, list their EXACT file paths in 'assignedFiles' from the projectStructure!
   - In 'projectStructure', every file must say which developer works on it.
3. LANGUAGE:
   - Write in simple, clear, normal everyday English. No high-sounding jargon.`;

export async function analyzeProjectWithGemini(
  input: ProjectInput,
  customApiKey?: string
): Promise<{ blueprint: ProjectBlueprint; source: 'gemini' | 'architect-engine' }> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  // Default to gemini-2.5-flash which is verified supported for this key
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    // If no API key is provided, run our fallback local architect engine
    return {
      blueprint: generateLocalArchitectBlueprint(input),
      source: 'architect-engine',
    };
  }

  const userPrompt = buildUserPrompt(input);

  try {
    const candidateModels = [model, 'gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-1.5-flash'];
    let lastError: any = null;
    let rawText: string | null = null;

    // Try candidate models
    for (const curModel of Array.from(new Set(candidateModels))) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${curModel}:generateContent?key=${apiKey}`,
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
          const errText = await response.text();
          console.warn(`Model ${curModel} returned ${response.status}: ${errText.slice(0, 100)}`);
          if (response.status === 400 && errText.includes('API_KEY_INVALID')) {
            throw new Error('Invalid Gemini API Key. Please verify your API key in Settings.');
          }
          if (response.status === 429) {
            throw new Error('Gemini API rate limit exceeded. Please try again in a few moments.');
          }
          lastError = new Error(`Gemini error (${response.status}): ${errText.slice(0, 120)}`);
          continue; // Try next model
        }

        const data = await response.json();
        rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          console.log(`Successfully received response using model: ${curModel}`);
          break;
        }
      } catch (err: any) {
        lastError = err;
        if (err.message.includes('API Key') || err.message.includes('rate limit')) {
          throw err;
        }
      }
    }

    if (!rawText) {
      if (lastError && (lastError.message.includes('API Key') || lastError.message.includes('rate limit'))) {
        throw lastError;
      }
      console.warn('Falling back to local architect engine because Gemini response was empty.');
      return {
        blueprint: generateLocalArchitectBlueprint(input),
        source: 'architect-engine',
      };
    }

    const parsedBlueprint = parseAndValidateBlueprint(rawText, input);
    return {
      blueprint: parsedBlueprint,
      source: 'gemini',
    };
  } catch (err: any) {
    console.error('Gemini call error:', err.message);
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

CRITICAL INSTRUCTIONS:
1. Speak in PLAIN, NORMAL, SIMPLE ENGLISH. No corporate jargon.
2. If screens were provided, use those exact screens. If essential screens are missing (like Login, Settings, or Notifications), list them in 'aiSuggestedScreens'.
3. In 'projectStructure', list the files for this ${input.technology} project. Every file MUST have 'assignedMember' specifying who works on it.
4. In 'teamAssignments', for EVERY team member, include 'assignedFiles': the exact file paths from 'projectStructure' that this member needs to build!
5. Make sure every team member has a fair share of the work.
`;
}

function parseAndValidateBlueprint(rawText: string, input: ProjectInput): ProjectBlueprint {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  let parsed: any = {};
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error('JSON parse error from Gemini, using fallback architect:', e);
    return generateLocalArchitectBlueprint(input);
  }

  const members = input.teamMembers;
  const numMembers = Math.max(1, members.length);

  // Clean screens
  const rawScreens = Array.isArray(parsed.screens) ? parsed.screens : [];
  const screens: ScreenItem[] = rawScreens.map((s: any, idx: number) => {
    const memberName = s.assignedMember || members[idx % numMembers]?.name || 'Developer';
    const safeName = (s.name || `Screen${idx + 1}`).replace(/[^a-zA-Z0-9]/g, '');
    return {
      name: s.name || `Screen ${idx + 1}`,
      purpose: s.purpose || `Interface for ${s.name || 'this feature'} in plain English.`,
      priority: s.priority || (idx < 2 ? 'Must Have' : idx < 4 ? 'Should Have' : 'Nice to Have'),
      assignedMember: memberName,
      assignedFile: s.assignedFile || getScreenFilePath(input.technology, safeName),
      responsibilities: Array.isArray(s.responsibilities) && s.responsibilities.length > 0
        ? s.responsibilities
        : [
            `Create the layout and visual elements for ${s.name}`,
            `Add buttons and user click interactions`,
            `Test this screen and verify data displays properly`,
          ],
      isAiSuggested: false,
    };
  });

  // Clean suggested screens
  const rawSuggested = Array.isArray(parsed.aiSuggestedScreens) ? parsed.aiSuggestedScreens : [];
  const aiSuggestedScreens: ScreenItem[] = rawSuggested.map((s: any, idx: number) => {
    const memberName = s.assignedMember || members[(screens.length + idx) % numMembers]?.name || 'Developer';
    const safeName = (s.name || `Suggested${idx + 1}`).replace(/[^a-zA-Z0-9]/g, '');
    return {
      name: s.name || `Suggested Screen ${idx + 1}`,
      purpose: s.purpose || `Essential screen recommended for a complete user experience.`,
      priority: s.priority || 'Should Have',
      assignedMember: memberName,
      assignedFile: s.assignedFile || getScreenFilePath(input.technology, safeName),
      responsibilities: Array.isArray(s.responsibilities) && s.responsibilities.length > 0
        ? s.responsibilities
        : [
            `Build form layout and user interactions for ${s.name}`,
            `Handle user errors with clear messages`,
          ],
      isAiSuggested: true,
    };
  });

  // Clean project structure
  let projectStructure: ProjectStructureNode[] = Array.isArray(parsed.projectStructure) && parsed.projectStructure.length > 0
    ? parsed.projectStructure
    : generateStructureNodes(input.technology, screens);

  // Ensure every file in projectStructure has an assignedMember
  projectStructure = projectStructure.map((node) => {
    if (node.type === 'file') {
      if (!node.assignedMember) {
        // Try to match screen
        const matchedScreen = screens.find((s) => node.path.toLowerCase().includes(s.name.toLowerCase().replace(/[^a-z0-9]/g, '')));
        const matchedSug = aiSuggestedScreens.find((s) => node.path.toLowerCase().includes(s.name.toLowerCase().replace(/[^a-z0-9]/g, '')));
        if (matchedScreen) {
          node.assignedMember = matchedScreen.assignedMember;
        } else if (matchedSug) {
          node.assignedMember = matchedSug.assignedMember;
        } else {
          node.assignedMember = 'Shared / All';
        }
      }
    }
    return node;
  });

  // Clean team assignments & ALWAYS ensure assignedFiles is populated!
  const rawAssignments = Array.isArray(parsed.teamAssignments) ? parsed.teamAssignments : [];
  const teamAssignments: TeamAssignmentItem[] = members.map((member, idx) => {
    const fromGemini = rawAssignments.find((a: any) => a.member?.toLowerCase() === member.name.toLowerCase());
    
    // Member's assigned screens
    const memberScreens = screens.filter((s) => s.assignedMember === member.name).map((s) => s.name);
    const memberSugScreens = aiSuggestedScreens.filter((s) => s.assignedMember === member.name).map((s) => `${s.name} (Suggested)`);
    const allAssignedScreens = [...memberScreens, ...memberSugScreens];

    // Member's assigned files from projectStructure
    let assignedFiles: string[] = [];
    if (Array.isArray(fromGemini?.assignedFiles) && fromGemini.assignedFiles.length > 0) {
      assignedFiles = fromGemini.assignedFiles;
    } else {
      // Find all files matching this member in projectStructure
      assignedFiles = projectStructure
        .filter((node) => node.type === 'file' && node.assignedMember === member.name)
        .map((n) => n.path);

      if (assignedFiles.length === 0) {
        // Fallback to screen files
        assignedFiles = screens
          .filter((s) => s.assignedMember === member.name && s.assignedFile)
          .map((s) => s.assignedFile as string);
      }
    }

    const workloadPercentage = fromGemini?.workloadPercentage || Math.round(100 / numMembers);

    return {
      member: member.name,
      role: member.role || 'Software Engineer',
      assignedScreens: allAssignedScreens.length > 0 ? allAssignedScreens : ['Shared Project Foundation'],
      assignedFiles: assignedFiles.length > 0 ? assignedFiles : [getScreenFilePath(input.technology, `${member.name.replace(/[^a-zA-Z0-9]/g, '')}Module`)],
      responsibilities: Array.isArray(fromGemini?.responsibilities) && fromGemini.responsibilities.length > 0
        ? fromGemini.responsibilities
        : [
            `Work on your assigned screen files: ${allAssignedScreens.join(', ') || 'foundation files'}`,
            `Test your views locally to make sure layout looks clean and responsive`,
            `Open a Pull Request when your screen skeleton is ready for teammate review`,
          ],
      workloadPercentage: idx === 0 ? 100 - workloadPercentage * (numMembers - 1) : workloadPercentage,
    };
  });

  return {
    projectOverview: parsed.projectOverview || `Here is the project plan for "${input.projectName}". It solves: ${input.problemStatement}`,
    targetUsers: Array.isArray(parsed.targetUsers) && parsed.targetUsers.length > 0
      ? parsed.targetUsers
      : ['Regular users wanting a clean experience', 'Team leads tracking progress', 'Admins managing accounts'],
    coreFeatures: Array.isArray(parsed.coreFeatures) ? parsed.coreFeatures : [],
    screens,
    aiSuggestedScreens,
    userFlow: Array.isArray(parsed.userFlow) ? parsed.userFlow : [],
    teamAssignments,
    sharedModules: Array.isArray(parsed.sharedModules) ? parsed.sharedModules : [],
    projectStructure,
    githubPlan: parsed.githubPlan || {
      baseBranch: 'main',
      branches: [],
      workflowSteps: [],
    },
    implementationNotes: Array.isArray(parsed.implementationNotes) ? parsed.implementationNotes : [],
  };
}

function getScreenFilePath(tech: string, cleanName: string): string {
  const t = tech.toLowerCase();
  if (t.includes('flutter')) return `lib/screens/${cleanName.toLowerCase()}_screen.dart`;
  if (t.includes('next')) return `src/app/${cleanName.toLowerCase()}/page.tsx`;
  if (t.includes('react native')) return `src/screens/${cleanName}Screen.tsx`;
  if (t.includes('node')) return `src/routes/${cleanName.toLowerCase()}.router.ts`;
  return `src/screens/${cleanName}Screen.tsx`;
}

/**
 * Deterministic local architect engine with plain, normal English
 */
export function generateLocalArchitectBlueprint(input: ProjectInput): ProjectBlueprint {
  const members = input.teamMembers;
  const numMembers = Math.max(1, members.length);

  // 1. Screens
  let baseScreens: { name: string; purpose: string; priority: string; responsibilities: string[] }[] = [];
  let suggestedScreens: ScreenItem[] = [];

  if (input.hasPlannedScreens && input.plannedScreens.length > 0) {
    baseScreens = input.plannedScreens.map((s, idx) => ({
      name: s.name.trim(),
      purpose: `This is the main screen for ${s.name.toLowerCase()} where users complete their tasks.`,
      priority: idx < 2 ? 'Must Have' : idx < 4 ? 'Should Have' : 'Nice to Have',
      responsibilities: [
        `Build the layout and buttons for the ${s.name} screen`,
        `Add form inputs so users can enter information easily`,
        `Connect this screen to the data service so details display properly`,
      ],
    }));

    const screenNamesLower = input.plannedScreens.map((s) => s.name.toLowerCase());
    const candidates = [
      { name: 'Login & Sign Up', purpose: 'Lets users create an account, log in securely, and reset their passwords.', priority: 'Must Have', reqKey: 'login' },
      { name: 'Settings & Profile', purpose: 'Lets users edit their profile, change notification preferences, and manage account details.', priority: 'Should Have', reqKey: 'setting' },
      { name: 'Help & Error Screen', purpose: 'Shows a friendly message if something goes wrong or if a page cannot be found.', priority: 'Nice to Have', reqKey: 'error' },
      { name: 'Notifications Center', purpose: 'Shows users new alerts, task updates, and messages in one clean list.', priority: 'Nice to Have', reqKey: 'notif' },
    ];

    candidates.forEach((cand, i) => {
      if (!screenNamesLower.some((s) => s.includes(cand.reqKey))) {
        const assignedMember = members[i % numMembers]?.name || 'Lead Developer';
        const cleanName = cand.name.replace(/[^a-zA-Z0-9]/g, '');
        suggestedScreens.push({
          name: cand.name,
          purpose: cand.purpose,
          priority: cand.priority,
          assignedMember,
          assignedFile: getScreenFilePath(input.technology, cleanName),
          isAiSuggested: true,
          responsibilities: [
            `Create the ${cand.name} interface with clear inputs and buttons`,
            `Show helpful error messages if something goes wrong`,
          ],
        });
      }
    });
  } else {
    // 6 screens in plain English
    baseScreens = [
      {
        name: 'Login & Welcome Screen',
        purpose: 'The entry screen where users sign in or create an account to start using the app.',
        priority: 'Must Have',
        responsibilities: [
          'Build the email and password login form',
          'Add buttons for signing up or resetting forgotten passwords',
          'Make sure users stay logged in after closing the browser',
        ],
      },
      {
        name: 'Main Home Dashboard',
        purpose: 'The central overview screen showing quick stats, daily activities, and shortcut buttons.',
        priority: 'Must Have',
        responsibilities: [
          'Create the dashboard cards showing current items and status',
          'Add a search bar and quick filter dropdown',
          'Show a welcoming summary with latest updates',
        ],
      },
      {
        name: 'Items & Tasks Manager',
        purpose: 'The screen where users create, view, edit, and organize their main project items.',
        priority: 'Must Have',
        responsibilities: [
          'Build the list of items with edit and delete buttons',
          'Add an easy modal popup to create new items',
          'Include sorting options (by date, name, priority)',
        ],
      },
      {
        name: 'Progress & Analytics View',
        purpose: 'Visual charts and simple numbers that help users see their progress over time.',
        priority: 'Should Have',
        responsibilities: [
          'Add visual charts showing weekly and monthly progress',
          'Include a simple date picker to filter historical data',
          'Add a download button to export data to CSV',
        ],
      },
      {
        name: 'Team & Collaboration Hub',
        purpose: 'Allows users to invite teammates, assign work, and see who is doing what.',
        priority: 'Should Have',
        responsibilities: [
          'Build a list of team members with their roles and photos',
          'Add an "Invite Teammate" button with email form',
          'Show recent activity log so everyone knows what changed',
        ],
      },
      {
        name: 'Account & Settings Screen',
        purpose: 'Where users adjust their account preferences, theme, passwords, and notification alerts.',
        priority: 'Nice to Have',
        responsibilities: [
          'Build user profile settings (name, avatar, email)',
          'Add toggle switches for email and push notifications',
          'Provide a secure "Log Out" button',
        ],
      },
    ];
  }

  // 2. Distribute screens equitably
  const screens: ScreenItem[] = baseScreens.map((s, idx) => {
    const member = members[idx % numMembers];
    const cleanName = s.name.replace(/[^a-zA-Z0-9]/g, '');
    return {
      name: s.name,
      purpose: s.purpose,
      priority: s.priority,
      assignedMember: member ? member.name : 'Unassigned',
      assignedFile: getScreenFilePath(input.technology, cleanName),
      responsibilities: s.responsibilities,
      isAiSuggested: false,
    };
  });

  // 3. Project Structure
  const projectStructure = generateStructureNodes(input.technology, screens);

  // 4. Team assignments with explicit assignedFiles
  const teamAssignments: TeamAssignmentItem[] = members.map((member, idx) => {
    const assigned = screens.filter((s) => s.assignedMember === member.name).map((s) => s.name);
    const assignedSug = suggestedScreens.filter((s) => s.assignedMember === member.name).map((s) => `${s.name} (Suggested)`);
    const allScreens = [...assigned, ...assignedSug];

    // Find all files belonging to this member
    const memberFiles = projectStructure
      .filter((n) => n.type === 'file' && n.assignedMember === member.name)
      .map((n) => n.path);

    const workloadPercentage = Math.round(100 / numMembers);

    return {
      member: member.name,
      role: member.role || 'Full Stack Engineer',
      assignedScreens: allScreens.length > 0 ? allScreens : ['Shared Foundation'],
      assignedFiles: memberFiles.length > 0 ? memberFiles : [getScreenFilePath(input.technology, `${member.name}Screen`)],
      responsibilities: [
        `Open your assigned file(s) and build the screen layout`,
        `Make sure all forms and buttons work as expected`,
        `Commit your work to your branch and open a Pull Request`,
      ],
      workloadPercentage: idx === 0 ? 100 - workloadPercentage * (numMembers - 1) : workloadPercentage,
    };
  });

  // 5. User Flow in plain English
  const screenList = screens.map((s) => s.name);
  const userFlow = [];
  for (let i = 0; i < screenList.length - 1; i++) {
    userFlow.push({
      step: i + 1,
      from: screenList[i],
      to: screenList[i + 1],
      action: i === 0 ? 'Log in & enter app' : i === 1 ? 'Click to view details' : 'Continue workflow',
      description: `User goes from ${screenList[i]} to ${screenList[i + 1]} after finishing this step.`,
    });
  }

  // 6. Shared Modules in plain English
  const sharedModules: SharedModuleItem[] = [
    { name: 'Login & User Session Helper', category: 'Authentication', description: 'Keeps users logged in and protects pages from unauthorized access.' },
    { name: 'API Client Helper', category: 'Networking', description: 'A shared function to send requests to the server and handle network errors.' },
    { name: 'Button & Card Design Kit', category: 'Shared Components', description: 'Standard buttons, text inputs, and modals so all screens look uniform.' },
    { name: 'App State Store', category: 'Data Store', description: 'Stores the current logged-in user and active project data in one shared place.' },
    { name: 'Types & Interfaces', category: 'TypeScript', description: 'Clean data blueprints describing what users, tasks, and API responses look like.' },
  ];

  // 7. GitHub Plan
  const branches = members.flatMap((m) => {
    const memberScreens = screens.filter((s) => s.assignedMember === m.name);
    const slugName = m.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return memberScreens.map((s) => {
      const slugScreen = s.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      return {
        name: `feature/${slugName}-${slugScreen}`,
        member: m.name,
        purpose: `Work on ${s.name}`,
      };
    });
  });

  const githubPlan = {
    baseBranch: 'main',
    branches: branches.length > 0 ? branches : members.map((m) => ({
      name: `feature/${m.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-core`,
      member: m.name,
      purpose: 'Core screen development',
    })),
    workflowSteps: [
      {
        step: 1,
        phase: 'Pull',
        title: 'Get the Newest Code',
        command: 'git checkout main && git pull origin main',
        description: 'Before starting, download the latest updates from GitHub to avoid conflicts.',
      },
      {
        step: 2,
        phase: 'Branch',
        title: 'Create Your Personal Feature Branch',
        command: 'git checkout -b feature/<your-name>-<screen-name>',
        description: 'Isolate your work on a new branch so you can build without disturbing teammates.',
      },
      {
        step: 3,
        phase: 'Develop',
        title: 'Open Your Assigned Files & Build',
        command: 'npm run dev',
        description: 'Open the files assigned to you in the project structure and build the screen layout.',
      },
      {
        step: 4,
        phase: 'Commit',
        title: 'Save Your Changes Locally',
        command: 'git add . && git commit -m "feat: build screen layout and buttons"',
        description: 'Take a snapshot of your progress with a short message describing what you did.',
      },
      {
        step: 5,
        phase: 'Push',
        title: 'Upload Branch to GitHub',
        command: 'git push -u origin feature/<your-name>-<screen-name>',
        description: 'Send your commits to GitHub so your team can test and review your progress.',
      },
      {
        step: 6,
        phase: 'Pull Request',
        title: 'Open a Pull Request (PR)',
        command: 'gh pr create --base main --title "[Feature] Add screen placeholder"',
        description: 'Ask a teammate to review your code and give a thumbs up.',
      },
      {
        step: 7,
        phase: 'Merge',
        title: 'Merge into Main Branch',
        command: 'git checkout main && git pull origin main',
        description: 'Once approved, merge your screen into the main codebase.',
      },
    ],
  };

  return {
    projectOverview: `Project plan for "${input.projectName}". This project was created to solve: "${input.problemStatement}". The work is divided evenly across all ${numMembers} team members, giving each person clear screens and specific files to work on.`,
    targetUsers: [
      'Everyday users who want an easy and fast way to use the application',
      'Team leaders and managers who need to monitor status and updates',
      'Admins who set up accounts and configure general settings',
    ],
    coreFeatures: [
      {
        title: 'Easy User Workflow',
        description: 'Guides users step-by-step through their daily actions without confusing menus.',
        complexity: 'Medium',
      },
      {
        title: 'Live Team Updates',
        description: 'Lets team members see recent changes and work together without stepping on each other.',
        complexity: 'High',
      },
      {
        title: 'Safe Account & Role Access',
        description: 'Keeps user data private and ensures only allowed people can edit sensitive settings.',
        complexity: 'Medium',
      },
      {
        title: 'Overview & Summary Dashboard',
        description: 'Shows all important numbers and tasks on one clean screen.',
        complexity: 'Low',
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
      `Start by having each team member open their branch and find their assigned screen file.`,
      `Build the simple visual layout first before worrying about complex data fetching.`,
      `Test your buttons and form inputs locally with npm run dev before opening a pull request.`,
    ],
  };
}

function generateStructureNodes(tech: string, screens: ScreenItem[]): ProjectStructureNode[] {
  const isFlutter = tech.toLowerCase().includes('flutter');
  const isNext = tech.toLowerCase().includes('next');
  const isReactNative = tech.toLowerCase().includes('react native');
  const isNode = tech.toLowerCase().includes('node');

  if (isFlutter) {
    return [
      { path: 'lib/', type: 'dir', description: 'Flutter app root folder' },
      { path: 'lib/screens/', type: 'dir', description: 'All app screen widgets' },
      ...screens.map((s) => ({
        path: `lib/screens/${s.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_screen.dart`,
        type: 'file' as const,
        assignedMember: s.assignedMember,
        description: `${s.name} screen (Assigned to: ${s.assignedMember})`,
      })),
      { path: 'lib/widgets/', type: 'dir', description: 'Shared reusable buttons and cards' },
      { path: 'lib/models/', type: 'dir', description: 'Data models' },
      { path: 'lib/services/', type: 'dir', description: 'API client and storage' },
      { path: 'lib/main.dart', type: 'file', assignedMember: 'Shared / All', description: 'Flutter app launch point' },
      { path: 'pubspec.yaml', type: 'file', assignedMember: 'Shared / All', description: 'Flutter package dependencies' },
    ];
  }

  if (isNext) {
    return [
      { path: 'src/', type: 'dir', description: 'Source code folder' },
      { path: 'src/app/', type: 'dir', description: 'Next.js App Router pages' },
      { path: 'src/app/layout.tsx', type: 'file', assignedMember: 'Shared / All', description: 'Main layout with header and navigation' },
      { path: 'src/app/page.tsx', type: 'file', assignedMember: screens[0]?.assignedMember || 'Shared / All', description: 'Home welcome page' },
      ...screens.map((s) => {
        const slug = s.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        return {
          path: `src/app/${slug}/page.tsx`,
          type: 'file' as const,
          assignedMember: s.assignedMember,
          description: `${s.name} page (Assigned to: ${s.assignedMember})`,
        };
      }),
      { path: 'src/components/', type: 'dir', description: 'Shared buttons, cards, and modal components' },
      { path: 'src/lib/', type: 'dir', description: 'Helper functions and API clients' },
      { path: 'src/types/', type: 'dir', description: 'TypeScript data types' },
      { path: 'package.json', type: 'file', assignedMember: 'Shared / All', description: 'Project dependencies and scripts' },
      { path: 'README.md', type: 'file', assignedMember: 'Shared / All', description: 'Team project guide' },
    ];
  }

  if (isReactNative) {
    return [
      { path: 'src/', type: 'dir', description: 'Mobile source folder' },
      { path: 'src/screens/', type: 'dir', description: 'Screen views' },
      ...screens.map((s) => ({
        path: `src/screens/${s.name.replace(/[^a-zA-Z0-9]/g, '')}Screen.tsx`,
        type: 'file' as const,
        assignedMember: s.assignedMember,
        description: `${s.name} mobile view (Assigned to: ${s.assignedMember})`,
      })),
      { path: 'src/navigation/', type: 'dir', description: 'Tab and stack navigation' },
      { path: 'src/components/', type: 'dir', description: 'Shared mobile UI buttons and inputs' },
      { path: 'src/services/', type: 'dir', description: 'API client & local storage' },
      { path: 'App.tsx', type: 'file', assignedMember: 'Shared / All', description: 'Mobile entry point' },
      { path: 'package.json', type: 'file', assignedMember: 'Shared / All', description: 'Project dependencies' },
    ];
  }

  if (isNode) {
    return [
      { path: 'src/', type: 'dir', description: 'Server source code' },
      { path: 'src/routes/', type: 'dir', description: 'API route endpoints' },
      ...screens.map((s) => ({
        path: `src/routes/${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.router.ts`,
        type: 'file' as const,
        assignedMember: s.assignedMember,
        description: `API route for ${s.name} (Assigned to: ${s.assignedMember})`,
      })),
      { path: 'src/controllers/', type: 'dir', description: 'Controller functions' },
      { path: 'src/services/', type: 'dir', description: 'Database and external services' },
      { path: 'src/index.ts', type: 'file', assignedMember: 'Shared / All', description: 'Server entry point' },
      { path: 'package.json', type: 'file', assignedMember: 'Shared / All', description: 'Dependencies manifest' },
    ];
  }

  // Default React / Vite
  return [
    { path: 'src/', type: 'dir', description: 'Application source root' },
    { path: 'src/screens/', type: 'dir', description: 'Screen components folder' },
    ...screens.map((s) => ({
      path: `src/screens/${s.name.replace(/[^a-zA-Z0-9]/g, '')}Screen.tsx`,
      type: 'file' as const,
      assignedMember: s.assignedMember,
      description: `${s.name} screen (Assigned to: ${s.assignedMember})`,
    })),
    { path: 'src/components/', type: 'dir', description: 'Shared buttons, inputs, and modals' },
    { path: 'src/navigation/', type: 'dir', description: 'Route navigation definitions' },
    { path: 'src/services/', type: 'dir', description: 'API helper functions' },
    { path: 'src/types/', type: 'dir', description: 'TypeScript interfaces' },
    { path: 'src/App.tsx', type: 'file', assignedMember: 'Shared / All', description: 'Main application router' },
    { path: 'package.json', type: 'file', assignedMember: 'Shared / All', description: 'Project setup and dependencies' },
    { path: 'README.md', type: 'file', assignedMember: 'Shared / All', description: 'Team guide and setup instructions' },
  ];
}
