import { ProjectBlueprint, ProjectInput } from '@/types/project';

export function downloadJsonFile(filename: string, data: any) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.json') ? filename : `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadMarkdownFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.md') ? filename : `${filename}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateMarkdownReport(input: ProjectInput, blueprint: ProjectBlueprint): string {
  const allScreensCount = blueprint.screens.length + (blueprint.aiSuggestedScreens?.length || 0);

  return `# ${input.projectName} — AI Architecture Blueprint
*Generated with TeamForge AI (Powered by Google Gemini)*

## 1. Project Overview
${blueprint.projectOverview}

- **Technology / Framework:** ${input.technology}
- **Team Size:** ${input.teamMembers.length} Members
- **Total Screens:** ${allScreensCount}
- **Core Features:** ${blueprint.coreFeatures.length}

### Target Users
${blueprint.targetUsers.map((u) => `- ${u}`).join('\n')}

---

## 2. Team Workload Distribution
${blueprint.teamAssignments
  .map(
    (t) => `### ${t.member} — ${t.role} (${t.workloadPercentage || Math.round(100 / blueprint.teamAssignments.length)}% Workload)
**Assigned Screens:**
${t.assignedScreens.map((s) => `- ${s}`).join('\n')}

**Key Responsibilities:**
${t.responsibilities.map((r) => `- ${r}`).join('\n')}
`
  )
  .join('\n')}

---

## 3. Screen Architecture
${blueprint.screens
  .map(
    (s, idx) => `### Screen ${idx + 1}: ${s.name} [Priority: ${s.priority}]
- **Primary Owner:** ${s.assignedMember}
- **Purpose:** ${s.purpose}
- **Responsibilities:**
${s.responsibilities.map((r) => `  - ${r}`).join('\n')}
`
  )
  .join('\n')}

${
  blueprint.aiSuggestedScreens && blueprint.aiSuggestedScreens.length > 0
    ? `\n## 4. AI Suggested Screens (Identified Missing)
> The following screens were identified as missing from the initial specification and are recommended for a production-ready application:

${blueprint.aiSuggestedScreens
  .map(
    (s, idx) => `### Suggested Screen ${idx + 1}: ${s.name} [Priority: ${s.priority}]
- **Assigned Developer:** ${s.assignedMember}
- **Purpose:** ${s.purpose}
- **Responsibilities:**
${s.responsibilities.map((r) => `  - ${r}`).join('\n')}
`
  )
  .join('\n')}
`
    : ''
}

---

## 5. Visual User Flow
${blueprint.userFlow
  .map((flow) => `Step ${flow.step}: **${flow.from}** ➔ **${flow.to}** (Action: _${flow.action}_)\n  - ${flow.description}`)
  .join('\n\n')}

---

## 6. Shared Architectural Modules
| Module Name | Category | Architectural Scope |
|---|---|---|
${blueprint.sharedModules
  .map((m) => `| **${m.name}** | \`${m.category}\` | ${m.description} |`)
  .join('\n')}

---

## 7. Recommended Project Structure
\`\`\`
${blueprint.projectStructure.map((p) => `${p.path}   # ${p.description || ''}`).join('\n')}
\`\`\`

---

## 8. GitHub Collaboration Plan

### Recommended Branch Strategy
${blueprint.githubPlan.branches
  .map((b) => `- \`${b.name}\` -> Owner: **${b.member}** (${b.purpose})`)
  .join('\n')}

### Collaboration Guide
${blueprint.githubPlan.workflowSteps
  .map(
    (s) => `#### Step ${s.step}: ${s.phase} — ${s.title}
\`\`\`bash
${s.command}
\`\`\`
${s.description}
`
  )
  .join('\n')}

---

## 9. Implementation Notes
${blueprint.implementationNotes.map((n) => `- ${n}`).join('\n')}
`;
}

export function copyTeamAssignmentsToClipboard(blueprint: ProjectBlueprint): string {
  const text = blueprint.teamAssignments
    .map((t) => {
      return `👤 ${t.member} (${t.role}) [${t.workloadPercentage || Math.round(100 / blueprint.teamAssignments.length)}% Workload]:
Screens:
${t.assignedScreens.map((s) => `  • ${s}`).join('\n')}
Responsibilities:
${t.responsibilities.map((r) => `  • ${r}`).join('\n')}`;
    })
    .join('\n\n');

  return text;
}

export function copyGithubPlanToClipboard(blueprint: ProjectBlueprint): string {
  const branches = blueprint.githubPlan.branches
    .map((b) => `• Branch: ${b.name} | Assigned: ${b.member} (${b.purpose})`)
    .join('\n');

  const steps = blueprint.githubPlan.workflowSteps
    .map((s) => `${s.step}. ${s.phase}: ${s.command}\n   ${s.description}`)
    .join('\n\n');

  return `=== GITHUB COLLABORATION PLAN ===

BRANCHES:
${branches}

WORKFLOW:
${steps}`;
}
