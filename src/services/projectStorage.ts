import { SavedProject, ProjectInput, ProjectBlueprint } from '@/types/project';

const STORAGE_KEY = 'teamforge_projects_v1';
const API_KEY_STORAGE = 'teamforge_custom_api_key';

export function getCustomApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(API_KEY_STORAGE) || '';
}

export function setCustomApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (!key || key.trim() === '') {
    localStorage.removeItem(API_KEY_STORAGE);
  } else {
    localStorage.setItem(API_KEY_STORAGE, key.trim());
  }
}

export function getAllProjects(): SavedProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed default sample project for instant preview
      const sample = getSampleProject();
      localStorage.setItem(STORAGE_KEY, JSON.stringify([sample]));
      return [sample];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load projects from localStorage:', err);
    return [];
  }
}

export function getProjectById(id: string): SavedProject | null {
  if (id === 'demo-sample-01') {
    return getSampleProject();
  }
  const projects = getAllProjects();
  return projects.find((p) => p.id === id) || null;
}

export function saveProject(
  input: ProjectInput,
  blueprint: ProjectBlueprint,
  source: 'gemini' | 'architect-engine' = 'gemini'
): SavedProject {
  const projects = getAllProjects();
  const newProject: SavedProject = {
    id: `tf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    input,
    blueprint,
    source,
  };

  const updated = [newProject, ...projects];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return newProject;
}

export function updateProject(id: string, updates: Partial<SavedProject>): SavedProject | null {
  const projects = getAllProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updatedProject = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  projects[index] = updatedProject;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }
  return updatedProject;
}

export function renameProject(id: string, newName: string): boolean {
  const projects = getAllProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) return false;

  project.input.projectName = newName;
  project.updatedAt = new Date().toISOString();
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }
  return true;
}

export function deleteProject(id: string): boolean {
  const projects = getAllProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
  return true;
}

function getSampleProject(): SavedProject {
  return {
    id: 'demo-sample-01',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    source: 'gemini',
    input: {
      projectName: 'OmniTrack - Fleet Telematics Hub',
      problemStatement:
        'Logistics companies suffer from blind spots in vehicle maintenance, live GPS route tracking, and driver fatigue alerts. OmniTrack delivers a unified real-time telemetry dashboard with sensor event alerts and maintenance scheduling.',
      technology: 'React',
      teamMembers: [
        { id: '1', name: 'Salabadesh', role: 'Frontend Architect' },
        { id: '2', name: 'Arun', role: 'Full Stack Engineer' },
        { id: '3', name: 'Karthik', role: 'UI/UX Developer' },
        { id: '4', name: 'Vijay', role: 'Backend/API Engineer' },
      ],
      hasPlannedScreens: true,
      plannedScreens: [
        { id: 's1', name: 'Fleet Overview Map' },
        { id: 's2', name: 'Vehicle Telemetry Detail' },
        { id: 's3', name: 'Maintenance Schedule' },
        { id: 's4', name: 'Alerts & Incidents Hub' },
      ],
    },
    blueprint: {
      projectOverview:
        'OmniTrack helps delivery and trucking companies monitor their vehicles in real-time. It tracks GPS locations, alerts drivers and dispatchers when a truck needs repairs, and makes sure maintenance is scheduled before breakdowns occur.',
      targetUsers: [
        'Fleet dispatchers who need to see vehicle locations and arrival times',
        'Mechanics who check diagnostic codes and schedule repairs',
        'Managers who want to track fuel costs and driver safety ratings',
      ],
      coreFeatures: [
        {
          title: 'Live GPS Map Tracking',
          description: 'Shows all trucks moving on a live map with speed, direction, and delivery zone boundaries.',
          complexity: 'High',
        },
        {
          title: 'Predictive Maintenance Alerts',
          description: 'Warns mechanics before parts fail by checking engine hours and brake wear automatically.',
          complexity: 'Medium',
        },
        {
          title: 'Urgent Alert Notifications',
          description: 'Sends instant alerts for sudden braking, speeding, and route detours.',
          complexity: 'Medium',
        },
        {
          title: 'Driver Fuel & Safety Scorecards',
          description: 'Simple ratings showing which drivers save the most fuel and drive the safest.',
          complexity: 'Low',
        },
      ],
      screens: [
        {
          name: 'Fleet Overview Map',
          purpose: 'Shows a live map with truck locations and route progress so dispatchers know where every delivery is.',
          priority: 'Must Have',
          assignedMember: 'Salabadesh',
          assignedFile: 'src/screens/FleetOverviewMapScreen.tsx',
          responsibilities: [
            '1. Add the interactive map view and vehicle pins',
            '2. Show delivery route lines and ETA arrival times',
            '3. Add a bottom drawer to view vehicle info when a pin is clicked',
          ],
        },
        {
          name: 'Vehicle Telemetry Detail',
          purpose: 'Shows truck health numbers like fuel level, speed, tire pressure, and engine warnings.',
          priority: 'Must Have',
          assignedMember: 'Arun',
          assignedFile: 'src/screens/VehicleTelemetryDetailScreen.tsx',
          responsibilities: [
            '1. Build gauges showing speed, battery, and fuel level',
            '2. List engine error codes and what parts need fixing',
            '3. Display who is currently driving the truck',
          ],
        },
        {
          name: 'Maintenance Schedule',
          purpose: 'A calendar where mechanics and dispatchers schedule repair shop visits and part replacements.',
          priority: 'Should Have',
          assignedMember: 'Karthik',
          assignedFile: 'src/screens/MaintenanceScheduleScreen.tsx',
          responsibilities: [
            '1. Build a calendar showing upcoming repair dates',
            '2. Create a form to request replacement parts',
            '3. Allow mechanics to mark inspections as completed',
          ],
        },
        {
          name: 'Alerts & Incidents Hub',
          purpose: 'Shows a clean list of urgent alerts like speeding, low oil, and breakdown notices.',
          priority: 'Must Have',
          assignedMember: 'Vijay',
          assignedFile: 'src/screens/AlertsIncidentsHubScreen.tsx',
          responsibilities: [
            '1. Build the list of active alerts with priority badges',
            '2. Add an "Acknowledge Alert" button so dispatchers can respond',
            '3. Allow exporting alert summaries to a spreadsheet',
          ],
        },
      ],
      aiSuggestedScreens: [
        {
          name: 'Login & Dispatcher Sign-In',
          purpose: 'Lets dispatchers log in safely with email and password so company data stays protected.',
          priority: 'Must Have',
          assignedMember: 'Arun',
          assignedFile: 'src/screens/LoginScreen.tsx',
          responsibilities: [
            '1. Build the login form with email and password fields',
            '2. Keep the dispatcher logged in after opening the browser',
          ],
        },
        {
          name: 'Settings & Delivery Zones',
          purpose: 'Allows managers to set speed limits and draw delivery zones directly on the map.',
          priority: 'Should Have',
          assignedMember: 'Karthik',
          assignedFile: 'src/screens/SettingsScreen.tsx',
          responsibilities: [
            '1. Add tools to draw delivery zones on the map',
            '2. Build toggle switches for email and SMS alerts',
          ],
        },
      ],
      userFlow: [
        { step: 1, from: 'Login & Dispatcher Sign-In', to: 'Fleet Overview Map', action: 'Log in', description: 'Dispatcher logs in and sees all active trucks on the live map.' },
        { step: 2, from: 'Fleet Overview Map', to: 'Vehicle Telemetry Detail', action: 'Click a truck', description: 'Dispatcher clicks on an active truck to inspect its engine status.' },
        { step: 3, from: 'Vehicle Telemetry Detail', to: 'Alerts & Incidents Hub', action: 'Investigate alert', description: 'Checks an alert showing check-engine trouble code.' },
        { step: 4, from: 'Alerts & Incidents Hub', to: 'Maintenance Schedule', action: 'Book repair ticket', description: 'Schedules the truck for maintenance at the nearest shop.' },
      ],
      teamAssignments: [
        {
          member: 'Salabadesh',
          role: 'Frontend Architect',
          assignedScreens: ['Fleet Overview Map'],
          assignedFiles: [
            'src/screens/FleetOverviewMapScreen.tsx',
            'src/components/MapDrawer.tsx',
          ],
          responsibilities: [
            'Build the main live map view and truck location pins',
            'Connect live coordinates so trucks move smoothly on the map',
            'Design the shared card components for other teammates',
          ],
          workloadPercentage: 25,
        },
        {
          member: 'Arun',
          role: 'Full Stack Engineer',
          assignedScreens: ['Vehicle Telemetry Detail', 'Login & Dispatcher Sign-In (Suggested)'],
          assignedFiles: [
            'src/screens/VehicleTelemetryDetailScreen.tsx',
            'src/screens/LoginScreen.tsx',
            'src/services/authHelper.ts',
          ],
          responsibilities: [
            'Build the login screen and protect pages from unauthorized users',
            'Create gauges and charts showing speed, fuel, and battery status',
            'Make sure driver assignment information loads cleanly',
          ],
          workloadPercentage: 25,
        },
        {
          member: 'Karthik',
          role: 'UI/UX Developer',
          assignedScreens: ['Maintenance Schedule', 'Settings & Delivery Zones (Suggested)'],
          assignedFiles: [
            'src/screens/MaintenanceScheduleScreen.tsx',
            'src/screens/SettingsScreen.tsx',
            'src/components/ScheduleCalendar.tsx',
          ],
          responsibilities: [
            'Create the drag-and-drop calendar for booking truck repairs',
            'Build the settings screen where managers draw delivery zones',
            'Ensure the buttons and forms are easy to click and look great',
          ],
          workloadPercentage: 25,
        },
        {
          member: 'Vijay',
          role: 'Backend/API Engineer',
          assignedScreens: ['Alerts & Incidents Hub'],
          assignedFiles: [
            'src/screens/AlertsIncidentsHubScreen.tsx',
            'src/services/alertsService.ts',
          ],
          responsibilities: [
            'Build the prioritized alert notifications list',
            'Add the button to resolve alerts and send SMS notifications to drivers',
            'Write the API routes to save and export alert histories',
          ],
          workloadPercentage: 25,
        },
      ],
      sharedModules: [
        { name: 'Live Data Connection', category: 'Networking', description: 'Keeps truck locations updating live without needing to reload the webpage.' },
        { name: 'User Login & Permissions', category: 'Security', description: 'Stores user login status and makes sure only authorized staff see company trucks.' },
        { name: 'Truck UI Kit', category: 'Components', description: 'Reusable buttons, gauges, status badges, and alert banners used across all screens.' },
        { name: 'GPS Distance Calculator', category: 'Helpers', description: 'Simple helper functions to calculate miles between delivery points and estimated arrival times.' },
      ],
      projectStructure: [
        { path: 'src/', type: 'dir', description: 'Application source root' },
        { path: 'src/screens/', type: 'dir', description: 'Screen components folder' },
        { path: 'src/screens/FleetOverviewMapScreen.tsx', type: 'file', assignedMember: 'Salabadesh', description: 'Main live map screen showing all trucks' },
        { path: 'src/screens/VehicleTelemetryDetailScreen.tsx', type: 'file', assignedMember: 'Arun', description: 'Truck gauges, speed, and fuel details screen' },
        { path: 'src/screens/MaintenanceScheduleScreen.tsx', type: 'file', assignedMember: 'Karthik', description: 'Calendar for scheduling truck maintenance' },
        { path: 'src/screens/AlertsIncidentsHubScreen.tsx', type: 'file', assignedMember: 'Vijay', description: 'List of urgent warnings and driver alerts' },
        { path: 'src/screens/LoginScreen.tsx', type: 'file', assignedMember: 'Arun', description: 'Login and password reset screen' },
        { path: 'src/screens/SettingsScreen.tsx', type: 'file', assignedMember: 'Karthik', description: 'Delivery zones and notification settings' },
        { path: 'src/components/', type: 'dir', description: 'Shared reusable UI elements' },
        { path: 'src/components/MapDrawer.tsx', type: 'file', assignedMember: 'Salabadesh', description: 'Slide-up drawer showing truck info' },
        { path: 'src/components/ScheduleCalendar.tsx', type: 'file', assignedMember: 'Karthik', description: 'Calendar component for repair visits' },
        { path: 'src/services/', type: 'dir', description: 'API helper functions' },
        { path: 'src/services/authHelper.ts', type: 'file', assignedMember: 'Arun', description: 'Login helper and token storage' },
        { path: 'src/services/alertsService.ts', type: 'file', assignedMember: 'Vijay', description: 'Alert dispatch and export functions' },
        { path: 'src/types/', type: 'dir', description: 'TypeScript interfaces' },
        { path: 'package.json', type: 'file', assignedMember: 'Shared / All', description: 'Project dependencies and scripts' },
        { path: 'README.md', type: 'file', assignedMember: 'Shared / All', description: 'Team guide and setup instructions' },
      ],
      githubPlan: {
        baseBranch: 'main',
        branches: [
          { name: 'feature/salabadesh-fleet-map', member: 'Salabadesh', purpose: 'Build Fleet Overview Map view and pins' },
          { name: 'feature/arun-telemetry-detail', member: 'Arun', purpose: 'Build Vehicle Telemetry Detail and Login' },
          { name: 'feature/karthik-maintenance-calendar', member: 'Karthik', purpose: 'Build Maintenance Calendar and Settings' },
          { name: 'feature/vijay-alerts-hub', member: 'Vijay', purpose: 'Build Alerts Hub and notification triggers' },
        ],
        workflowSteps: [
          { step: 1, phase: 'Pull', title: 'Get Newest Code', command: 'git checkout main && git pull origin main', description: 'Always pull the latest code from GitHub before starting your task.' },
          { step: 2, phase: 'Branch', title: 'Make Your Feature Branch', command: 'git checkout -b feature/<name>-<screen>', description: 'Create your own branch so your code does not conflict with teammates.' },
          { step: 3, phase: 'Develop', title: 'Build Your Assigned Screen', command: 'npm run dev', description: 'Open your assigned screen file and build the buttons and layout.' },
          { step: 4, phase: 'Commit', title: 'Save Your Progress', command: 'git add . && git commit -m "feat(screen): initial layout"', description: 'Save your work with a clear message explaining what you built.' },
          { step: 5, phase: 'Push', title: 'Upload to GitHub', command: 'git push -u origin feature/<name>-<screen>', description: 'Push your branch so your teammates can see your progress.' },
          { step: 6, phase: 'Pull Request', title: 'Open a Pull Request (PR)', command: 'gh pr create --base main --title "[Feature] Add screen placeholder"', description: 'Ask a teammate to review your work.' },
          { step: 7, phase: 'Merge', title: 'Merge into Main', command: 'git checkout main && git pull origin main', description: 'Once approved, merge your screen into the main codebase.' },
        ],
      },
      implementationNotes: [
        'Each developer should check out their branch first and locate their assigned file in src/screens/.',
        'Build the visual layout and buttons first before connecting live backend data.',
      ],
    },
  };
}
