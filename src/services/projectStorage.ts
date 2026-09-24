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
        'OmniTrack is an enterprise-grade telematics management platform designed to eliminate fleet downtime and enhance driver safety. By ingesting high-frequency CAN-bus sensor streams and GPS beacons, it provides logistics dispatchers with real-time route monitoring, predictive maintenance notifications, and comprehensive driver safety scoring.',
      targetUsers: [
        'Fleet Dispatchers monitoring live vehicles and ETAs',
        'Fleet Maintenance Technicians reviewing repair cycles and OBD-II trouble codes',
        'Logistics Operations Directors analyzing fuel efficiency and driver safety metrics',
      ],
      coreFeatures: [
        {
          title: 'Real-Time Map & Breadcrumb Tracking',
          description: 'Live SVG/WebGL vehicle markers with vector movement heading, speed indicators, and geofence boundary alerts.',
          complexity: 'High',
        },
        {
          title: 'Predictive Diagnostics Engine',
          description: 'Tracks engine runtime hours, brake wear telemetry, and oil life to automatically schedule preventative shop visits.',
          complexity: 'Medium',
        },
        {
          title: 'Incident & Anomaly Feed',
          description: 'Immediate alert notifications for hard braking, speeding, and erratic route deviations with instant driver notification.',
          complexity: 'Medium',
        },
        {
          title: 'Driver Performance & Fuel Efficiency Scorecards',
          description: 'Comparative analytics correlating driving habits with gallon-per-mile fuel economy and idle times.',
          complexity: 'Low',
        },
      ],
      screens: [
        {
          name: 'Fleet Overview Map',
          purpose: 'High-density interactive map displaying all active vehicles, geofences, and live operational status.',
          priority: 'Must Have',
          assignedMember: 'Salabadesh',
          responsibilities: [
            'Integrate Mapbox / Leaflet map viewport and clustering',
            'Handle WebSocket position push streams with smooth interpolation',
            'Build bottom drawer for quick vehicle inspection',
          ],
        },
        {
          name: 'Vehicle Telemetry Detail',
          purpose: 'Granular telemetry view for a specific truck: engine diagnostics, fuel gauge, tire pressure, and route history.',
          priority: 'Must Have',
          assignedMember: 'Arun',
          responsibilities: [
            'Render CAN-bus sensor gauges and historical time-series charts',
            'Provide OBD-II diagnostic trouble code lookups and clearing controls',
            'Display driver assignment and current cargo payload manifest',
          ],
        },
        {
          name: 'Maintenance Schedule',
          purpose: 'Calendar and kanban board for scheduled shop visits, part orders, and inspection checklists.',
          priority: 'Should Have',
          assignedMember: 'Karthik',
          responsibilities: [
            'Build drag-and-drop maintenance scheduling calendar',
            'Implement work order submission modal with parts checklist',
            'Track vehicle return-to-service sign-off workflows',
          ],
        },
        {
          name: 'Alerts & Incidents Hub',
          purpose: 'Prioritized event feed for threshold violations, harsh braking, geofence breaches, and SOS panic calls.',
          priority: 'Must Have',
          assignedMember: 'Vijay',
          responsibilities: [
            'Build real-time triage feed with filter by severity and vehicle group',
            'Implement alert acknowledgement and dispatcher dispatch actions',
            'Export incident summary reports to PDF and CSV',
          ],
        },
      ],
      aiSuggestedScreens: [
        {
          name: 'Authentication & Dispatcher Login',
          purpose: 'Secure session sign-in, MFA token verification, and depot role provisioning.',
          priority: 'Must Have',
          assignedMember: 'Arun',
          responsibilities: [
            'Build login form with biometric/hardware key support',
            'Securely store JWT tokens in HTTP-only cookies and memory',
          ],
        },
        {
          name: 'Fleet Settings & Geofence Manager',
          purpose: 'Define circular and polygon geofences, set speed limits, and manage API gateway webhooks.',
          priority: 'Should Have',
          assignedMember: 'Karthik',
          responsibilities: [
            'Map polygon drawing tool for geofence definition',
            'Configure alert webhook destination endpoints',
          ],
        },
      ],
      userFlow: [
        { step: 1, from: 'Authentication & Dispatcher Login', to: 'Fleet Overview Map', action: 'Login & Select Depot', description: 'Dispatcher authenticates and lands on active fleet geographic map.' },
        { step: 2, from: 'Fleet Overview Map', to: 'Vehicle Telemetry Detail', action: 'Click Vehicle Marker', description: 'Dispatcher inspects an active truck experiencing irregular speed.' },
        { step: 3, from: 'Vehicle Telemetry Detail', to: 'Alerts & Incidents Hub', action: 'Investigate Critical Alert', description: 'Traces diagnostic trouble code triggering the check engine light.' },
        { step: 4, from: 'Alerts & Incidents Hub', to: 'Maintenance Schedule', action: 'Schedule Service Ticket', description: 'Assigns vehicle to nearest maintenance depot and reserves parts.' },
      ],
      teamAssignments: [
        {
          member: 'Salabadesh',
          role: 'Frontend Architect',
          assignedScreens: ['Fleet Overview Map'],
          responsibilities: [
            'Lead map rendering engine and WebSocket streaming pipeline',
            'Design shared component library and responsive layout containers',
          ],
          workloadPercentage: 25,
        },
        {
          member: 'Arun',
          role: 'Full Stack Engineer',
          assignedScreens: ['Vehicle Telemetry Detail', 'Authentication & Dispatcher Login (Suggested)'],
          responsibilities: [
            'Build high-frequency telemetry visualization charts',
            'Implement secure authentication flows and session guards',
          ],
          workloadPercentage: 25,
        },
        {
          member: 'Karthik',
          role: 'UI/UX Developer',
          assignedScreens: ['Maintenance Schedule', 'Fleet Settings & Geofence Manager (Suggested)'],
          responsibilities: [
            'Craft intuitive drag-and-drop maintenance scheduling calendar',
            'Implement interactive polygon geofence drawing interface',
          ],
          workloadPercentage: 25,
        },
        {
          member: 'Vijay',
          role: 'Backend/API Engineer',
          assignedScreens: ['Alerts & Incidents Hub'],
          responsibilities: [
            'Build real-time triage feed and SSE alert dispatcher',
            'Architect database models for telemetry history and export services',
          ],
          workloadPercentage: 25,
        },
      ],
      sharedModules: [
        { name: 'WebSocket Realtime Client', category: 'Networking', description: 'Resilient bidirectional socket connection with auto-reconnect and heartbeat.' },
        { name: 'Auth & Depot Context', category: 'Security', description: 'User permissions, active depot scoping, and role enforcement guards.' },
        { name: 'Telemetry UI Kit', category: 'UI Components', description: 'Gauges, status badges, vehicle icons, and severity alert banners.' },
        { name: 'Geo Calculations Utility', category: 'Utils', description: 'Haversine distance formulas, bearing calculations, and speed unit conversions.' },
      ],
      projectStructure: [
        { path: 'src/', type: 'dir', description: 'Application source' },
        { path: 'src/screens/', type: 'dir', description: 'Screen components' },
        { path: 'src/screens/FleetOverviewMapScreen.tsx', type: 'file', description: 'Assigned: Salabadesh' },
        { path: 'src/screens/VehicleTelemetryDetailScreen.tsx', type: 'file', description: 'Assigned: Arun' },
        { path: 'src/screens/MaintenanceScheduleScreen.tsx', type: 'file', description: 'Assigned: Karthik' },
        { path: 'src/screens/AlertsIncidentsHubScreen.tsx', type: 'file', description: 'Assigned: Vijay' },
        { path: 'src/components/', type: 'dir', description: 'Shared components' },
        { path: 'src/services/', type: 'dir', description: 'API & socket clients' },
        { path: 'src/types/', type: 'dir', description: 'TypeScript interfaces' },
        { path: 'package.json', type: 'file', description: 'Manifest' },
        { path: 'README.md', type: 'file', description: 'Documentation' },
      ],
      githubPlan: {
        baseBranch: 'main',
        branches: [
          { name: 'feature/salabadesh-fleet-map', member: 'Salabadesh', purpose: 'Scaffold Fleet Overview Map view' },
          { name: 'feature/arun-telemetry-detail', member: 'Arun', purpose: 'Scaffold Vehicle Telemetry Detail view' },
          { name: 'feature/karthik-maintenance-calendar', member: 'Karthik', purpose: 'Scaffold Maintenance Schedule view' },
          { name: 'feature/vijay-alerts-hub', member: 'Vijay', purpose: 'Scaffold Alerts & Incidents Hub view' },
        ],
        workflowSteps: [
          { step: 1, phase: 'Pull', title: 'Synchronize Base Branch', command: 'git checkout main && git pull origin main', description: 'Sync with remote origin before starting.' },
          { step: 2, phase: 'Branch', title: 'Create Feature Branch', command: 'git checkout -b feature/<name>-<screen>', description: 'Create isolated branch following naming convention.' },
          { step: 3, phase: 'Develop', title: 'Scaffold Screen Skeleton', command: 'npm run dev', description: 'Implement empty screen placeholders and verify layout.' },
          { step: 4, phase: 'Commit', title: 'Atomic Conventional Commits', command: 'git add . && git commit -m "feat(screen): initial skeleton"', description: 'Commit progress cleanly.' },
          { step: 5, phase: 'Push', title: 'Push to Remote Repository', command: 'git push -u origin feature/<name>-<screen>', description: 'Push branch to GitHub.' },
          { step: 6, phase: 'Pull Request', title: 'Open PR for Code Review', command: 'gh pr create --base main --title "[Feature] Implement screen skeleton"', description: 'Request teammate review.' },
          { step: 7, phase: 'Merge', title: 'Squash & Merge', command: 'git checkout main && git pull origin main', description: 'Merge verified work into main.' },
        ],
      },
      implementationNotes: [
        'Establish mock telemetry data generators early so frontend work is unblocked before the hardware feed is online.',
        'Use React.memo on high-frequency map vehicle markers to avoid unnecessary canvas rerenders.',
      ],
    },
  };
}
